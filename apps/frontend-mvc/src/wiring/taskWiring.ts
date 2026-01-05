import { TaskStore } from "todo-store";
import { RealtimeTaskGateway } from "todo-gateway";
import { TaskController } from "../controllers/TaskController";

export const taskStore = new TaskStore();
export const taskGateway = new RealtimeTaskGateway("http://localhost:3000");
export const taskController = new TaskController(taskStore, taskGateway);
