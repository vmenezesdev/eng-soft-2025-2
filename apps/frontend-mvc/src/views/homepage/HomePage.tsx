import { useState, useEffect } from "react";
import { TaskModal } from "../components/TaskModal";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { TableView } from "../components/TableView";
import { useTasks } from "../../adapters/useTasks";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { tasks, load } = useTasks();

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-card-dark text-gray-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="flex justify-between">
            <h1>Atividades</h1>
            <button onClick={() => setIsModalOpen(true)}>Nova Atividade</button>
          </div>
          <TableView />
        </main>

        <TaskModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
}
