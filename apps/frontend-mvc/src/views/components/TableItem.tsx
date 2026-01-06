import type { Task } from "todo-domain";

type TableItemProps = {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

export function TableItem({ task, onDelete, onEdit }: TableItemProps) {
  const createdDate = new Date(task.createdAt);

  return (
    <tr className="group hover:bg-[#23303e]/30 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium
          bg-blue-900/30 text-blue-300 ring-1 ring-blue-500/20"
        >
          Criada
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-white">{task.title}</div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
        <div className="flex items-center gap-1.5 text-sm text-gray-400">
          <span className="material-symbols-outlined text-[16px]">
            calendar_today
          </span>
          {createdDate.toLocaleDateString("pt-BR")}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right">
        <button onClick={() => onEdit(task.id)}>
          <span className="material-symbols-outlined">edit</span>
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-[#23303e] rounded-md"
        >
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      </td>
    </tr>
  );
}
