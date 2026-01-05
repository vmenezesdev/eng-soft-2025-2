import type { Maybe, Result, Task } from "todo-domain";

interface TaskGateway {
    create(title: string, ): Promise<Maybe<Task>>;
    update(id: string, title: string): Promise<Result<Task, "not_found" | "invalid_title">>;
    delete(id: string): Promise<Result<"success", "not_found" | "error">>;
    getAll(): Promise<Result<Array<Task>, "error">>;
}

export type { TaskGateway }