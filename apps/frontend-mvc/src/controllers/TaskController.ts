import { TaskStore } from "todo-store";
import type { TaskGateway } from "todo-gateway";

export class TaskController {
  private readonly store: TaskStore;
  private readonly gateway: TaskGateway;

  constructor(store: TaskStore, gateway: TaskGateway) {
    this.store = store;
    this.gateway = gateway;
  }

  async loadTasks(): Promise<void> {
    const result = await this.gateway.getAll();
    if (result.tag === "ok") {
      this.store.set(result.value);
    }
  }

  async createTask(title: string): Promise<void> {
    const result = await this.gateway.create(title);
    if (result.tag === "some") {
      this.store.upsert(result.value);
    }
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.gateway.delete(id);
    if (result.tag === "ok") {
      this.store.removeById(id);
    }
  }
}
