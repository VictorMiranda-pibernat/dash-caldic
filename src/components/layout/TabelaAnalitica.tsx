import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type {
  AtividadePlanejamento,
  ExecucaoAtividade,
  ModalTransporte,
} from "../types/planejamento";

type StatusLinha = "prazo" | "atraso";

interface LinhaAnalitica {
  id: string;
  atividade: string;
  etapa: string;
  modal: ModalTransporte;
  responsavel: string;
  dataInicio: Date;
  dataConclusao: Date;
  duracaoHoras: number;
  slaHoras: number;
  status: StatusLinha;
}

interface TabelaAnaliticaProps {
  atividades: AtividadePlanejamento[];
  execucoes: ExecucaoAtividade[];
  dataInicio: string;
  dataFim: string;
  modal: string;
}

const nomesModal: Record<ModalTransporte, string> = {
  aereo: "Aéreo",
  maritimo: "Marítimo",
  rodoviario: "Rodoviário",
};

function converterData(data: string): Date {
  // Datas sem horário são interpretadas no fuso local.
  if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    const [ano, mes, dia] = data.split("-").map(Number);
    return new Date(ano, mes - 1, dia);
  }

  return new Date(data);
}

function formatarData(data: Date): string {
  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatarDuracao(horas: number): string {
  if (!Number.isFinite(horas) || horas < 0) return "—";

  const totalMinutos = Math.floor(horas * 60);
  const dias = Math.floor(totalMinutos / (24 * 60));
  const horasRestantes = Math.floor((totalMinutos % (24 * 60)) / 60);
  const minutos = totalMinutos % 60;

  if (dias > 0) return `${dias}d ${horasRestantes}h`;
  if (horasRestantes > 0) return `${horasRestantes}h ${minutos}min`;
  return `${minutos}min`;
}

export default function TabelaAnalitica({
  atividades,
  execucoes,
  dataInicio,
  dataFim,
  modal,
}: TabelaAnaliticaProps) {
  const [pesquisa, setPesquisa] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [modalFiltro, setModalFiltro] = useState("todos");

  const linhas = useMemo<LinhaAnalitica[]>(() => {
    if (!dataInicio || !dataFim || dataInicio > dataFim) return [];

    const inicioPeriodo = converterData(dataInicio);
    const fimPeriodo = converterData(dataFim);
    fimPeriodo.setHours(23, 59, 59, 999);

    const atividadesPorKey = new Map(
      atividades.map((atividade) => [atividade.atividadeKey, atividade])
    );

    return execucoes.flatMap((execucao) => {
      if (!execucao.modal || !execucao.dataInicio || !execucao.dataConclusao) {
        return [];
      }

      const atividade = atividadesPorKey.get(execucao.atividadeKey);
      if (!atividade) return [];

      const inicio = converterData(execucao.dataInicio);
      const conclusao = converterData(execucao.dataConclusao);

      if (
        Number.isNaN(inicio.getTime()) ||
        Number.isNaN(conclusao.getTime()) ||
        conclusao < inicio ||
        conclusao < inicioPeriodo ||
        conclusao > fimPeriodo
      ) {
        return [];
      }

      const duracaoHoras =
        (conclusao.getTime() - inicio.getTime()) / (1000 * 60 * 60);
      const slaHoras =
        atividade.targetsPorModal?.[execucao.modal]?.horas ??
        atividade.prazoHoras;

      return [{
        id: execucao.id,
        atividade: atividade.atividade,
        etapa: atividade.etapa,
        modal: execucao.modal,
        responsavel: atividade.responsavel ?? "Não informado",
        dataInicio: inicio,
        dataConclusao: conclusao,
        duracaoHoras,
        slaHoras,
        status: duracaoHoras <= slaHoras ? "prazo" : "atraso",
      }];
    });
  }, [atividades, execucoes, dataInicio, dataFim]);

  const linhasFiltradas = useMemo(() => {
    const termo = pesquisa.trim().toLocaleLowerCase("pt-BR");

    return linhas
      .filter((linha) => {
        const correspondePesquisa =
          !termo ||
          [
            linha.id,
            linha.atividade,
            linha.etapa,
            linha.responsavel,
          ].some((valor) => valor.toLocaleLowerCase("pt-BR").includes(termo));

        const correspondeStatus =
          statusFiltro === "todos" || linha.status === statusFiltro;

        const correspondeModal =
          modalFiltro === "todos" || linha.modal === modalFiltro;

        const correspondeModalPagina =
          modal === "todos" || linha.modal === modal;

        return (
          correspondePesquisa &&
          correspondeStatus &&
          correspondeModal &&
          correspondeModalPagina
        );
      })
      .sort((a, b) => b.dataConclusao.getTime() - a.dataConclusao.getTime());
  }, [linhas, pesquisa, statusFiltro, modalFiltro, modal]);

  const totalAtrasos = linhasFiltradas.filter(
    (linha) => linha.status === "atraso"
  ).length;
  const totalNoPrazo = linhasFiltradas.filter(
    (linha) => linha.status === "prazo"
  ).length;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-white">
          Relatório analítico de processos
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Consulte cada execução e verifique seu desempenho em relação ao SLA.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[#292B34] bg-[#181920] p-4">
          <p className="text-xs text-gray-400">Execuções no período</p>
          <p className="mt-1 text-2xl font-semibold text-white">
            {linhasFiltradas.length}
          </p>
        </div>
        <div className="rounded-xl border border-green-500/20 bg-[#181920] p-4">
          <p className="text-xs text-gray-400">Dentro do prazo</p>
          <p className="mt-1 text-2xl font-semibold text-green-400">
            {totalNoPrazo}
          </p>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-[#181920] p-4">
          <p className="text-xs text-gray-400">Atrasadas</p>
          <p className="mt-1 text-2xl font-semibold text-red-400">
            {totalAtrasos}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[#292B34] bg-[#181920] p-4">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row">
          <div className="relative min-w-[220px] flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              value={pesquisa}
              onChange={(event) => setPesquisa(event.target.value)}
              placeholder="Pesquisar processo, atividade ou responsável..."
              className="w-full rounded-lg border border-[#292B34] bg-[#20212A] py-2 pl-9 pr-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
            />
          </div>

          <select
            value={statusFiltro}
            onChange={(event) => setStatusFiltro(event.target.value)}
            className="rounded-lg border border-[#292B34] bg-[#20212A] px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
          >
            <option value="todos">Todos os status</option>
            <option value="prazo">Dentro do prazo</option>
            <option value="atraso">Atrasados</option>
          </select>

          <select
            value={modalFiltro}
            onChange={(event) => setModalFiltro(event.target.value)}
            className="rounded-lg border border-[#292B34] bg-[#20212A] px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
          >
            <option value="todos">Todos os modais</option>
            <option value="aereo">Aéreo</option>
            <option value="maritimo">Marítimo</option>
            <option value="rodoviario">Rodoviário</option>
          </select>
        </div>

        <div className="max-h-[450px] overflow-auto rounded-lg border border-[#292B34]">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="sticky top-0 z-10 bg-[#20212A]">
              <tr className="border-b border-[#343642] text-xs uppercase tracking-wide text-gray-400">
                <th className="px-3 py-3">Nº execução</th>
                <th className="px-3 py-3">Etapa</th>
                <th className="px-3 py-3">Atividade</th>
                <th className="px-3 py-3">Modal</th>
                <th className="px-3 py-3">Responsável</th>
                <th className="px-3 py-3">Início</th>
                <th className="px-3 py-3">Conclusão</th>
                <th className="px-3 py-3">Tempo</th>
                <th className="px-3 py-3">SLA</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {linhasFiltradas.map((linha) => (
                <tr
                  key={linha.id}
                  className="border-b border-[#292B34] text-gray-300 transition-colors hover:bg-white/[0.03]"
                >
                  <td className="whitespace-nowrap px-3 py-3 font-medium text-gray-200">
                    {linha.id}
                  </td>
                  <td className="px-3 py-3">{linha.etapa}</td>
                  <td className="min-w-[220px] px-3 py-3">{linha.atividade}</td>
                  <td className="px-3 py-3">{nomesModal[linha.modal]}</td>
                  <td className="px-3 py-3">{linha.responsavel}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatarData(linha.dataInicio)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatarData(linha.dataConclusao)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatarDuracao(linha.duracaoHoras)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatarDuracao(linha.slaHoras)}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                        linha.status === "prazo"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          linha.status === "prazo" ? "bg-green-400" : "bg-red-400"
                        }`}
                      />
                      {linha.status === "prazo" ? "No prazo" : "Atrasado"}
                    </span>
                  </td>
                </tr>
              ))}

              {linhasFiltradas.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    Nenhuma execução encontrada para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-col gap-1 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Exibindo {linhasFiltradas.length} de {linhas.length} execuções.
          </span>
          <span>
            O período considera a data de conclusão da execução.
          </span>
        </div>
      </div>
    </section>
  );
}
