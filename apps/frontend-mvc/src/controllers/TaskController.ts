import type { Task } from "todo-domain";
import { TaskStore } from "todo-store";
import { TaskGateway } from "todo-gateway";

export class TaskController {
  constructor(
    private readonly store: TaskStore,
    private readonly gateway: TaskGateway
  ) {}

  async loadTasks(): Promise<void> {
    const tasks = await this.gateway.getAll();
    this.store.set(tasks);
  }

  async createTask(title: string): Promise<void> {
    const task = await this.gateway.create({ title });
    this.store.upsert(task);
  }

  async deleteTask(id: string): Promise<void> {
    await this.gateway.delete(id);
    this.store.removeById(id);
  }
}
