export function ProgressCard() {
  return (
    <div className="bg-card-dark border border-[#23303e] rounded-xl p-6 shadow-lg shadow-black/20">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-semibold text-lg">Progresso Diário</h3>
        <span className="text-primary font-bold text-lg">75%</span>
      </div>
      <div className="w-full bg-[#23303e] rounded-full h-4 mb-4 overflow-hidden relative">
        <div className="bg-primary h-4 rounded-full transition-all duration-500 ease-out relative">
          <div className="absolute inset-0 bg-white/10 w-full h-full animate-pulse"></div>
        </div>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-green-400">
            check_circle
          </span>
          <span>
            <strong className="text-white">18</strong> concluídas
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-blue-400">
            pending_actions
          </span>
          <span>
            <strong className="text-white">6</strong> pendentes
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1">
          <span>
            Total:
            <strong className="text-white">24</strong> atividades
          </span>
        </div>
      </div>
    </div>
  );
}
