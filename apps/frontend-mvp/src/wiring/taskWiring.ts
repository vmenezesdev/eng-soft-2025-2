import { TaskStore } from "todo-store";
import { RestTaskGateway } from "todo-gateway";
import { TaskPresenter } from "../presenter/TaskPresenter";

// create concrete instances for the app wiring
const taskStore = new TaskStore();
const gateway = new RestTaskGateway("http://localhost:3000");

// export only the presenter so views cannot access the store directly
export const taskPresenter = new TaskPresenter(taskStore, gateway);