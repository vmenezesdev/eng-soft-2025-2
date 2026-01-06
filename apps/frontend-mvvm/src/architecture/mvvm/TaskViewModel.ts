import { validateTitle, type Task } from "todo-domain";
import type { TaskGateway } from "todo-gateway";
import type { TaskStore } from "todo-store";

type VmError =
  | { kind: "validation"; message: string }
  | { kind: "gateway"; message: string }
  | { kind: "unknown"; message: string };

type VmResult<T = void> =
  | { ok: true; value: T }
  | { ok: false; error: VmError };

export class TaskViewModel {
  private readonly store: TaskStore;
  private readonly gateway: TaskGateway;
  private readonly logger: Pick<Console, "error">;

  constructor(store: TaskStore, gateway: TaskGateway, logger: Pick<Console, "error"> = console) {
    this.store = store;
    this.gateway = gateway;
    this.logger = logger;
  }

  subscribe(listener: () => void): () => void {
    return this.store.subscribe(listener);
  }

  getSnapshot(): Task[] {
    return this.store.getSnapshot();
  }

  private validateTitleOrError(title: string): VmResult<void> {
    const v = validateTitle(title);
    if (v === "valid") return { ok: true, value: undefined };
    return { ok: false, error: { kind: "validation", message: v } };
  }

  async loadTasks(): Promise<VmResult<Task[]>> {
    try {
      const res = await this.gateway.getAll();
      if (res.tag === "ok") {
        this.store.set(res.value);
        return { ok: true, value: res.value };
      }
      return { ok: false, error: { kind: "gateway", message: String(res.error ?? "Failed to load tasks") } };
    } catch (e) {
      this.logger.error("loadTasks failed:", e);
      return { ok: false, error: { kind: "unknown", message: "Unknown error while loading tasks" } };
    }
  }

  async createTask(title: string): Promise<VmResult<Task>> {
    const valid = this.validateTitleOrError(title);
    if (!valid.ok) return valid;

    try {
      const res = await this.gateway.create(title);
      if (res.tag === "some") {
        this.store.upsert(res.value);
        return { ok: true, value: res.value };
      }
      return { ok: false, error: { kind: "gateway", message: "Gateway error while creating task" } };
    } catch (e) {
      this.logger.error("createTask failed:", e);
      return { ok: false, error: { kind: "unknown", message: "Unknown error while creating task" } };
    }
  }

  async updateTask(id: string, title: string): Promise<VmResult<Task>> {
    const valid = this.validateTitleOrError(title);
    if (!valid.ok) return valid;

    try {
      const res = await this.gateway.update(id, title);
      if (res.tag === "ok") {
        this.store.upsert(res.value);
        return { ok: true, value: res.value };
      }
      return { ok: false, error: { kind: "gateway", message: "Gateway error while updating task" } };
    } catch (e) {
      this.logger.error("updateTask failed:", e);
      return { ok: false, error: { kind: "unknown", message: "Unknown error while updating task" } };
    }
  }

  async deleteTask(id: string): Promise<VmResult<void>> {
    try {
      const res = await this.gateway.delete(id);
      if (res.tag === "ok") {
        this.store.removeById(id);
        return { ok: true, value: undefined };
      }
      return { ok: false, error: { kind: "gateway", message: "Gateway error while deleting task" } };
    } catch (e) {
      this.logger.error("deleteTask failed:", e);
      return { ok: false, error: { kind: "unknown", message: "Unknown error while deleting task" } };
    }
  }
}
