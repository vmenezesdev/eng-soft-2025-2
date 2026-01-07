import { Err, None, Ok, Some, type Maybe, type Result, type Task, validateTitle } from "todo-domain";
import type { TaskGateway } from "./TaskGateway.ts";

export default class RestTaskGateway implements TaskGateway {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getAll(): Promise<Result<Array<Task>, "error">> {
        const response = await fetch(`${this.baseUrl}/tasks`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            return Err("error");
        }

        const data: { tasks: Array<Task> } = await response.json();
        const tasks: Array<Task> = data.tasks;

        return Ok(tasks);
    }
    async create(title: string): Promise<Maybe<Task>> {

        const isTitleValid = validateTitle(title);
        if (!isTitleValid) {
            return None;
        }

        const response = await fetch(`${this.baseUrl}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title })
        });

        if (!response.ok) {
            return None;
        }

        const task: Task = await response.json();

        return Some(task);
    }

    async update(id: string, title: string): Promise<Result<Task, "not_found" | "invalid_title">> {
        const isTitleValid = validateTitle(title);
        if (!isTitleValid) {
            return Promise.resolve(Err("invalid_title"));
        }    
        const response = await fetch(`${this.baseUrl}/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title })
        })

        if (response.status === 404) {
            return Err("not_found");
        }

        if (!response.ok) {
            return Err("not_found");
        }

        const task: Task = await response.json();

        return Ok(task);
    }


    async delete(id: string): Promise<Result<"success", "not_found" | "error">> {
        const response = await fetch(`${this.baseUrl}/tasks/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status === 404) {
            return Promise.resolve(Err("not_found"));
        }

        if (!response.ok) {
            return Promise.resolve(Err("error"));
        }

        return Promise.resolve(Ok("success"));
    }

}