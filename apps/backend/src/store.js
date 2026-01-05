import { randomUUID } from 'crypto';

class TaskStore {
    constructor() {
        this.tasks = new Map();
    }

    getAll() {
        return Array.from(this.tasks.values()).sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );
    }

    getById(id) {
        return this.tasks.get(id);
    }

    create(title) {
        if (!title || title.trim().length === 0) {
            throw new Error('Title cannot be empty');
        }
        if (title.length > 500) {
            throw new Error('Title must be 500 characters or less');
        }

        const now = new Date().toISOString();
        const task = {
            id: randomUUID(),
            title: title.trim(),
            createdAt: now,
            updatedAt: now
        };
        
        this.tasks.set(task.id, task);
        return task;
    }

    update(id, newTitle) {
        if (!newTitle || newTitle.trim().length === 0) {
            throw new Error('Title cannot be empty');
        }
        if (newTitle.length > 500) {
            throw new Error('Title must be 500 characters or less');
        }

        const task = this.tasks.get(id);
        if (!task) {
            throw new Error('Task not found');
        }

        task.title = newTitle.trim();
        task.updatedAt = new Date().toISOString();
        
        return task;
    }

    delete(id) {
        if (!this.tasks.has(id)) {
            throw new Error('Task not found');
        }
        return this.tasks.delete(id);
    }
}

const taskStore = new TaskStore();
export default taskStore;