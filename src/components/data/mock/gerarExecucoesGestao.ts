
import type {
    AtividadePlanejamento,
    ExecucaoAtividade,
    ModalTransporte,
    Unidade,
} from "../../types/planejamento";

const meses = [5, 6, 7, 8, 9, 10]; // Junho a novembro de 2026

// Cada modal terá volume e desempenho diferentes.
const fatoresPorModal: Record<ModalTransporte, number[]> = {
    aereo: [0.5, 0.8, 1.2, 1.5],
    maritimo: [0.6, 0.9, 1.1, 1.4, 1.8],
    rodoviario: [0.4, 0.7, 1.3],
};

function formatarData(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    const hora = String(data.getHours()).padStart(2, "0");
    const minuto = String(data.getMinutes()).padStart(2, "0");

    return `${ano}-${mes}-${dia}T${hora}:${minuto}:00`;
}

export function gerarExecucoesGestao(
    atividades: AtividadePlanejamento[],
    unidade: Unidade
): ExecucaoAtividade[] {
    const execucoes: ExecucaoAtividade[] = [];

    const modais: ModalTransporte[] = [
        "aereo",
        "maritimo",
        "rodoviario",
    ];

    atividades.forEach((atividade) => {
        modais.forEach((modal) => {
            const fatores = fatoresPorModal[modal];

            meses.forEach((mes) => {
                fatores.forEach((fator, indiceExecucao) => {
                    const slaHoras =
                        atividade.targetsPorModal?.[modal]?.horas ??
                        atividade.prazoHoras;

                    const dataInicio = new Date(
                        2026,
                        mes,
                        5 + indiceExecucao * 4,
                        9,
                        0
                    );

                    const duracaoHoras = slaHoras * fator;

                    const dataConclusao = new Date(
                        dataInicio.getTime() +
                        duracaoHoras * 60 * 60 * 1000
                    );

                    execucoes.push({
                        id: [
                            unidade,
                            atividade.atividadeKey,
                            modal,
                            mes,
                            indiceExecucao,
                        ].join("-"),
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
