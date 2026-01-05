import type { Subject } from './Observer.ts';
import { StoreObserver } from './StoreObserver.js';
import type { Task } from '@repo/packages/todo-domain';

export class TaskStore implements Subject {
  private tasks: Task[] = [];
  private observers: StoreObserver[] = [];

  attach(observer: StoreObserver): void {
    if (!this.observers.includes(observer)) this.observers.push(observer);
  }

  detach(observer: StoreObserver): void {
    this.observers = this.observers.filter(o => o !== observer);
  }

  notify(): void {
    for (const o of this.observers) o.update(this);
  }

  // React/external-store API
  subscribe(listener: () => void): () => void {
    const o = new StoreObserver(listener);
    this.attach(o);
    return () => this.detach(o);
  }

  getSnapshot(): Task[] {
    return this.tasks.slice(); // return a copy to prevent external mutation
  }

  // State primitives (infra)
  set(tasks: Task[]): void {
    this.tasks = tasks;
    this.notify();
  }

  upsert(task: Task): void {
    const i = this.tasks.findIndex(t => t.id === task.id);
    this.tasks = i === -1
      ? [task, ...this.tasks]
      : this.tasks.map(t => (t.id === task.id ? task : t));
    this.notify();
  }

  removeById(id: string): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.notify();
  }
}
