import { useSyncExternalStore } from "react";
import { taskStore, taskController } from "../wiring/taskWiring";
import type { Task } from "todo-domain";

export function useTasks(): {
  tasks: Task[];
  load: () => void;
  create: (title: string) => void;
  remove: (id: string) => void;
} {
  const tasks = useSyncExternalStore(
    (listener) => taskStore.subscribe(listener),
    () => taskStore.getSnapshot()
  );

  return {
    tasks,
    load: () => taskController.loadTasks(),
    create: (title) => taskController.createTask(title),
    remove: (id) => taskController.deleteTask(id),
  };
}
