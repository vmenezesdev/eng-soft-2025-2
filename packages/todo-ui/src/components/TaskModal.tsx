import { useState, useEffect } from "react";
import type { Task } from "todo-domain";

type TaskModalProps = {
  open: boolean;
  task: Task | null;
  onSave: (data: { title: string }) => void;
  onClose: () => void;
  error?: string | null;
};

export function TaskModal({ open, task, onSave, onClose, error }: TaskModalProps) {
  const [title, setTitle] = useState("");

  const isEditing = task !== null;

  useEffect(() => {
    setTitle(task?.title ?? "");
  }, [task, open]);

  if (!open) return null;

  function handleSave() {
    if (!title.trim()) return;

    console.log("[TaskModal] emitindo onSave:", title);
    onSave({ title });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-card-dark border border-[#23303e] rounded-xl shadow-2xl p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            {isEditing ? "Editar Atividade" : "Nova Atividade"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <label className="block text-sm text-gray-400 mb-1">Título</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-background-dark border border-[#23303e] rounded-lg px-3 py-2 text-white"
          />
          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
        </div>

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
