
import type {
    AtividadePlanejamento,
    ExecucaoAtividade,
    ModalTransporte,
    Unidade,
} from "../types/planejamento";

export interface ResultadoKPIPosProcesso {
    atividadeId: number;
    atividadeKey: string;
    atividade: string;
    etapa: string;
    modal: ModalTransporte;
    ano: number;
    mes: number;
    mesLabel: string;
    totalExecucoes: number;
    dentroPrazo: number;
    foraPrazo: number;
    tempoMedioHoras: number;
    aderencia: number;
}

interface GrupoKPI {
    atividadeId: number;
    atividadeKey: string;
    atividade: string;
    etapa: string;
    modal: ModalTransporte;
    ano: number;
    mes: number;
    mesLabel: string;
    totalExecucoes: number;
    dentroPrazo: number;
    foraPrazo: number;
    horasAcumuladas: number;
}

const NOMES_MESES = [
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

const ATIVIDADES_CONFERENCIA_CUSTOS = [
    "guarulhos-51",
    "santa-catarina-43",
];

const ATIVIDADES_FATURAMENTO = [
    "guarulhos-52",
    "santa-catarina-44",
];

const ATIVIDADES_DOCUMENTOS = [
    "guarulhos-53",
    "santa-catarina-45",
];

function obterSla(
    atividade: AtividadePlanejamento,
    modal: ModalTransporte
): number {
    return atividade.targetsPorModal?.[modal]?.horas
        ?? atividade.prazoHoras;
}

function calcularDiferencaHoras(
    inicio: Date,
    fim: Date
): number {
    return (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60);
}

export function calcularKPIsPosProcesso(
    atividades: AtividadePlanejamento[],
    execucoes: ExecucaoAtividade[],
    unidade: Unidade,
    dataInicio: string,
    dataFim: string
): ResultadoKPIPosProcesso[] {
    const atividadesEtapa9 = atividades.filter(
        (atividade) => atividade.etapa.trim().startsWith("9.")
    );

    const atividadesPorKey = new Map(
        atividadesEtapa9.map((atividade) => [
            atividade.atividadeKey,
            atividade,
        ])
    );

    const grupos = new Map<string, GrupoKPI>();

    execucoes.forEach((execucao) => {
        if (execucao.unidade !== unidade || !execucao.modal) {
            return;
        }

        const atividade = atividadesPorKey.get(
            execucao.atividadeKey
        );

        if (!atividade) return;

        const dataInicioExecucao = new Date(execucao.dataInicio);
        const dataConclusao = new Date(execucao.dataConclusao);

        if (
            Number.isNaN(dataInicioExecucao.getTime()) ||
            Number.isNaN(dataConclusao.getTime())
        ) {
            return;
        }

        const slaHoras = obterSla(atividade, execucao.modal);

        let resultadoHoras: number;
        let dentroPrazo: boolean;
        let dataReferencia: Date;

        // ATIVIDADE 1:
        // Conferência de custos logísticos.
        // Deve ocorrer pelo menos 24 horas antes do faturamento.
        if (
            ATIVIDADES_CONFERENCIA_CUSTOS.includes(
                atividade.atividadeKey
            )
        ) {
            resultadoHoras = calcularDiferencaHoras(
                dataInicioExecucao,
                dataConclusao
            );

            dentroPrazo = resultadoHoras >= slaHoras;

            // Referência mensal: data do faturamento.
            dataReferencia = dataConclusao;
        }

        // ATIVIDADE 2:
        // Faturamento para Caldic.
        // Deve ocorrer em até 48 horas após a entrega.
        else if (
            ATIVIDADES_FATURAMENTO.includes(
                atividade.atividadeKey
            )
        ) {
            resultadoHoras = calcularDiferencaHoras(
                dataInicioExecucao,
                dataConclusao
            );

            dentroPrazo =
                resultadoHoras >= 0 &&
                resultadoHoras <= slaHoras;

            // Referência mensal: data do faturamento.
            dataReferencia = dataConclusao;
        }

        // ATIVIDADE 3:
        // Anexação dos documentos no Easy Trade.
        // Deve ocorrer em até 48 horas após o faturamento.
        else if (
            ATIVIDADES_DOCUMENTOS.includes(
                atividade.atividadeKey
            )
        ) {
            resultadoHoras = calcularDiferencaHoras(
                dataInicioExecucao,
                dataConclusao
            );

            dentroPrazo =
                resultadoHoras >= 0 &&
                resultadoHoras <= slaHoras;

            // Referência mensal: data da anexação.
            dataReferencia = dataConclusao;
        } else {
            return;
        }

        const dataReferenciaTexto = [
            dataReferencia.getFullYear(),
            String(dataReferencia.getMonth() + 1).padStart(2, "0"),
            String(dataReferencia.getDate()).padStart(2, "0"),
        ].join("-");

        if (
            dataReferenciaTexto < dataInicio ||
            dataReferenciaTexto > dataFim
        ) {
            return;
        }

        const ano = dataReferencia.getFullYear();
        const mes = dataReferencia.getMonth() + 1;
        const mesLabel = NOMES_MESES[dataReferencia.getMonth()];

        const chave = [
            atividade.atividadeKey,
            execucao.modal,
            ano,
            mes,
        ].join("-");

        const grupo = grupos.get(chave) ?? {
            atividadeId: atividade.id,
            atividadeKey: atividade.atividadeKey,
            atividade: atividade.atividade,
            etapa: atividade.etapa,
            modal: execucao.modal,
            ano,
            mes,
            mesLabel,
            totalExecucoes: 0,
            dentroPrazo: 0,
            foraPrazo: 0,
            horasAcumuladas: 0,
        };

        grupo.totalExecucoes += 1;
        grupo.horasAcumuladas += resultadoHoras;

        if (dentroPrazo) {
            grupo.dentroPrazo += 1;
        } else {
            grupo.foraPrazo += 1;
        }

        grupos.set(chave, grupo);
    });

    return Array.from(grupos.values())
        .map((grupo) => ({
            atividadeId: grupo.atividadeId,
            atividadeKey: grupo.atividadeKey,
            atividade: grupo.atividade,
            etapa: grupo.etapa,
            modal: grupo.modal,
            ano: grupo.ano,
            mes: grupo.mes,
            mesLabel: grupo.mesLabel,
            totalExecucoes: grupo.totalExecucoes,
            dentroPrazo: grupo.dentroPrazo,
            foraPrazo: grupo.foraPrazo,

            tempoMedioHoras:
                grupo.totalExecucoes > 0
                    ? grupo.horasAcumuladas / grupo.totalExecucoes
                    : 0,

            aderencia:
                grupo.totalExecucoes > 0
                    ? (grupo.dentroPrazo / grupo.totalExecucoes) * 100
                    : 0,
        }))
        .sort(
            (a, b) =>
                a.ano - b.ano ||
                a.mes - b.mes ||
                a.atividade.localeCompare(b.atividade)
        );
}
