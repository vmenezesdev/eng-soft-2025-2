import { Err, None, Ok, Some, type Maybe, type Result, type Task } from "@repo/packages/todo-domain";
import type { TaskGateway } from "./TaskGateway.ts";
import { validateTitle } from "../../todo-domain/src/taskRules.js";

const BASE_URL = "http://localhost:3000"

export default class RestTaskGateway implements TaskGateway {
    async getAll(): Promise<Result<Array<Task>, "error">> {
        const response = await fetch(`${BASE_URL}/tasks`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            return Err("error");
        }

        const tasks: Array<Task> = await response.json();

        return Ok(tasks);
    }
    async create(title: string): Promise<Maybe<Task>> {

        const isTitleValid = validateTitle(title);
        if (!isTitleValid) {
            return None;
        }

        const response = await fetch(`${BASE_URL}/tasks`, {
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
        const response = await fetch(`${BASE_URL}/tasks/${id}`, {
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
        const response = await fetch(`${BASE_URL}/tasks/${id}`, {
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