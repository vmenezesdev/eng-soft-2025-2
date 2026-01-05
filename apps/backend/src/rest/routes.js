import { Router } from "express";
import taskStore from '../store.js';

const router = Router();

router.get('/tasks', (req, res) => {
    try {
        const tasks = taskStore.getAll();
        res.json({ tasks });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            details: { message: error.message }
        });
    }
});

router.post('/tasks', (req, res) => {
    const { title } = req.body;
    
    try {
        const task = taskStore.create(title);
        req.io.emit('task:created', { task });
        res.status(201).json(task);
    } catch (error) {
        if (error.message.includes('cannot be empty') || error.message.includes('500 characters')) {
            res.status(400).json({
                error: 'Validation failed',
                details: { title: error.message }
            });
        } else {
            res.status(500).json({
                error: 'Internal server error',
                details: { message: error.message }
            });
        }
    }
});

router.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    try {
        const task = taskStore.update(id, title);
        req.io.emit('task:updated', { task });
        res.json(task);
    } catch (error) {
        if (error.message.includes('Task not found')) {
            res.status(404).json({
                error: 'Task not found',
                details: { id }
            });
        } else if (error.message.includes('cannot be empty') || error.message.includes('500 characters')) {
            res.status(400).json({
                error: 'Validation failed',
                details: { title: error.message }
            });
        } else {
            res.status(500).json({
                error: 'Internal server error',
                details: { message: error.message }
            });
        }
    }
});

router.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    
    try {
        taskStore.delete(id);
        req.io.emit('task:deleted', { id });
        res.status(204).send();
    } catch (error) {
        if (error.message.includes('Task not found')) {
            res.status(404).json({
                error: 'Task not found',
                details: { id }
            });
        } else {
            res.status(500).json({
                error: 'Internal server error',
                details: { message: error.message }
            });
        }
    }
});

export default router;