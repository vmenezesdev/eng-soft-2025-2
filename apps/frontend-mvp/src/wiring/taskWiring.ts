import { taskStore } from "todo-store";
import { RestTaskGateway } from "todo-gateway";
import { TaskPresenter } from "../presenter/TaskPresenter";

// Adjust if the gateway export is different; this assumes RestTaskGateway is a class constructor
const gateway = new (RestTaskGateway as any)();

// export only the presenter so views cannot access the store directly
export const taskPresenter = new TaskPresenter(taskStore, gateway);