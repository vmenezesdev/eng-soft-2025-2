import { useState } from "react";
import { taskController } from "../../wiring/taskWiring";

type TaskModalProps = {
  open: boolean;
  onClose: () => void;
};

export function TaskModal({ open, onClose }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!open) return null;

  async function handleSave() {
    if (!title.trim()) return;

    console.log("[TaskModal] Criando tarefa:", title);

    await taskController.createTask(title);

    console.log("[TaskModal] createTask retornou OK");

    setTitle("");
    setDescription("");
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
          <h2 className="text-lg font-semibold text-white">Nova Atividade</h2>
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

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-background-dark border border-[#23303e] rounded-lg px-3 py-2 text-white resize-none"
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
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
