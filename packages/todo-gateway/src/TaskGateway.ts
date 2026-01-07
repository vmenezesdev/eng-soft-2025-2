import type { Maybe, Result, Task } from "todo-domain";

export type TaskEvent = 
    | { kind: 'created', task: Task }
    | { kind: 'updated', task: Task }
    | { kind: 'deleted', id: string };

interface TaskGateway {
    create(title: string, ): Promise<Maybe<Task>>;
    update(id: string, title: string): Promise<Result<Task, "not_found" | "invalid_title">>;
    delete(id: string): Promise<Result<"success", "not_found" | "error">>;
    getAll(): Promise<Result<Array<Task>, "error">>;
    subscribe(listener: (event: TaskEvent) => void): () => void;
}

export type { TaskGateway }