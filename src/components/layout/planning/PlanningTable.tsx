
import type { AtividadePlanejamento } from "../../types/planejamento";

interface PlanningTableProps {
  atividades: AtividadePlanejamento[];
}

const statusConfig = {
  pendente: {
    label: "Pendente",
    className: "bg-gray-500/15 text-gray-400",
  },
  em_andamento: {
    label: "Em andamento",
    className: "bg-blue-500/15 text-blue-400",
  },
  concluido: {
    label: "Concluído",
    className: "bg-green-500/15 text-green-400",
  },
  atrasado: {
    label: "Atrasado",
    className: "bg-red-500/15 text-red-400",
  },
  nao_informado: {
    label: "Não informado",
    className: "bg-yellow-500/15 text-yellow-400",
  },
};

export default function PlanningTable({
  atividades,
}: PlanningTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#292B34] bg-[#181920]">
      <div className="flex items-center justify-between border-b border-[#292B34] px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-white">
            Atividades do planejamento
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Acompanhamento das etapas e respectivos SLAs
          </p>
        </div>

        <span className="rounded-lg bg-[#252630] px-3 py-1.5 text-xs text-gray-300">
          {atividades.length} atividades
        </span>
      </div>

      <div className="max-h-[600px] overflow-auto">
        <table className="w-full min-w-[1050px] border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-[#20212A]">
            <tr className="text-xs uppercase tracking-wider text-gray-400">
              <th className="px-5 py-4 font-medium">Etapa</th>
              <th className="px-5 py-4 font-medium">Atividade</th>
              <th className="px-5 py-4 font-medium">SLA</th>
              <th className="px-5 py-4 font-medium">Responsável</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Início do farol</th>
              <th className="px-5 py-4 font-medium">Fim do farol</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#292B34]">
            {atividades.map((atividade) => {
              const status = statusConfig[atividade.status];

              return (
                <tr
                  key={atividade.atividadeKey}
                  className="transition-colors hover:bg-[#20212A]"
                >
                  <td className="px-5 py-4 text-sm text-gray-300">
                    {atividade.etapa}
                  </td>

                  <td className="max-w-[320px] px-5 py-4 text-sm font-medium text-white">
                    {atividade.atividade}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-300">
                    {atividade.sla}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-400">
                    {atividade.responsavel ?? "Não definido"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-400">
                    {atividade.inicioFarol || "—"}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-400">
                    {atividade.finalFarol || "—"}
                  </td>
                </tr>
              );
            })}

            {atividades.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-12 text-center text-sm text-gray-500"
                >
                  Nenhuma atividade encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
