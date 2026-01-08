import { createGateway, createTaskStore, type Mode } from "todo-wiring";
import { TaskController } from "../controllers/TaskController";

const mode = (import.meta.env.VITE_BACKEND_MODE as Mode) || "rest";
const baseUrl = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

const gateway = createGateway(mode, {
    baseUrl,
    socketUrl: baseUrl,
});

export const { store: taskStore } = createTaskStore(gateway);
export const taskGateway = gateway;
export const taskController = new TaskController(taskStore, taskGateway);
