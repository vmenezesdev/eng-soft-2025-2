import { useState, useEffect } from "react";
import { TaskModal } from "../components/TaskModal";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { TableView } from "../components/TableView";
import { useTasks } from "../../adapters/useTasks";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { tasks, load, remove, update } = useTasks();

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-card-dark text-gray-300">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="max-w-6xl mx-auto flex flex-col gap-8">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  Atividades
                </h1>
                <p className="text-gray-400 mt-2 text-base">
                  Gerencie suas tarefas diárias e acompanhe o status.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 group"
              >
                <span className="material-symbols-outlined group-hover:rotate-90 transition-transform duration-300">
                  add
                </span>
                <span>Nova Atividade</span>
              </button>
            </div>

            {/* TABLE */}
            <div className="bg-card-dark border border-[#23303e] rounded-xl overflow-hidden shadow-lg shadow-black/20">
              <TableView tasks={tasks} onDelete={remove} onEdit={update} />
            </div>
          </div>
        </main>

        <TaskModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
}
