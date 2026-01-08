import type { Task } from "todo-domain";
import { Icon } from "./Icon";

type TableItemProps = {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
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
          <Icon name="calendar_today" size="sm" />
          {createdDate.toLocaleDateString("pt-BR")}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
        <button
          onClick={() => onEdit(task)}
          className="inline-flex p-1.5 text-gray-400 hover:text-blue-400 hover:bg-[#23303e] rounded-md transition-colors"
          title="Editar tarefa"
        >
          <Icon name="edit" size="base" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="inline-flex p-1.5 text-gray-400 hover:text-red-400 hover:bg-[#23303e] rounded-md transition-colors"
          title="Deletar tarefa"
        >
          <Icon name="delete" size="base" />
        </button>
      </td>
    </tr>
  );
}
