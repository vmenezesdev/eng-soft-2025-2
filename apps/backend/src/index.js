import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

import restRoutes from './rest/routes.js';
import taskStore from './store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api', restRoutes);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
    const clientCount = io.engine.clientsCount;
    io.emit('clientes-conectados', clientCount);
    socket.emit('tarefas-iniciais', taskStore.getAll());

    socket.on('criar-tarefa', (titulo) => {
        const novaTarefa = taskStore.create(titulo);
        io.emit('tarefa-criada', novaTarefa);
    });

    socket.on('excluir-tarefa', (id) => {
        const tarefa = taskStore.getById(id);
        if (tarefa) {
            taskStore.delete(id);
            io.emit('tarefa-excluida', id);
        }
    });

    socket.on('editar-tarefa', ({ id, title, completed }) => {
        const tarefaAtualizada = taskStore.update(id, { title, completed });
        if (tarefaAtualizada) {
            io.emit('tarefa-atualizada', tarefaAtualizada);
        }
    });

    socket.on('listar-tarefas', () => {
        socket.emit('tarefas-iniciais', taskStore.getAll());
    });

    socket.on('disconnect', () => {
        const updatedCount = io.engine.clientsCount;
        io.emit('clientes-conectados', updatedCount);
    });
});

app.get('/', (req, res) => {
    res.json({
        status: 'online',
        message: 'Backend Todo App com Socket.IO',
        endpoints: {
            rest: '/api/tasks',
            websocket: 'ws://localhost:3000'
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});