import { useState, useEffect } from "react";
import { taskController } from "../../wiring/taskWiring";
import type { Task } from "../../../../../packages/todo-domain/src/Task";

type TaskModalProps = {
  open: boolean;
  task: Task | null;
  onClose: () => void;
};

export function TaskModal({ open, task, onClose }: TaskModalProps) {
  const [title, setTitle] = useState("");

  const isEditing = task !== null;

  useEffect(() => {
    if (task) {
      setTitle(task.title);
    } else {
      setTitle("");
    }
  }, [task, open]);

  if (!open) return null;

  async function handleSave() {
    if (!title.trim()) return;

    if (isEditing && task) {
      console.log("[TaskModal] Editando tarefa:", task.id);

      await taskController.updateTask(task.id, title);

      console.log("[TaskModal] updateTask retornou OK");
    } else {
      console.log("[TaskModal] Criando tarefa:", title);

      await taskController.createTask(title);

      console.log("[TaskModal] createTask retornou OK");
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-lg bg-card-dark border border-[#23303e] rounded-xl shadow-2xl p-6 z-10">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            {isEditing ? "Editar Atividade" : "Nova Atividade"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-background-dark border border-[#23303e] rounded-lg px-3 py-2 text-white"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600"
          >
            {isEditing ? "Salvar Alterações" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
