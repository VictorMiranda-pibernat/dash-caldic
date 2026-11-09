
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

const FATORES = [
    0.5,
    0.8,
    1.0,
    1.3,
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
    return (
        atividade.targetsPorModal?.[modal]?.horas ??
        atividade.prazoHoras
    );
}

export function gerarExecucoesChegadaBrasil(
    atividades: AtividadePlanejamento[],
    unidade: Unidade
): ExecucaoAtividade[] {
    const execucoes: ExecucaoAtividade[] = [];

    atividades.forEach((atividade) => {
        MODAIS.forEach((modal) => {
            const slaHoras = obterSla(atividade, modal);

            MESES.forEach((mes, indiceMes) => {
                for (let ocorrencia = 0; ocorrencia < 4; ocorrencia++) {
                    const dataInicio = new Date(
                        2026,
                        mes,
                        4 + ocorrencia * 6,
                        9 + ocorrencia,
                        0,
                        0
                    );

                    const fator =
                        FATORES[
                            (indiceMes + ocorrencia) % FATORES.length
                        ];

                    const duracaoHoras = slaHoras * fator;

                    const dataConclusao = adicionarHoras(
                        dataInicio,
                        duracaoHoras
                    );

                    execucoes.push({
                        id: [
                            "chegada-brasil",
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
