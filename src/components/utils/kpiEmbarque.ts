
import type {
    AtividadePlanejamento,
    ExecucaoAtividade,
    ModalTransporte,
} from "../types/planejamento";

export interface ResultadoKPIEmbarque {
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

const nomesMeses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
];

function converterDataLocal(data: string): Date {
    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
        const [ano, mes, dia] = data.split("-").map(Number);
        return new Date(ano, mes - 1, dia);
    }

    return new Date(data);
}

function normalizarTexto(texto: string): string {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();
}

function ehNomeacaoNavio(
    atividade: AtividadePlanejamento
): boolean {
    const texto = normalizarTexto(
        `${atividade.atividade} ${atividade.objetivoMetrica}`
    );

    return (
        texto.includes("NOMEACAO DO NAVIO") ||
        texto.includes("NAVIO GRANELEIRO")
    );
}

function obterSla(
    atividade: AtividadePlanejamento,
    modal: ModalTransporte
): number {
    return (
        atividade.targetsPorModal?.[modal]?.horas ??
        atividade.prazoHoras
    );
}

export function calcularKPIsEmbarque(
    atividades: AtividadePlanejamento[],
    execucoes: ExecucaoAtividade[],
    dataInicio: string,
    dataFim: string
): ResultadoKPIEmbarque[] {
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

    const atividadesPorId = new Map(
        atividades.map((atividade) => [atividade.id, atividade])
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
        if (!execucao.modal) return;

        const atividade = atividadesPorId.get(execucao.atividadeId);

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
        const nomeacaoNavio = ehNomeacaoNavio(atividade);

        const dentroPrazo = nomeacaoNavio
            ? diferencaHoras >= slaHoras
            : diferencaHoras <= slaHoras;

        const ano = dataFinal.getFullYear();
        const mes = dataFinal.getMonth();

        const chave = [
            atividade.id,
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
        .map((grupo): ResultadoKPIEmbarque => ({
            atividadeId: grupo.atividade.id,
            atividadeKey: grupo.atividade.atividadeKey,
            etapa: grupo.atividade.etapa,
            atividade: grupo.atividade.atividade,
            modal: grupo.modal,
            ano: grupo.ano,
            mes: grupo.mes,
            mesLabel: nomesMeses[grupo.mes],
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
