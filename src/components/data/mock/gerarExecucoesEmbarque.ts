
// Gera registros fictícios sem alterar o catálogo original
// nem os geradores das páginas anteriores.

import type {
    AtividadePlanejamento,
    ExecucaoAtividade,
    ModalTransporte,
    Unidade,
} from "../../types/planejamento";

const meses = [5, 6, 7, 8, 9, 10]; // Junho a novembro de 2026

const modais: ModalTransporte[] = [
    "aereo",
    "maritimo",
    "rodoviario",
];

const fatoresPorModal: Record<ModalTransporte, number[]> = {
    aereo: [0.5, 0.9, 1.2, 1.6],
    maritimo: [0.6, 0.85, 1.1, 1.5],
    rodoviario: [0.4, 0.8, 1.2, 1.7],
};

function formatarDataLocal(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    const hora = String(data.getHours()).padStart(2, "0");
    const minuto = String(data.getMinutes()).padStart(2, "0");
    const segundo = String(data.getSeconds()).padStart(2, "0");

    return `${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}`;
}

function adicionarHoras(data: Date, horas: number): Date {
    const resultado = new Date(data);
    resultado.setTime(resultado.getTime() + horas * 60 * 60 * 1000);
    return resultado;
}

function normalizarTexto(texto: string): string {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();
}

function identificarTipoAtividade(
    atividade: AtividadePlanejamento
): "follow-up" | "nomeacao-navio" | "padrao" {
    const texto = normalizarTexto(
        `${atividade.atividade} ${atividade.objetivoMetrica}`
    );

    if (
        texto.includes("OCORRENCIA DE ATUALIZACAO") ||
        (
            texto.includes("FOLLOW UP") &&
            atividade.prazoHoras <= 8
        )
    ) {
        return "follow-up";
    }

    if (
        texto.includes("NOMEACAO DO NAVIO") ||
        texto.includes("NAVIO GRANELEIRO")
    ) {
        return "nomeacao-navio";
    }

    return "padrao";
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

export function gerarExecucoesEmbarque(
    atividades: AtividadePlanejamento[],
    unidade: Unidade
): ExecucaoAtividade[] {
    const execucoes: ExecucaoAtividade[] = [];

    atividades.forEach((atividade) => {
        const tipo = identificarTipoAtividade(atividade);

        modais.forEach((modal) => {
            const slaHoras = obterSla(atividade, modal);
            const fatores = fatoresPorModal[modal];

            meses.forEach((mes, indiceMes) => {
                const ano = 2026;

                // Follow Up: quatro ocorrências individuais por mês.
                if (tipo === "follow-up") {
                    for (let ocorrencia = 0; ocorrencia < 4; ocorrencia++) {
                        const dia = 3 + ocorrencia * 6;

                        const inicio = new Date(
                            ano,
                            mes,
                            dia,
                            8 + ocorrencia,
                            0,
                            0
                        );

                        const fator =
                            fatores[(ocorrencia + indiceMes) % fatores.length];

                        const duracaoHoras = slaHoras * fator;

                        const conclusao = adicionarHoras(
                            inicio,
                            duracaoHoras
                        );

                        execucoes.push({
                            id: `embarque-${unidade}-${atividade.id}-${modal}-${ano}-${mes}-followup-${ocorrencia + 1}`,
                            atividadeId: atividade.id,
                            atividadeKey: atividade.atividadeKey,
                            unidade,
                            modal,
                            dataInicio: formatarDataLocal(inicio),
                            dataConclusao: formatarDataLocal(conclusao),
                        });
                    }

                    return;
                }

                // Nomeação do navio: antecedência mínima de 168 horas.
                if (tipo === "nomeacao-navio") {
                    const duracoes = [192, 180, 156, 204];

                    const horasAntecedencia =
                        duracoes[
                            (indiceMes + modais.indexOf(modal)) %
                            duracoes.length
                        ];

                    const chegada = new Date(
                        ano,
                        mes,
                        22,
                        10,
                        0,
                        0
                    );

                    const nomeacao = adicionarHoras(
                        chegada,
                        -horasAntecedencia
                    );

                    execucoes.push({
                        id: `embarque-${unidade}-${atividade.id}-${modal}-${ano}-${mes}-nomeacao`,
                        atividadeId: atividade.id,
                        atividadeKey: atividade.atividadeKey,
                        unidade,
                        modal,
                        dataInicio: formatarDataLocal(nomeacao),
                        dataConclusao: formatarDataLocal(chegada),
                    });

                    return;
                }

                // Atividades padrão: cada registro é uma execução individual.
                fatores.forEach((fator, indiceFator) => {
                    const dia = 4 + indiceFator * 5;

                    const inicio = new Date(
                        ano,
                        mes,
                        dia,
                        9,
                        0,
                        0
                    );

                    const duracaoHoras = slaHoras * fator;

                    const conclusao = adicionarHoras(
                        inicio,
                        duracaoHoras
                    );

                    execucoes.push({
                        id: `embarque-${unidade}-${atividade.id}-${modal}-${ano}-${mes}-${indiceFator + 1}`,
                        atividadeId: atividade.id,
                        atividadeKey: atividade.atividadeKey,
                        unidade,
                        modal,
                        dataInicio: formatarDataLocal(inicio),
                        dataConclusao: formatarDataLocal(conclusao),
                    });
                });
            });
        });
    });

    return execucoes;
}
