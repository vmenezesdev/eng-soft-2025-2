import { Err, None, Ok, Some, type Maybe, type Result } from "@repo/packages/todo-domain";
import type { Task } from "../../todo-domain/src/Task.js";
import type { TaskGateway } from "./TaskGateway.ts";
import { io, type Socket } from "socket.io-client";
import { validateTitle } from "../../todo-domain/src/taskRules.js";

// ## Summary

// | Event | Direction | Purpose | Broadcast? |
// |-------|-----------|---------|------------|
// | `task:create` | Client → Server | Create task | - |
// | `task:created` | Server → Client | Notify task created | Yes (all clients) |
// | `task:update` | Client → Server | Update task | - |
// | `task:updated` | Server → Client | Notify task updated | Yes (all clients) |
// | `task:delete` | Client → Server | Delete task | - |
// | `task:deleted` | Server → Client | Notify task deleted | Yes (all clients) |
// | `task:list` | Client → Server | Request task list | - |
// | `task:list` | Server → Client | Respond with task list | No (requester only) |
// | `task:error` | Server → Client | Operation failed | No (requester only) |

const BASE_URL = "http://localhost:3000"

export default class RealtimeTaskGateway implements TaskGateway {
    private socket: Socket = io(BASE_URL);

    update(id: string, title: string): Promise<Result<Task, "not_found" | "invalid_title">> {
        return new Promise((resolve) => {

            const isTitleValid = validateTitle(title);

            if (!isTitleValid) {
                resolve(Err("invalid_title"));
            }

            const timeout = setTimeout(() => {
                resolve(Err("not_found"));
            }, 5000);

            this.socket.emit('task:update', { id, title });
            this.socket.once('task:updated', ({ task }) => {
                clearTimeout(timeout);
                resolve(Ok(task));
            });

            this.socket.once('task:error', () => {
                clearTimeout(timeout);
                resolve(Err("not_found"));
            });

        });
    }

    delete(id: string): Promise<Result<"success", "not_found" | "error">> {
        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                resolve(Err("error"));
            }, 5000);

            this.socket.emit('task:delete', { id });

            this.socket.once('task:deleted', () => {
                clearTimeout(timeout);
                resolve(Ok("success"));
            });

            this.socket.once('task:error', () => {
                clearTimeout(timeout);
                resolve(Err("error"));
            })
        });
    }

    getAll(): Promise<Result<Array<Task>, "error">> {
        return new Promise((resolve => {
            const timeout = setTimeout(() => {
                resolve(Err("error"));
            }, 5000);

            this.socket.emit('task:list');

            this.socket.once('task:list', ({ tasks }) => {
                clearTimeout(timeout);
                resolve(Ok(tasks));
            });

            this.socket.once('task:error', () => {
                clearTimeout(timeout);
                resolve(Err("error"));
            });
        }));
    }

    create(title: string): Promise<Maybe<Task>> {
        return new Promise((resolve) => {

            const isTitleValid = validateTitle(title);

            if (!isTitleValid) {
                resolve(None);
            }

            const timeout = setTimeout(() => {
                resolve(None);
            }, 5000);

            this.socket.emit('task:create', { title });

            this.socket.once('task:created', ({ task }) => {
                clearTimeout(timeout);
                resolve(Some(task));
            });

            this.socket.once('task:error', () => {
                clearTimeout(timeout);
                resolve(None);
            });
        });
    }

}