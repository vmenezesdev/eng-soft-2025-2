export function TableView() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#23303e]/50 border-b border-[#23303e]">
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-32">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Atividade
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">
              Descrição
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell w-40">
              Vencimento
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider w-32">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#23303e]">
          <tr className="group hover:bg-[#23303e]/30 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 ring-1 ring-inset ring-blue-500/20">
                Pendente
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-white">
                Relatório Mensal
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
              <div className="text-sm text-gray-400 truncate max-w-[250px]">
                Finalizar o relatório de vendas de outubro com todos os gráficos
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
              <div className="flex items-center gap-1.5 text-sm text-gray-400">
                <span className="material-symbols-outlined text-[16px]">
                  calendar_today
                </span>
                24 Out, 2023
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                <button
                  className="p-1.5 text-gray-400 hover:text-primary hover:bg-[#23303e] rounded-md transition-colors"
                  title="Ver Detalhes"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    visibility
                  </span>
                </button>
                <button
                  className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-[#23303e] rounded-md transition-colors"
                  title="Editar"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    edit
                  </span>
                </button>
                <button
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-[#23303e] rounded-md transition-colors"
                  title="Remover"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    delete
                  </span>
                </button>
              </div>
            </td>
          </tr>
          <tr className="group hover:bg-[#23303e]/30 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-300 ring-1 ring-inset ring-green-500/20">
                Concluída
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-500 line-through">
                Reunião de Equipe
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
              <div className="text-sm text-gray-600 line-through truncate max-w-[250px]">
                Preparar pauta para a reunião semanal
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <span className="material-symbols-outlined text-[16px]">
                  event_available
                </span>
                25 Out, 2023
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                <button
                  className="p-1.5 text-gray-400 hover:text-primary hover:bg-[#23303e] rounded-md transition-colors"
                  title="Ver Detalhes"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    visibility
                  </span>
                </button>
                <button
                  className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-[#23303e] rounded-md transition-colors"
                  title="Editar"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    edit
                  </span>
                </button>
                <button
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-[#23303e] rounded-md transition-colors"
                  title="Remover"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    delete
                  </span>
                </button>
              </div>
            </td>
          </tr>
          <tr className="group hover:bg-[#23303e]/30 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 ring-1 ring-inset ring-blue-500/20">
                Pendente
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-white">
                Atualizar Site
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
              <div className="text-sm text-gray-400 truncate max-w-[250px]">
                Revisar textos da página inicial
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
              <div className="flex items-center gap-1.5 text-sm text-gray-400">
                <span className="material-symbols-outlined text-[16px]">
                  calendar_today
                </span>
                26 Out, 2023
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                <button
                  className="p-1.5 text-gray-400 hover:text-primary hover:bg-[#23303e] rounded-md transition-colors"
                  title="Ver Detalhes"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    visibility
                  </span>
                </button>
                <button
                  className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-[#23303e] rounded-md transition-colors"
                  title="Editar"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    edit
                  </span>
                </button>
                <button
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-[#23303e] rounded-md transition-colors"
                  title="Remover"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    delete
                  </span>
                </button>
              </div>
            </td>
          </tr>
          <tr className="group hover:bg-[#23303e]/30 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-900/30 text-orange-300 ring-1 ring-inset ring-orange-500/20">
                Atrasada
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-white">
                Enviar Faturas
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
              <div className="text-sm text-gray-400 truncate max-w-[250px]">
                Processar pagamentos pendentes
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
              <div className="flex items-center gap-1.5 text-red-400 text-sm font-medium">
                <span className="material-symbols-outlined text-[16px]">
                  warning
                </span>
                23 Out, 2023
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                <button
                  className="p-1.5 text-gray-400 hover:text-primary hover:bg-[#23303e] rounded-md transition-colors"
                  title="Ver Detalhes"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    visibility
                  </span>
                </button>
                <button
                  className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-[#23303e] rounded-md transition-colors"
                  title="Editar"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    edit
                  </span>
                </button>
                <button
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-[#23303e] rounded-md transition-colors"
                  title="Remover"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    delete
                  </span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
