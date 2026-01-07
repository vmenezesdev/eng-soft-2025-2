import { useEffect, useState } from "react";
import { Navbar, Sidebar, TableView, TaskModal } from "todo-ui";
import type { Task } from "todo-domain";
import { useTaskViewModel } from "./architecture/mvvm/useTaskViewModel";
import { taskViewModel } from "./architecture/mvvm/wiring";

function App() {
  const { tasks, loadTasks, createTask, updateTask, deleteTask } = useTaskViewModel(taskViewModel);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSave = async (data: { title: string }) => {
    if (editingTask) {
      await updateTask(editingTask.id, data.title);
    } else {
      await createTask(data.title);
    }
    setIsModalOpen(false);
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
              onDelete={deleteTask} 
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
