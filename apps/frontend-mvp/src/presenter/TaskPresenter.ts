import { TaskStore } from "todo-store";
import type { TaskGateway } from "todo-gateway";
import type { Task } from "todo-domain";

export interface TaskViewItem {
  id: string;
  name: string;
  completed: boolean;
  // UI-only flags
  isEditing?: boolean;
}

export interface TasksView {
  tasks: TaskViewItem[];
  modalState: "open" | "closed";
  loading: boolean;
  error: string | null;
}

export class TaskPresenter {
  private readonly store: TaskStore;
  private readonly gateway: TaskGateway;
  private readonly listeners = new Set<() => void>();
  private viewState: TasksView = {
    tasks: [],
    modalState: "closed",
    loading: false,
    error: null,
  };
  private unsubscribeFromStore?: () => void;

  constructor(store: TaskStore, gateway: TaskGateway) {
    this.store = store;
    this.gateway = gateway;
    // keep presenter-local UI state in sync with underlying store
    this.unsubscribeFromStore = this.store.subscribe(() => this.syncFromStore());
    this.syncFromStore();
  }

  // Views subscribe to presenter (NOT to store)
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    for (const l of this.listeners) l();
  }

  // Snapshot API for useSyncExternalStore
  getSnapshot(): TasksView {
    return { ...this.viewState, tasks: this.viewState.tasks.slice() };
  }

  private mapTaskToView(t: Task): TaskViewItem {
    return {
      id: t.id,
      name: t.title,
      completed: Boolean((t as any).completed),
    };
  }

  private syncFromStore(): void {
    const tasks = this.store.getSnapshot();
    this.viewState.tasks = tasks.map((t) => this.mapTaskToView(t));
    this.notify();
  }

  private setLoading(v: boolean) {
    this.viewState.loading = v;
    this.notify();
  }

  private setError(e: string | null) {
    this.viewState.error = e;
    this.notify();
  }

  private isInvalidTitleTag(tag: string): boolean {
    return tag === "invalid-title" || tag === "invalid_title";
  }

  async loadTasks(): Promise<void> {
    this.setLoading(true);
    this.setError(null);
    try {
      const result = await this.gateway.getAll();
      if (result.tag === "ok") {
        this.store.set(result.value); // store subscription will call syncFromStore -> notify
        return;
      }
      this.setError("Erro ao carregar tarefas");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.setError(msg);
    } finally {
      this.setLoading(false);
    }
  }

  async createTask(title: string): Promise<{ ok: true } | { ok: false; error: string }> {
    this.setLoading(true);
    this.setError(null);
    try {
      const maybe = await this.gateway.create(title);
      if (maybe.tag === "some") {
        await this.loadTasks(); // will sync store and notify views
        return { ok: true };
      }
      if (this.isInvalidTitleTag(maybe.tag)) {
        this.setError("Título inválido");
        return { ok: false, error: "Título inválido" };
      }
      this.setError("Erro ao criar tarefa");
      return { ok: false, error: "Erro ao criar tarefa" };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.setError(msg);
      return { ok: false, error: msg };
    } finally {
      this.setLoading(false);
    }
  }

  async updateTask(id: string, title: string): Promise<{ ok: true } | { ok: false; error: string }> {
    this.setLoading(true);
    this.setError(null);
    try {
      const res = await this.gateway.update(id, title);
      if (res.tag === "ok") {
        await this.loadTasks();
        return { ok: true };
      }
      if (this.isInvalidTitleTag(res.tag)) {
        this.setError("Título inválido");
        return { ok: false, error: "Título inválido" };
      }
      this.setError("Erro ao atualizar tarefa");
      return { ok: false, error: "Erro ao atualizar tarefa" };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.setError(msg);
      return { ok: false, error: msg };
    } finally {
      this.setLoading(false);
    }
  }

  async deleteTask(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
    this.setLoading(true);
    this.setError(null);
    try {
      // gateway method might be `remove`; adapt if your gateway uses `delete`
      const res = await (this.gateway as any).remove(id);
      if (res.tag === "ok") {
        await this.loadTasks();
        return { ok: true };
      }
      this.setError("Erro ao remover tarefa");
      return { ok: false, error: "Erro ao remover tarefa" };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.setError(msg);
      return { ok: false, error: msg };
    } finally {
      this.setLoading(false);
    }
  }
}
