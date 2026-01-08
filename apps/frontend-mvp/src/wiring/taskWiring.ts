import { createGateway, createTaskStore, type Mode } from "todo-wiring";
import { TaskPresenter } from "../presenter/TaskPresenter";

const mode = (import.meta.env.VITE_BACKEND_MODE as Mode) || "rest";
const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const gateway = createGateway(mode, {
  baseUrl,
  socketUrl: baseUrl,
});

const { store } = createTaskStore(gateway);

// export only the presenter so views cannot access the store directly
export const taskPresenter = new TaskPresenter(store, gateway);