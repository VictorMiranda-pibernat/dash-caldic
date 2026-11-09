
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

const ATIVIDADE_FICHAS_SC = "santa-catarina-42";

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

export function gerarExecucoesTransporteNacional(
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

                    // ATIVIDADE 42 - SANTA CATARINA
                    // A emissão das fichas deve ocorrer pelo menos
                    // 48 horas antes da entrega prevista na planta.
                    if (atividade.atividadeKey === ATIVIDADE_FICHAS_SC) {
                        const dataEntregaPrevista = new Date(
                            2026,
                            mes,
                            dia,
                            10,
                            0,
                            0
                        );

                        // 0.5 e 0.8 simulam emissão fora do prazo.
                        // 1.0 representa exatamente 48 horas antes.
                        // 1.3 representa emissão antecipada.
                        const horasAntecedencia = 48 * fator;

                        const dataConclusao = adicionarHoras(
                            dataEntregaPrevista,
                            -horasAntecedencia
                        );

                        // Início fictício do processo de emissão.
                        const dataInicio = adicionarHoras(
                            dataConclusao,
                            -4
                        );

                        execucoes.push({
                            id: [
                                "transporte-nacional",
                                unidade,
                                atividade.atividadeKey,
                                modal,
                                2026,
                                mes,
                                ocorrencia,
                            ].join("-"),

                            atividadeId: atividade.id,
                            atividadeKey: atividade.atividadeKey,
                            unidade,
                            modal,
                            dataInicio: formatarData(dataInicio),
                            dataConclusao: formatarData(dataConclusao),
                            dataEntregaPrevista: formatarData(
                                dataEntregaPrevista
                            ),
                        });

                        return;
                    }

                    // ATIVIDADES DE COBRANÇA DE MINUTA
                    // O início ocorre na entrega da carga.
                    // A conclusão ocorre na cobrança da minuta.
                    const dataInicio = new Date(
                        2026,
                        mes,
                        dia,
                        hora,
                        0,
                        0
                    );

                    const duracaoHoras = slaHoras * fator;

                    const dataConclusao = adicionarHoras(
                        dataInicio,
                        duracaoHoras
                    );

                    execucoes.push({
                        id: [
                            "transporte-nacional",
                            unidade,
                            atividade.atividadeKey,
                            modal,
                            2026,
                            mes,
                            ocorrencia,
                        ].join("-"),

                        atividadeId: atividade.id,
                        atividadeKey: atividade.atividadeKey,
                        unidade,
                        modal,
                        dataInicio: formatarData(dataInicio),
                        dataConclusao: formatarData(dataConclusao),
                    });
                }
            });
        });
    });

    return execucoes;
}
