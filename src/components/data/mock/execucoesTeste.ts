import type {
  ExecucaoAtividade,
  AtividadePlanejamento,
  ModalTransporte,
  Unidade,
} from "../../types/planejamento";

import { planejamentoGuarulhos } from "./planejamentoGuarulhos";
import { planejamentoSantaCatarina } from "./planejamentoSantaCatarina";

/**
 * MASSA DE DADOS FICTÍCIA
 * Utilizada exclusivamente para validar os KPIs,
 * filtros, tabelas e gráficos do dashboard.
 *
 * Não representa resultados operacionais reais.
 */

const modais: ModalTransporte[] = [
  "aereo",
  "maritimo",
  "rodoviario",
];

// Período de teste: junho a novembro de 2026
const meses = [6, 7, 8, 9, 10, 11];

// 10 execuções por atividade/modal/mês:
// 6 dentro do SLA e 4 fora do SLA.
const fatoresDuracao = [
  0.30,
  0.45,
  0.60,
  0.70,
  0.80,
  0.95,
  1.10,
  1.25,
  1.50,
  1.80,
];

function formatarData(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  const hora = String(data.getHours()).padStart(2, "0");
  const minuto = String(data.getMinutes()).padStart(2, "0");
  const segundo = String(data.getSeconds()).padStart(2, "0");

  return `${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}`;
}

function gerarExecucoesUnidade(
  unidade: Unidade,
  atividades: AtividadePlanejamento[]
): ExecucaoAtividade[] {
  const execucoes: ExecucaoAtividade[] = [];

  atividades.forEach((atividade) => {
    meses.forEach((mes) => {
      modais.forEach((modal) => {
        const slaHoras =
          atividade.targetsPorModal?.[modal].horas ??
          atividade.prazoHoras;

        fatoresDuracao.forEach((fator, indiceExecucao) => {
          // Distribui as execuções entre os dias 2 e 11 de cada mês.
          const dia = 2 + indiceExecucao;

          const dataInicio = new Date(
            2026,
            mes - 1,
            dia,
            8,
            0,
            0
          );

          // Seis execuções dentro do SLA e quatro fora.
          // Para SLA zero, as seis primeiras são instantâneas.
          const duracaoHoras =
            slaHoras === 0
              ? indiceExecucao < 6
                ? 0
                : 1
              : Math.max(0.25, slaHoras * fator);

          const dataConclusao = new Date(
            dataInicio.getTime() +
              duracaoHoras * 60 * 60 * 1000
          );

          execucoes.push({
            id: `${unidade}-${atividade.atividadeKey}-${mes}-${modal}-${indiceExecucao}`,
            atividadeId: atividade.id,
            atividadeKey: atividade.atividadeKey,
            unidade,
            modal,
            dataInicio: formatarData(dataInicio),
            dataConclusao: formatarData(dataConclusao),
          });
        });
      });
    });
  });

  return execucoes;
}

// Geração das execuções fictícias das duas unidades.
export const execucoesTeste: ExecucaoAtividade[] = [
  ...gerarExecucoesUnidade(
    "guarulhos",
    planejamentoGuarulhos
  ),

  ...gerarExecucoesUnidade(
    "santa-catarina",
    planejamentoSantaCatarina
  ),
];