type TaskModalProps = {
  open: boolean;
  onClose: () => void;
};

export function TaskModal({ open, onClose }: TaskModalProps) {
  if (!open) return null;

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
        <form className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Título</label>
            <input
              className="w-full bg-background-dark border border-[#23303e] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ex: Comprar mantimentos"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Descrição
            </label>
            <textarea
              className="w-full bg-background-dark border border-[#23303e] rounded-lg px-3 py-2 text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="Detalhes adicionais sobre a tarefa..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Data de Vencimento
              </label>
              <input
                type="date"
                className="w-full bg-background-dark border border-[#23303e] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Prioridade
              </label>
              <select className="w-full bg-background-dark border border-[#23303e] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Baixa</option>
                <option>Média</option>
                <option>Alta</option>
              </select>
            </div>
          </div>
        </form>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white"
          >
            Cancelar
          </button>
          <button className="px-5 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600">
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
