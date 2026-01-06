import { useSyncExternalStore, useCallback, useMemo } from "react";
import { taskStore, taskController } from "../wiring/taskWiring";
import type { Task } from "todo-domain";

export function useTasks(): {
  tasks: Task[];
  load: () => void;
  create: (title: string) => void;
  remove: (id: string) => void;
  update: (id: string, title: string) => void;
} {
  const tasks = useSyncExternalStore(
    (listener) => taskStore.subscribe(listener),
    () => taskStore.getSnapshot()
  );

  const load = useCallback(() => {
    taskController.loadTasks();
  }, []);

  const create = useCallback((title: string) => {
    taskController.createTask(title);
  }, []);

  const remove = useCallback((id: string) => {
    taskController.deleteTask(id);
  }, []);

  const update = useCallback((id: string, title: string) => {
    taskController.updateTask(id, title);
  }, []);

  return useMemo(
    () => ({
      tasks,
      load,
      create,
      remove,
      update,
    }),
    [tasks, load, create, remove, update]
  );
}
