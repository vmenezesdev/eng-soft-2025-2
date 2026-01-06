import type { Task } from "todo-domain";
import { TableItem } from "./TableItem";

type TableViewProps = {
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

export function TableView({ tasks, onDelete, onEdit }: TableViewProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#23303e]/50 border-b border-[#23303e]">
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase w-32">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
              Atividade
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase hidden sm:table-cell w-40">
              Criada em
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase w-32">
              Ações
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#23303e]">
          {tasks.map((task) => (
            <TableItem
              key={task.id}
              task={task}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
