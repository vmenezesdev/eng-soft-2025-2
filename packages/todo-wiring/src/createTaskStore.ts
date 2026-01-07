// createTaskStore.ts
import { TaskStore } from "todo-store";
import type { TaskGateway } from "todo-gateway";
import type { Maybe, Result, Task } from "todo-domain";

// --- Ajuste estes 2 guards conforme o shape real do seu domain ---
const isOk = <T, E>(r: Result<T, E>): r is { tag: "ok"; value: T } => r.tag === "ok";
const okValue = <T, E>(r: Result<T, E>): T => {
  if (r.tag === "ok") return r.value;
  throw new Error("Result is not ok");
};

const isSome = <T>(m: Maybe<T>): m is { tag: "some"; value: T } => m.tag === "some";
const someValue = <T>(m: Maybe<T>): T => {
  if (m.tag === "some") return m.value;
  throw new Error("Maybe is not some");
};

// API retornada: store + ações (fluxo fica fora do store)
export type TaskActions = {
  loadAll(): Promise<Result<Task[], "error">>;
  create(title: string): Promise<Maybe<Task>>;
  update(id: string, title: string): Promise<Result<Task, "not_found" | "invalid_title">>;
  remove(id: string): Promise<Result<"success", "not_found" | "error">>;
};

export function createTaskStore(gateway: TaskGateway): {
  store: TaskStore;
  actions: TaskActions;
} {
  const store = new TaskStore();

  // Subscribe to gateway events (Realtime mode support)
  gateway.subscribe((event) => {
    switch (event.kind) {
      case 'created':
      case 'updated':
        store.upsert(event.task);
        break;
      case 'deleted':
        store.removeById(event.id);
        break;
    }
  });

  const actions: TaskActions = {
    async loadAll() {
      const res = await gateway.getAll();
      if (isOk(res)) store.set(okValue(res));
      return res;
    },

    async create(title: string) {
      const maybe = await gateway.create(title);
      if (isSome(maybe)) store.upsert(someValue(maybe));
      return maybe;
    },

    async update(id: string, title: string) {
      const res = await gateway.update(id, title);
      if (isOk(res)) store.upsert(okValue(res));
      return res;
    },

    async remove(id: string) {
      const res = await gateway.delete(id);
      if (isOk(res)) store.removeById(id);
      return res;
    },
  };

  return { store, actions };
}

export type CreateTaskStoreResult = ReturnType<typeof createTaskStore>;