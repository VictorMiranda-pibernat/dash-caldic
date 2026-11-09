
import type {
    AtividadePlanejamento,
    ExecucaoAtividade,
    ModalTransporte,
    Unidade,
} from "../../types/planejamento";

const MESES = [5, 6, 7, 8, 9, 10];

const MODAIS: ModalTransporte[] = [
    "aereo",
    "maritimo",
    "rodoviario",
];

// Variações para simular resultados dentro e fora do SLA.
const FATORES = [0.5, 0.8, 1.0, 1.3];

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
function formatarData(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    const hora = String(data.getHours()).padStart(2, "0");
    const minuto = String(data.getMinutes()).padStart(2, "0");

    return `${ano}-${mes}-${dia}T${hora}:${minuto}:00`;
}

function adicionarHoras(data: Date, horas: number): Date {
    return new Date(data.getTime() + horas * 60 * 60 * 1000);
}

function obterSla(
    atividade: AtividadePlanejamento,
    modal: ModalTransporte
): number {
    return atividade.targetsPorModal?.[modal]?.horas
        ?? atividade.prazoHoras;
}

export function gerarExecucoesPosProcesso(
    atividades: AtividadePlanejamento[],
    unidade: Unidade
): ExecucaoAtividade[] {
    const execucoes: ExecucaoAtividade[] = [];

    atividades.forEach((atividade) => {
        MODAIS.forEach((modal) => {
            const slaHoras = obterSla(atividade, modal);

            MESES.forEach((mes, indiceMes) => {
                for (let ocorrencia = 0; ocorrencia < 4; ocorrencia++) {
                    const dia = 4 + ocorrencia * 6;
                    const hora = 9 + ocorrencia;

                    const fator =
                        FATORES[(indiceMes + ocorrencia) % FATORES.length];

                    const idBase = [
                        "pos-processo",
                        unidade,
                        atividade.atividadeKey,
                        modal,
                        2026,
                        mes,
                        ocorrencia,
                    ].join("-");

                    // ATIVIDADE 1:
                    // Conferência de custos logísticos.
                    // Deve ocorrer pelo menos 24 horas antes do faturamento.
                    if (
                        ATIVIDADES_CONFERENCIA_CUSTOS.includes(
                            atividade.atividadeKey
                        )
                    ) {
                        const dataFaturamento = new Date(
                            2026,
                            mes,
                            dia,
                            hora,
                            0,
                            0
                        );

                        // 0.5 e 0.8 simulam antecedência insuficiente.
                        // 1.0 representa exatamente o SLA.
                        // 1.3 representa antecedência superior ao SLA.
                        const horasAntecedencia = slaHoras * fator;

                        const dataConferencia = adicionarHoras(
                            dataFaturamento,
                            -horasAntecedencia
                        );

                        execucoes.push({
                            id: idBase,
                            atividadeId: atividade.id,
                            atividadeKey: atividade.atividadeKey,
                            unidade,
                            modal,
                            // Início: conferência dos custos.
                            dataInicio: formatarData(dataConferencia),
                            // Conclusão: faturamento.
                            dataConclusao: formatarData(dataFaturamento),
                        });
                    }

                    // ATIVIDADE 2:
                    // Faturamento para Caldic.
                    // Deve ocorrer até 48 horas após a entrega na planta.
                    if (
                        ATIVIDADES_FATURAMENTO.includes(
                            atividade.atividadeKey
                        )
                    ) {
                        const dataEntrega = new Date(
                            2026,
                            mes,
                            dia,
                            hora,
                            0,
                            0
                        );

                        const duracaoHoras = slaHoras * fator;

                        const dataFaturamento = adicionarHoras(
                            dataEntrega,
                            duracaoHoras
                        );

                        execucoes.push({
                            id: idBase,
                            atividadeId: atividade.id,
                            atividadeKey: atividade.atividadeKey,
                            unidade,
                            modal,
                            // Início: entrega da carga na planta.
                            dataInicio: formatarData(dataEntrega),
                            // Conclusão: faturamento para Caldic.
                            dataConclusao: formatarData(dataFaturamento),
                        });
                    }

                    // ATIVIDADE 3:
                    // Anexação dos documentos no Easy Trade.
                    // Deve ocorrer até 48 horas após o faturamento.
                    if (
                        ATIVIDADES_DOCUMENTOS.includes(
                            atividade.atividadeKey
                        )
                    ) {
                        const dataFaturamento = new Date(
                            2026,
                            mes,
                            dia,
                            hora,
                            0,
                            0
                        );

                        const duracaoHoras = slaHoras * fator;

                        const dataAnexacao = adicionarHoras(
                            dataFaturamento,
                            duracaoHoras
                        );

                        execucoes.push({
                            id: idBase,
                            atividadeId: atividade.id,
                            atividadeKey: atividade.atividadeKey,
                            unidade,
                            modal,
                            // Início: faturamento.
                            dataInicio: formatarData(dataFaturamento),
                            // Conclusão: anexação dos documentos.
                            dataConclusao: formatarData(dataAnexacao),
                        });
                    }
                }
            });
        });
    });

    return execucoes;
}
