import { createGateway, createTaskStore, type Mode } from "todo-wiring";
import { TaskViewModel } from "./TaskViewModel";

const mode = (import.meta.env.VITE_BACKEND_MODE as Mode) || "rest";
const baseUrl = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

const gateway = createGateway(mode, {
  baseUrl,
  socketUrl: baseUrl,
});

const { store } = createTaskStore(gateway);

export const taskViewModel = new TaskViewModel(store, gateway);
