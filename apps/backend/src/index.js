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
    console.log('Client connected:', socket.id);

    socket.on('task:list', () => {
        try {
            const tasks = taskStore.getAll();
            socket.emit('task:list', { tasks });
        } catch (error) {
            socket.emit('task:error', {
                error: error.message,
                operation: 'list'
            });
        }
    });

    socket.on('task:create', ({ title }) => {
        try {
            const task = taskStore.create(title);
            io.emit('task:created', { task });
        } catch (error) {
            socket.emit('task:error', {
                error: error.message,
                operation: 'create',
                details: { title }
            });
        }
    });

    socket.on('task:update', ({ id, title }) => {
        try {
            const task = taskStore.update(id, title);
            io.emit('task:updated', { task });
        } catch (error) {
            socket.emit('task:error', {
                error: error.message,
                operation: 'update',
                details: { id, title }
            });
        }
    });

    socket.on('task:delete', ({ id }) => {
        try {
            taskStore.delete(id);
            io.emit('task:deleted', { id });
        } catch (error) {
            socket.emit('task:error', {
                error: error.message,
                operation: 'delete',
                details: { id }
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
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