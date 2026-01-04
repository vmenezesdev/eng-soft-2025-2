class TaskStore {
    constructor() {
        this.tasks = new Map();
        this.nextId = 1;
    }

    getAll() {
        return Array.from(this.tasks.values());
    }

    getById(id) {
        return this.tasks.get(id);
    }

    create(title) {
        const task = {
            id: this.nextId++,
            title,
            completed: false,
            createdAt: new Date().toISOString()
        };
        this.tasks.set(task.id, task);
        return task;
    }

    update(id, updates) {
        const task = this.tasks.get(id);
        if (!task) return null;
        if (updates.title !== undefined) task.title = updates.title;
        if (updates.completed !== undefined) task.completed = updates.completed;
        task.updatedAt = new Date().toISOString();
        return task;
    }

    delete(id) {
        return this.tasks.delete(id);
    }
}

const taskStore = new TaskStore();
export default taskStore;