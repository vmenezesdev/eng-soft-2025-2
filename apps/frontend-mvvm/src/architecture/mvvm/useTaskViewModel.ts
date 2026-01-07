import { useSyncExternalStore, useMemo } from "react";
import type { TaskViewModel } from "./TaskViewModel";

export function useTaskViewModel(vm: TaskViewModel) {
  const tasks = useSyncExternalStore(
    (onStoreChange) => vm.subscribe(onStoreChange),
    () => vm.getSnapshot()
  );

  return useMemo(() => ({
    tasks,
    loadTasks: () => vm.loadTasks(),
    createTask: (title: string) => vm.createTask(title),
    updateTask: (id: string, title: string) => vm.updateTask(id, title),
    deleteTask: (id: string) => vm.deleteTask(id),
  }), [vm, tasks]);
}
