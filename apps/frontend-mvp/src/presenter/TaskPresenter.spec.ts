import { describe, it, expect, vi, beforeEach } from "vitest";
import { TaskPresenter } from "./TaskPresenter";
import { TaskStore } from "todo-store";
import type { Task } from "todo-domain";

const makeTask = (id = "1", title = "task"): Task => ({ id, title });

describe("TaskPresenter", () => {
  let store: TaskStore;
  let gateway: any;
  let presenter: TaskPresenter;

  beforeEach(() => {
    store = new TaskStore();
    gateway = {
      getAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    };
    presenter = new TaskPresenter(store, gateway);
  });

  it("notifies listeners when store changes and maps tasks into view items", () => {
    const listener = vi.fn();
    presenter.subscribe(listener);

    store.set([makeTask("1", "A")]);

    expect(listener).toHaveBeenCalled();
    const snap = presenter.getSnapshot();
    expect(snap.tasks.length).toBe(1);
    expect(snap.tasks[0].name).toBe("A");
  });

  it("loadTasks sets loading and updates tasks on success", async () => {
    gateway.getAll.mockResolvedValue({ tag: "ok", value: [makeTask("1", "Load")] });
    const snapshots: any[] = [];
    presenter.subscribe(() => snapshots.push(presenter.getSnapshot()));

    await presenter.loadTasks();

    expect(snapshots.length).toBeGreaterThanOrEqual(2);
    const first = snapshots[0];
    const last = snapshots[snapshots.length - 1];
    expect(first.loading).toBe(true);
    expect(last.loading).toBe(false);
    expect(last.tasks[0].name).toBe("Load");
  });

  it("createTask handles invalid-title tag", async () => {
    gateway.create.mockResolvedValue({ tag: "invalid-title" });
    const res = await presenter.createTask("x");
    expect(res.ok).toBe(false);
    expect(presenter.getSnapshot().error).toBe("Título inválido");
  });

  it("createTask success triggers load and updates tasks", async () => {
    gateway.create.mockResolvedValue({ tag: "some" });
    gateway.getAll.mockResolvedValue({ tag: "ok", value: [makeTask("2", "New")] });

    await presenter.createTask("New");
    const snap = presenter.getSnapshot();
    expect(snap.tasks.some((t) => t.name === "New")).toBe(true);
  });
});