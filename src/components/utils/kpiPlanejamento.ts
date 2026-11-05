
import type {
  AtividadePlanejamento,
  ExecucaoAtividade,
  ModalTransporte,
} from "../types/planejamento";

export interface ResultadoKPI {
  atividadeId: number;
  atividadeKey: string;
  etapa: string;
  atividade: string;
  modal: ModalTransporte | null;
  slaHoras: number;
  totalExecucoes: number;
  dentroPrazo: number;
  foraPrazo: number;
  tempoMedioHoras: number | null;
  aderenciaPercentual: number | null;
}

export function calcularKPIsMensais(
  atividades: AtividadePlanejamento[],
  execucoes: ExecucaoAtividade[],
  ano: number,
  mes: number
): ResultadoKPI[] {
  if (mes < 1 || mes > 12) {
    throw new Error("O mês deve estar entre 1 e 12.");
  }

  return atividades.map((atividade) => {
    const execucoesDaAtividade = execucoes.filter((execucao) => {
      if (execucao.atividadeKey !== atividade.atividadeKey) return false;
      if (!execucao.dataInicio || !execucao.dataConclusao) return false;

      const conclusao = new Date(execucao.dataConclusao);

      if (Number.isNaN(conclusao.getTime())) return false;

      return (
        conclusao.getUTCFullYear() === ano &&
        conclusao.getUTCMonth() + 1 === mes
      );
    });

    const grupos = new Map<
      ModalTransporte | "geral",
      ExecucaoAtividade[]
    >();

    execucoesDaAtividade.forEach((execucao) => {
      const chave = execucao.modal ?? "geral";

      if (!grupos.has(chave)) {
        grupos.set(chave, []);
      }

      grupos.get(chave)!.push(execucao);
    });

    if (grupos.size === 0) {
      grupos.set("geral", []);
    }

    return Array.from(grupos.entries()).map(
      ([modal, execucoesDoGrupo]) => {
        const slaHoras =
          modal !== "geral" && atividade.targetsPorModal
            ? atividade.targetsPorModal[modal].horas
            : atividade.prazoHoras;

        let totalHoras = 0;
        let dentroPrazo = 0;
        let foraPrazo = 0;
        let totalValidas = 0;

        execucoesDoGrupo.forEach((execucao) => {
          const inicio = new Date(execucao.dataInicio);
          const conclusao = new Date(execucao.dataConclusao);

          if (
            Number.isNaN(inicio.getTime()) ||
            Number.isNaN(conclusao.getTime()) ||
            conclusao.getTime() < inicio.getTime()
          ) {
            return;
          }

          const duracaoHoras =
            (conclusao.getTime() - inicio.getTime()) /
            (1000 * 60 * 60);

          const target =
            execucao.modal && atividade.targetsPorModal
              ? atividade.targetsPorModal[execucao.modal].horas
              : atividade.prazoHoras;

          totalHoras += duracaoHoras;
          totalValidas++;

          if (duracaoHoras <= target) {
            dentroPrazo++;
          } else {
            foraPrazo++;
          }
        });

        return {
          atividadeId: atividade.id,
          atividadeKey: atividade.atividadeKey,
          etapa: atividade.etapa,
          atividade: atividade.atividade,
          modal: modal === "geral" ? null : modal,
          slaHoras,
          totalExecucoes: totalValidas,
          dentroPrazo,
          foraPrazo,
          tempoMedioHoras:
            totalValidas > 0
              ? Number((totalHoras / totalValidas).toFixed(2))
              : null,
          aderenciaPercentual:
            totalValidas > 0
              ? Number(
                  ((dentroPrazo / totalValidas) * 100).toFixed(2)
                )
              : null,
        };
      }
    );
  }).flat();
}
