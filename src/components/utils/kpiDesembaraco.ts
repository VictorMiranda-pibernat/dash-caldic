
import type {
    AtividadePlanejamento,
    ExecucaoAtividade,
    Unidade,
} from "../types/planejamento";

export interface ResultadoKPIDesembaraco {
    atividadeId: number;
    atividadeKey: string;
    etapa: string;
    atividade: string;
    modal: ExecucaoAtividade["modal"];
    ano: number;
    mes: number;
    mesLabel: string;
    slaHoras: number;
    totalExecucoes: number;
    dentroPrazo: number;
    foraPrazo: number;
    tempoMedioHoras: number | null;
    aderenciaPercentual: number;
}

const MESES = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro",
];

function converterData(data: string): Date {
    const partes = data.split("T")[0].split("-");

    if (partes.length === 3) {
        const [ano, mes, dia] = partes.map(Number);

        return new Date(
            ano,
            mes - 1,
            dia,
            0,
            0,
            0
        );
    }

    return new Date(data);
}

function pertenceAoPeriodo(
    data: string,
    dataInicio: string,
    dataFim: string
): boolean {
    const dataExecucao = converterData(data);
    const inicio = converterData(dataInicio);
    const fim = converterData(dataFim);

    fim.setHours(23, 59, 59, 999);

    return (
        dataExecucao >= inicio &&
        dataExecucao <= fim
    );
}

function obterSla(
    atividade: AtividadePlanejamento,
    modal: ExecucaoAtividade["modal"]
): number {
    return (
        atividade.targetsPorModal?.[modal]?.horas ??
        atividade.prazoHoras
    );
}

export function calcularKPIsDesembaraco(
    atividades: AtividadePlanejamento[],
    execucoes: ExecucaoAtividade[],
    unidade: Unidade,
    dataInicio: string,
    dataFim: string
): ResultadoKPIDesembaraco[] {
    const atividadesValidas = atividades.filter(
        (atividade) => {
            const etapa = atividade.etapa.trim();

            return (
                etapa.startsWith("6.") ||
                etapa.startsWith("7.")
            );
        }
    );

    const atividadesMap = new Map(
        atividadesValidas.map((atividade) => [
            atividade.atividadeKey,
            atividade,
        ])
    );

    const grupos = new Map<
        string,
        {
            atividade: AtividadePlanejamento;
            modal: ExecucaoAtividade["modal"];
            ano: number;
            mes: number;
            slaHoras: number;
            totalExecucoes: number;
            dentroPrazo: number;
            foraPrazo: number;
            somaHoras: number;
        }
    >();

    execucoes.forEach((execucao) => {
        if (execucao.unidade !== unidade) return;

        const atividade = atividadesMap.get(
            execucao.atividadeKey
        );

        if (!atividade) return;

        if (
            !pertenceAoPeriodo(
                execucao.dataConclusao,
                dataInicio,
                dataFim
            )
        ) {
            return;
        }

        const inicio = new Date(execucao.dataInicio);
        const conclusao = new Date(execucao.dataConclusao);

        if (
            Number.isNaN(inicio.getTime()) ||
            Number.isNaN(conclusao.getTime()) ||
            conclusao < inicio
        ) {
            return;
        }

        const duracaoHoras =
            (conclusao.getTime() - inicio.getTime()) /
            (1000 * 60 * 60);

        const slaHoras = obterSla(
            atividade,
            execucao.modal
        );

        const dentroPrazo = duracaoHoras <= slaHoras;

        const dataReferencia = converterData(
            execucao.dataConclusao
        );

        const ano = dataReferencia.getFullYear();
        const mes = dataReferencia.getMonth() + 1;

        const chave = [
            atividade.atividadeKey,
            execucao.modal,
            ano,
            mes,
        ].join("-");

        if (!grupos.has(chave)) {
            grupos.set(chave, {
                atividade,
                modal: execucao.modal,
                ano,
                mes,
                slaHoras,
                totalExecucoes: 0,
                dentroPrazo: 0,
                foraPrazo: 0,
                somaHoras: 0,
            });
        }

        const grupo = grupos.get(chave)!;

        grupo.totalExecucoes += 1;
        grupo.somaHoras += duracaoHoras;

        if (dentroPrazo) {
            grupo.dentroPrazo += 1;
        } else {
            grupo.foraPrazo += 1;
        }
    });

    return Array.from(grupos.values())
        .map((grupo) => ({
            atividadeId: grupo.atividade.id,
            atividadeKey: grupo.atividade.atividadeKey,
            etapa: grupo.atividade.etapa,
            atividade: grupo.atividade.atividade,
            modal: grupo.modal,
            ano: grupo.ano,
            mes: grupo.mes,
            mesLabel: MESES[grupo.mes - 1],
            slaHoras: grupo.slaHoras,
            totalExecucoes: grupo.totalExecucoes,
            dentroPrazo: grupo.dentroPrazo,
            foraPrazo: grupo.foraPrazo,
            tempoMedioHoras:
                grupo.totalExecucoes > 0
                    ? grupo.somaHoras / grupo.totalExecucoes
                    : null,
            aderenciaPercentual:
                grupo.totalExecucoes > 0
                    ? (grupo.dentroPrazo / grupo.totalExecucoes) * 100
                    : 0,
        }))
        .sort(
            (a, b) =>
                a.ano - b.ano ||
                a.mes - b.mes ||
                a.atividadeId - b.atividadeId
        );
}
