import { useSyncExternalStore, useCallback, useMemo } from "react";
import { taskPresenter } from "../wiring/taskWiring";
import type { TaskViewItem, TasksView } from "../presenter/TaskPresenter";

export function useTasks(): {
  tasks: TaskViewItem[];
  loading: boolean;
  error: string | null;
  modalState: "open" | "closed";
  load: () => Promise<void>;
  create: (title: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  remove: (id: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  update: (id: string, title: string) => Promise<{ ok: true } | { ok: false; error: string }>;
} {
  const view = useSyncExternalStore(
    (listener) => taskPresenter.subscribe(listener),
    () => taskPresenter.getSnapshot()
  ) as TasksView;

  const load = useCallback(() => taskPresenter.loadTasks(), []);
  const create = useCallback((title: string) => taskPresenter.createTask(title), []);
  const remove = useCallback((id: string) => taskPresenter.deleteTask(id), []);
  const update = useCallback((id: string, title: string) => taskPresenter.updateTask(id, title), []);

  return useMemo(
    () => ({
      tasks: view.tasks,
      loading: view.loading,
      error: view.error,
      modalState: view.modalState,
      load,
      create,
      remove,
      update,
    }),
    [view, load, create, remove, update]
  );
}
