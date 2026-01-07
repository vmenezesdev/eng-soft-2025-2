import { useSyncExternalStore, useCallback } from "react";
import type { TaskViewModel } from "./TaskViewModel";

export function useTaskViewModel(vm: TaskViewModel) {
  const tasks = useSyncExternalStore(
    (onStoreChange) => vm.subscribe(onStoreChange),
    () => vm.getSnapshot()
  );

  const loadTasks = useCallback(() => vm.loadTasks(), [vm]);
  const createTask = useCallback((title: string) => vm.createTask(title), [vm]);
  const updateTask = useCallback((id: string, title: string) => vm.updateTask(id, title), [vm]);
  const deleteTask = useCallback((id: string) => vm.deleteTask(id), [vm]);

  return {
    tasks,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}
