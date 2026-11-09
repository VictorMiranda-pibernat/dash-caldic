
import type {
    AtividadePlanejamento,
    ExecucaoAtividade,
    ModalTransporte,
    Unidade,
} from "../types/planejamento";

export interface ResultadoKPIPosEmbarque {
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

const NOMES_MESES = [
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

function obterSla(
    atividade: AtividadePlanejamento,
    modal: ModalTransporte
): number {
    return atividade.targetsPorModal?.[modal]?.horas ?? atividade.prazoHoras;
}

export function calcularKPIsPosEmbarque(
    atividades: AtividadePlanejamento[],
    execucoes: ExecucaoAtividade[],
    unidade: Unidade,
    dataInicio: string,
    dataFim: string
): ResultadoKPIPosEmbarque[] {
    const inicioPeriodo = converterDataLocal(dataInicio);
    const fimPeriodo = converterDataLocal(dataFim);

    if (
        Number.isNaN(inicioPeriodo.getTime()) ||
        Number.isNaN(fimPeriodo.getTime()) ||
        inicioPeriodo > fimPeriodo
    ) {
        return [];
    }

    const fimPeriodoExclusivo = new Date(fimPeriodo);
    fimPeriodoExclusivo.setDate(fimPeriodoExclusivo.getDate() + 1);

    const atividadesPorKey = new Map(
        atividades.map((atividade) => [
            atividade.atividadeKey,
            atividade,
        ])
    );

    const agrupamentos = new Map<
        string,
        {
            atividade: AtividadePlanejamento;
            modal: ModalTransporte;
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
        if (!execucao.modal || execucao.unidade !== unidade) return;

        const atividade = atividadesPorKey.get(execucao.atividadeKey);
        if (!atividade) return;

        const dataInicial = converterDataLocal(execucao.dataInicio);
        const dataFinal = converterDataLocal(execucao.dataConclusao);

        if (
            Number.isNaN(dataInicial.getTime()) ||
            Number.isNaN(dataFinal.getTime()) ||
            dataFinal < dataInicial
        ) {
            return;
        }

        if (
            dataFinal < inicioPeriodo ||
            dataFinal >= fimPeriodoExclusivo
        ) {
            return;
        }

        const diferencaHoras =
            (dataFinal.getTime() - dataInicial.getTime()) /
            (1000 * 60 * 60);

        const slaHoras = obterSla(atividade, execucao.modal);
        const dentroPrazo = diferencaHoras <= slaHoras;

        const ano = dataFinal.getFullYear();
        const mes = dataFinal.getMonth();

        const chave = [
            unidade,
            atividade.atividadeKey,
            execucao.modal,
            ano,
            mes,
        ].join("-");

        if (!agrupamentos.has(chave)) {
            agrupamentos.set(chave, {
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

        const grupo = agrupamentos.get(chave)!;

        grupo.totalExecucoes += 1;
        grupo.somaHoras += diferencaHoras;

        if (dentroPrazo) {
            grupo.dentroPrazo += 1;
        } else {
            grupo.foraPrazo += 1;
        }
    });

    return Array.from(agrupamentos.values())
        .map((grupo): ResultadoKPIPosEmbarque => ({
            atividadeId: grupo.atividade.id,
            atividadeKey: grupo.atividade.atividadeKey,
            etapa: grupo.atividade.etapa,
            atividade: grupo.atividade.atividade,
            modal: grupo.modal,
            ano: grupo.ano,
            mes: grupo.mes + 1,
            mesLabel: NOMES_MESES[grupo.mes],
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
                    : null,
        }))
        .sort((a, b) => {
            if (a.ano !== b.ano) return a.ano - b.ano;
            if (a.mes !== b.mes) return a.mes - b.mes;
            return a.atividadeId - b.atividadeId;
        });
}
