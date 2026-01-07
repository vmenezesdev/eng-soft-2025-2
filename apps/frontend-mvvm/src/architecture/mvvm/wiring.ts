import { createGateway, type Mode } from "todo-wiring";
import { TaskStore } from "todo-store";
import { TaskViewModel } from "./TaskViewModel";

const mode = (import.meta.env.VITE_BACKEND_MODE as Mode) || "rest";
const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const gateway = createGateway(mode, {
  baseUrl,
  socketUrl: baseUrl,
});

const store = new TaskStore();

export const taskViewModel = new TaskViewModel(store, gateway);
