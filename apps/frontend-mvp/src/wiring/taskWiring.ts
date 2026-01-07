import { createGateway, createTaskStore, type Mode } from "todo-wiring";
import { TaskPresenter } from "../presenter/TaskPresenter";

const mode = (import.meta.env.VITE_BACKEND_MODE as Mode) || "rest";
const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";


const gateway = createGateway(mode, {
    baseUrl,
    socketUrl: baseUrl,
});

export const { store: taskStore } = createTaskStore(gateway);
export const taskGateway = gateway;
export const taskPresenter = new TaskPresenter(taskStore, taskGateway);