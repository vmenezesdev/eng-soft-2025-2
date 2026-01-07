import { useEffect, useState } from "react";
import { Navbar, Sidebar, TableView, TaskModal } from "todo-ui";
import type { Task } from "todo-domain";
import { useTaskViewModel } from "./architecture/mvvm/useTaskViewModel";
import { taskViewModel } from "./architecture/mvvm/wiring";

function App() {
  const { tasks, loadTasks, createTask, updateTask, deleteTask } = useTaskViewModel(taskViewModel);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    <div className="flex h-screen bg-background-dark text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Arquitetura MVVM</h1>
                <p className="text-text-secondary text-sm">Gerenciamento de tarefas em tempo real</p>
              </div>
              <button 
                onClick={handleCreate}
                className="bg-primary hover:opacity-90 px-4 py-2 rounded-lg font-medium transition-opacity"
              >
                + Nova Atividade
              </button>
            </div>
            
            <TableView 
              tasks={tasks} 
              onDelete={handleDelete} 
              onEdit={handleEdit} 
            />
          </div>
        </main>
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
