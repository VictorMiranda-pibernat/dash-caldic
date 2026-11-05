
import type {
  AtividadePlanejamento,
  ModalTransporte,
} from "../types/planejamento";

export type SituacaoSLA =
  | "sem_dados"
  | "em_andamento"
  | "dentro_do_prazo"
  | "prazo_excedido"
  | "concluido_no_prazo"
  | "concluido_com_atraso";

interface ResultadoSLA {
  situacao: SituacaoSLA;
  tempoDecorridoHoras: number | null;
  targetHoras: number;
  percentualConsumido: number | null;
}

export function calcularSLA(
  atividade: AtividadePlanejamento,
  modal?: ModalTransporte,
  referencia: Date = new Date()
): ResultadoSLA {
  const targetHoras =
    modal && atividade.targetsPorModal
      ? atividade.targetsPorModal[modal].horas
      : atividade.prazoHoras;

  if (!atividade.dataInicio) {
    return {
      situacao: "sem_dados",
      tempoDecorridoHoras: null,
      targetHoras,
      percentualConsumido: null,
    };
  }

  const inicio = new Date(atividade.dataInicio);
  const fim = atividade.dataConclusao
    ? new Date(atividade.dataConclusao)
    : referencia;

  if (
    Number.isNaN(inicio.getTime()) ||
    Number.isNaN(fim.getTime()) ||
    fim.getTime() < inicio.getTime()
  ) {
    return {
      situacao: "sem_dados",
      tempoDecorridoHoras: null,
      targetHoras,
      percentualConsumido: null,
    };
  }

  const tempoDecorridoHoras =
    (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60);

  const percentualConsumido =
    targetHoras > 0
      ? (tempoDecorridoHoras / targetHoras) * 100
      : null;

  const concluida = Boolean(atividade.dataConclusao);

  let situacao: SituacaoSLA;

  if (concluida) {
    situacao =
      tempoDecorridoHoras <= targetHoras
        ? "concluido_no_prazo"
        : "concluido_com_atraso";
  } else {
    situacao =
      tempoDecorridoHoras <= targetHoras
        ? "em_andamento"
        : "prazo_excedido";
  }

  return {
    situacao,
    tempoDecorridoHoras: Math.round(tempoDecorridoHoras * 100) / 100,
    targetHoras,
    percentualConsumido:
      percentualConsumido === null
        ? null
        : Math.round(percentualConsumido * 100) / 100,
  };
}
