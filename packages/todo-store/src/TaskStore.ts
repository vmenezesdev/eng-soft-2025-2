import type { Subject } from './Observer.ts';
import { StoreObserver } from './StoreObserver.js';
import type { Task } from '@repo/packages/todo-domain';

export class TaskStore implements Subject {

    private state: Task[] = [];
    private observers: StoreObserver[] = [];

    // Attach an observer to the subject.
    attach(observer: StoreObserver): void {
        const isExist = this.observers.includes(observer);
        if (isExist) {
            return console.log('Subject: Observer has been attached already.');
        }

        console.log('Subject: Attached an observer.');
        this.observers.push(observer);
    }

    // Detach an observer from the subject.
    detach(observer: StoreObserver): void {
        const observerIndex = this.observers.indexOf(observer);
        if (observerIndex === -1) {
            return console.log('Subject: Nonexistent observer.');
        }

        this.observers.splice(observerIndex, 1);
        console.log('Subject: Detached an observer.');
    }

    // Notify all observers about an event.
    notify(): void {
        console.log('Subject: Notifying observers...');
        for (const observer of this.observers) {
            observer.update(this);
        }
    }

    // --- Convenience API for React integration and domain usage ---

    /**
     * Subscribe a simple callback (for useSyncExternalStore). Returns an unsubscribe function.
     * Implementation uses the concrete StoreObserver as an adapter.
     */
    subscribe(listener: () => void): () => void {
        const adapter = new StoreObserver(listener);

        this.attach(adapter);
        return () => this.detach(adapter);
    }

    /** Return a shallow copy of current tasks (snapshot for pull model). */
    getSnapshot(): Task[] {
        return [...this.state];
    }

    /** Replace entire task list (useful for initial load). */
    setTasks(tasks: Task[]): void {
        this.state = [...tasks];
        this.notify();
    }

    /** Add a new task to the store (newest first). */
    addTask(task: Task): void {
        this.state = [task, ...this.state];
        this.notify();
    }

    /** Update an existing task by id. */
    updateTask(task: Task): void {
        this.state = this.state.map(t => t.id === task.id ? task : t);
        this.notify();
    }

    /** Remove a task by id. */
    removeTask(id: string): void {
        this.state = this.state.filter(t => t.id !== id);
        this.notify();
    }

    /** Convenience helpers */
    getTasks(): Task[] { return this.getSnapshot(); }
    findById(id: string): Task | undefined { return this.state.find(t => t.id === id); }
    hasTasks(): boolean { return this.state.length > 0; }
}
