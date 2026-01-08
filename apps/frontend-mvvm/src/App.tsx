import { useEffect, useState } from "react";
import { Navbar, Sidebar, TableView, TaskModal } from "todo-ui";
import type { Task } from "todo-domain";
import { useTaskViewModel } from "./architecture/mvvm/useTaskViewModel";
import { taskViewModel } from "./architecture/mvvm/wiring";

function App() {
  const { tasks, loadTasks, createTask, updateTask, deleteTask } = useTaskViewModel(taskViewModel);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [_errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setErrorMessage(null);
      const res = await loadTasks();
      if (!res.ok) {
        setErrorMessage(res.error.message);
      }
    };
    fetch();
  }, [loadTasks]);

  const handleCreate = () => {
    setErrorMessage(null);
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setErrorMessage(null);
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteTask(id);
    if (!res.ok) {
      setErrorMessage(res.error.message);
    }
  };

  const handleSave = async (data: { title: string }) => {
    setErrorMessage(null);
    let res;
    
    if (editingTask) {
      res = await updateTask(editingTask.id, data.title);
    } else {
      res = await createTask(data.title);
    }

    // Fechar modal somente se operação foi bem-sucedida
    if (res.ok) {
      setIsModalOpen(false);
    } else {
      // Exibir erro e manter modal aberto
      setErrorMessage(res.error.message);
    }
  };

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
                  Atividades • MVVM • {import.meta.env.VITE_BACKEND_MODE === 'realtime' ? 'Realtime' : 'REST'}
                </h1>
                <p className="text-gray-400 mt-2 text-base">
                  Arquitetura: <span className="font-semibold">MVVM</span> • Modo: <span className="font-semibold">{import.meta.env.VITE_BACKEND_MODE === 'realtime' ? 'Realtime (WebSocket)' : 'REST (Pull)'}</span>
                </p>
              </div>

              <button
                onClick={handleCreate}
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
              <TableView
                tasks={tasks}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </div>
          </div>
        </main>

        <TaskModal
          open={isModalOpen}
          task={editingTask}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      </div>

      <TaskModal 
        open={isModalOpen}
        task={editingTask}
        onSave={handleSave}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default App;
