type TableItemProps = {
  task: {
    title: string;
    description: string;
    status: "pending" | "done" | "late";
    dueDate: string;
  };
};

export function TableItem({ task }: TableItemProps) {
  return (
    <tr className="group hover:bg-[#23303e]/30 transition-colors">
      {/* STATUS */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            task.status === "pending" &&
            "bg-blue-900/30 text-blue-300 ring-1 ring-blue-500/20"
          } ${
            task.status === "done" &&
            "bg-green-900/30 text-green-300 ring-1 ring-green-500/20"
          } ${
            task.status === "late" &&
            "bg-orange-900/30 text-orange-300 ring-1 ring-orange-500/20"
          }`}
        >
          {task.status === "pending" && "Pendente"}
          {task.status === "done" && "Concluída"}
          {task.status === "late" && "Atrasada"}
        </span>
      </td>

      {/* TÍTULO */}
      <td className="px-6 py-4">
        <div
          className={`text-sm font-medium ${
            task.status === "done" ? "text-gray-500 line-through" : "text-white"
          }`}
        >
          {task.title}
        </div>
      </td>

      {/* DESCRIÇÃO */}
      <td className="px-6 py-4 hidden md:table-cell">
        <div className="text-sm text-gray-400 truncate max-w-[250px]">
          {task.description}
        </div>
      </td>

      {/* DATA */}
      <td className="px-6 py-4 hidden sm:table-cell">
        <div className="flex items-center gap-1.5 text-sm text-gray-400">
          <span className="material-symbols-outlined text-[16px]">
            calendar_today
          </span>
          {task.dueDate}
        </div>
      </td>

      {/* AÇÕES */}
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100">
          <button className="p-1.5 hover:text-primary">👁</button>
          <button className="p-1.5 hover:text-blue-400">✎</button>
          <button className="p-1.5 hover:text-red-400">🗑</button>
        </div>
      </td>
    </tr>
  );
}
