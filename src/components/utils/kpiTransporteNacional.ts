
import type {
    AtividadePlanejamento,
    ExecucaoAtividade,
    ModalTransporte,
    Unidade,
} from "../types/planejamento";

export interface ResultadoKPITransporteNacional {
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

const ATIVIDADE_FICHAS_SC = "santa-catarina-42";

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

export function calcularKPIsTransporteNacional(
    atividades: AtividadePlanejamento[],
    execucoes: ExecucaoAtividade[],
    unidade: Unidade,
    dataInicio: string,
    dataFim: string
): ResultadoKPITransporteNacional[] {
    const atividadesEtapa8 = atividades.filter(
        (atividade) => atividade.etapa.trim().startsWith("8.")
    );

    const atividadesPorKey = new Map(
        atividadesEtapa8.map((atividade) => [
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

        const atividadeFichas =
            atividade.atividadeKey === ATIVIDADE_FICHAS_SC;

        let dataReferencia: Date;
        let resultadoHoras: number;
        let dentroPrazo: boolean;

        const slaHoras = obterSla(atividade, execucao.modal);

        if (atividadeFichas) {
            // Para as fichas, a referência é a data prevista
            // de entrega na planta, não a data de conclusão.
            if (!execucao.dataEntregaPrevista) return;

            const dataEntregaPrevista = new Date(
                execucao.dataEntregaPrevista
            );

            if (Number.isNaN(dataEntregaPrevista.getTime())) {
                return;
            }

            // Antecedência entre emissão das fichas e entrega.
            resultadoHoras = calcularDiferencaHoras(
                dataConclusao,
                dataEntregaPrevista
            );

            // A emissão precisa ocorrer pelo menos 48h antes.
            dentroPrazo = resultadoHoras >= slaHoras;

            // Agrupamento e filtro mensal pela data prevista
            // de entrega na planta.
            dataReferencia = dataEntregaPrevista;
        } else {
            // Para cobrança de minuta, o prazo é contado
            // a partir da entrega da carga.
            resultadoHoras = calcularDiferencaHoras(
                dataInicioExecucao,
                dataConclusao
            );

            dentroPrazo =
                resultadoHoras >= 0 &&
                resultadoHoras <= slaHoras;

            // Agrupamento e filtro mensal pela conclusão.
            dataReferencia = dataConclusao;
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
