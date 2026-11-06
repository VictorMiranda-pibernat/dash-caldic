
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
    modal: ModalTransporte;
    ano: number;
    mes: number;
    mesLabel: string;
    slaHoras: number;
    totalExecucoes: number;
    dentroPrazo: number;
    foraPrazo: number;
    tempoMedioHoras: number | null;
    aderenciaPercentual: number | null;
}

const modais: ModalTransporte[] = [
    "aereo",
    "maritimo",
    "rodoviario",
];

const nomesMeses = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro",
];

function converterDataLocal(data: string): Date {
    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
        const [ano, mes, dia] = data.split("-").map(Number);
        return new Date(ano, mes - 1, dia);
    }

    return new Date(data);
}

export function calcularKPIsPorPeriodo(
    atividades: AtividadePlanejamento[],
    execucoes: ExecucaoAtividade[],
    dataInicio: string,
    dataFim: string
): ResultadoKPI[] {
    const inicioPeriodo = converterDataLocal(dataInicio);
    const fimPeriodo = converterDataLocal(dataFim);

    if (
        Number.isNaN(inicioPeriodo.getTime()) ||
        Number.isNaN(fimPeriodo.getTime()) ||
        inicioPeriodo > fimPeriodo
    ) {
        throw new Error("Período de datas inválido.");
    }

    const fimExclusivo = new Date(fimPeriodo);
    fimExclusivo.setDate(fimExclusivo.getDate() + 1);

    const mesesPeriodo: { ano: number; mes: number }[] = [];

    const cursor = new Date(
        inicioPeriodo.getFullYear(),
        inicioPeriodo.getMonth(),
        1
    );

    const ultimoMes = new Date(
        fimPeriodo.getFullYear(),
        fimPeriodo.getMonth(),
        1
    );

    while (cursor <= ultimoMes) {
        mesesPeriodo.push({
            ano: cursor.getFullYear(),
            mes: cursor.getMonth() + 1,
        });

        cursor.setMonth(cursor.getMonth() + 1);
    }

    const execucoesValidas = execucoes.filter((execucao) => {
        if (!execucao.dataInicio || !execucao.dataConclusao) {
            return false;
        }

        const inicio = converterDataLocal(execucao.dataInicio);
        const conclusao = converterDataLocal(execucao.dataConclusao);

        return (
            !Number.isNaN(inicio.getTime()) &&
            !Number.isNaN(conclusao.getTime()) &&
            conclusao >= inicio &&
            conclusao >= inicioPeriodo &&
            conclusao < fimExclusivo
        );
    });

    const resultados: ResultadoKPI[] = [];

    atividades.forEach((atividade) => {
        mesesPeriodo.forEach(({ ano, mes }) => {
            modais.forEach((modal) => {
                const execucoesDoGrupo = execucoesValidas.filter(
                    (execucao) => {
                        if (
                            execucao.atividadeKey !== atividade.atividadeKey ||
                            execucao.modal !== modal
                        ) {
                            return false;
                        }

                        const conclusao = converterDataLocal(
                            execucao.dataConclusao
                        );

                        return (
                            conclusao.getFullYear() === ano &&
                            conclusao.getMonth() + 1 === mes
                        );
                    }
                );

                const slaHoras =
                    atividade.targetsPorModal?.[modal].horas ??
                    atividade.prazoHoras;

                let totalHoras = 0;
                let dentroPrazo = 0;
                let foraPrazo = 0;

                execucoesDoGrupo.forEach((execucao) => {
                    const inicio = converterDataLocal(execucao.dataInicio);
                    const conclusao = converterDataLocal(
                        execucao.dataConclusao
                    );

                    const duracaoHoras =
                        (conclusao.getTime() - inicio.getTime()) /
                        (1000 * 60 * 60);

                    totalHoras += duracaoHoras;

                    if (duracaoHoras <= slaHoras) {
                        dentroPrazo++;
                    } else {
                        foraPrazo++;
                    }
                });

                const totalExecucoes = dentroPrazo + foraPrazo;

                resultados.push({
                    atividadeId: atividade.id,
                    atividadeKey: atividade.atividadeKey,
                    etapa: atividade.etapa,
                    atividade: atividade.atividade,
                    modal,
                    ano,
                    mes,
                    mesLabel: nomesMeses[mes - 1],
                    slaHoras,
                    totalExecucoes,
                    dentroPrazo,
                    foraPrazo,
                    tempoMedioHoras:
                        totalExecucoes > 0
                            ? Number(
                                (totalHoras / totalExecucoes).toFixed(2)
                            )
                            : null,
                    aderenciaPercentual:
                        totalExecucoes > 0
                            ? Number(
                                (
                                    (dentroPrazo / totalExecucoes) *
                                    100
                                ).toFixed(2)
                            )
                            : null,
                });
            });
        });
    });

    return resultados;
}
