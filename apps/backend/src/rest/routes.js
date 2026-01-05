import { Router } from "express";
import taskStore from '../store.js';

const router = Router();

router.get('/tasks', (req, res) => {
    res.json(taskStore.getAll());
});

router.post('/tasks', (req, res) => {
    const { title } = req.body;
    if(!title) {
        return res.status(400).json({ error: 'Titulo nao pode ser vazio'});
    }
    const newTask = taskStore.create(title);
    req.io.emit('tarefa-criada', newTask);
    res.status(201).json(newTask);
});

router.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;
    const taskAtualizada = taskStore.update(parseInt(id), { title, completed });
    if (!taskAtualizada) {
        return res.status(404).json({ error: 'Tarefa nao encontrada' });
    }
    req.io.emit('tarefa-atualizada', taskAtualizada);
    res.json(taskAtualizada);
});

router.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const task = taskStore.getById(parseInt(id));
    if (!task) {
        return res.status(404).json({ error: 'Tarefa nao encontrada' });
    }
    const deletada = taskStore.delete(parseInt(id));
    if (deletada) {
        req.io.emit('tarefa-excluida', parseInt(id));
        res.status(204).send();
    } else {
        res.status(500).json({ error: 'Erro ao excluir tarefa' });
    }
});

export default router;