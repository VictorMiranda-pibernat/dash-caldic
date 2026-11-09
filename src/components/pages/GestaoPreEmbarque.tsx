
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import type {
    Unidade,
    AtividadePlanejamento,
} from "../types/planejamento";

import { usePlanejamento } from "../../hooks/usePlanejamento";
import { gerarExecucoesGestao } from "../data/mock/gerarExecucoesGestao";
import { calcularKPIsPorPeriodo } from "../utils/kpiPlanejamento";

import { BarChart } from "../charts/BarChart";
import { PieChart } from "../charts/PieChart";

const unidadesValidas: Unidade[] = [
    "guarulhos",
    "santa-catarina",
];

const formatarNumero = (valor: number) =>
    valor.toLocaleString("pt-BR", {
        maximumFractionDigits: 2,
    });

const cardClass =
    "rounded-xl border border-[#292B34] bg-[#181920] p-5";

export default function GestaoPreEmbarque() {
    const { local } = useParams<{ local: string }>();

    const unidade = unidadesValidas.includes(local as Unidade)
        ? (local as Unidade)
        : "guarulhos";

    const [atividades, setAtividades] = useState<
        AtividadePlanejamento[]
    >([]);

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    const [dataInicio, setDataInicio] = useState("2026-06-01");
    const [dataFim, setDataFim] = useState("2026-11-30");
    const [modal, setModal] = useState("todos");

    // Carrega somente as atividades da Etapa 2.
    useEffect(() => {
        let ativo = true;

        async function carregarDados() {
            try {
                setCarregando(true);
                setErro(null);

                const planejamento = await usePlanejamento(unidade);

                const atividadesGestao = planejamento.atividades.filter(
                    (atividade) =>
                        atividade.etapa.trim().startsWith("2.")
                );
                
                if (ativo) {
                    setAtividades(atividadesGestao);
                }
            } catch {
                if (ativo) {
                    setErro(
                        "Não foi possível carregar os dados da Gestão Pré-embarque."
                    );
                }
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        carregarDados();

        return () => {
            ativo = false;
        };
    }, [unidade]);

    const periodoValido =
        Boolean(dataInicio) &&
        Boolean(dataFim) &&
        dataInicio <= dataFim;

    // Gera execuções fictícias usando o SLA de cada atividade e modal.
    const execucoes = useMemo(
        () => gerarExecucoesGestao(atividades, unidade),
        [atividades, unidade]
    );

    // Calcula os KPIs com a mesma regra utilizada no Planejamento.
    const kpis = useMemo(() => {
        if (!periodoValido) return [];

        return calcularKPIsPorPeriodo(
            atividades,
            execucoes,
            dataInicio,
            dataFim
        );
    }, [
        atividades,
        execucoes,
        dataInicio,
        dataFim,
        periodoValido,
    ]);

    const kpisFiltrados = useMemo(() => {
        if (modal === "todos") return kpis;

        return kpis.filter((kpi) => kpi.modal === modal);
    }, [kpis, modal]);

    // Consolidação mensal.
    const dadosMensais = useMemo(() => {
        const agrupamento = new Map<string, {
            ano: number;
            mes: number;
            mesLabel: string;
            totalExecucoes: number;
            dentroPrazo: number;
            foraPrazo: number;
            horasAcumuladas: number;
        }>();

        kpisFiltrados.forEach((kpi) => {
            const chave = `${kpi.ano}-${kpi.mes}`;

            const atual = agrupamento.get(chave) ?? {
                ano: kpi.ano,
                mes: kpi.mes,
                mesLabel: `${kpi.mesLabel.slice(0, 3)}/${kpi.ano}`,
                totalExecucoes: 0,
                dentroPrazo: 0,
                foraPrazo: 0,
                horasAcumuladas: 0,
            };

            atual.totalExecucoes += kpi.totalExecucoes;
            atual.dentroPrazo += kpi.dentroPrazo;
            atual.foraPrazo += kpi.foraPrazo;
            atual.horasAcumuladas +=
                (kpi.tempoMedioHoras ?? 0) * kpi.totalExecucoes;

            agrupamento.set(chave, atual);
        });

        return Array.from(agrupamento.values())
            .sort((a, b) => a.ano - b.ano || a.mes - b.mes)
            .map((item) => ({
                ...item,
                aderencia:
                    item.totalExecucoes > 0
                        ? (item.dentroPrazo / item.totalExecucoes) * 100
                        : 0,
                tempoMedio:
                    item.totalExecucoes > 0
                        ? item.horasAcumuladas / item.totalExecucoes
                        : 0,
            }));
    }, [kpisFiltrados]);

    // Indicadores gerais.
    const resumo = useMemo(() => {
        const totalExecucoes = kpisFiltrados.reduce(
            (total, kpi) => total + kpi.totalExecucoes,
            0
        );

        const dentroPrazo = kpisFiltrados.reduce(
            (total, kpi) => total + kpi.dentroPrazo,
            0
        );

        const foraPrazo = kpisFiltrados.reduce(
            (total, kpi) => total + kpi.foraPrazo,
            0
        );

        const horasAcumuladas = kpisFiltrados.reduce(
            (total, kpi) =>
                total +
                (kpi.tempoMedioHoras ?? 0) * kpi.totalExecucoes,
            0
        );

        return {
            totalExecucoes,
            dentroPrazo,
            foraPrazo,
            aderencia:
                totalExecucoes > 0
                    ? (dentroPrazo / totalExecucoes) * 100
                    : null,
            tempoMedio:
                totalExecucoes > 0
                    ? horasAcumuladas / totalExecucoes
                    : null,
        };
    }, [kpisFiltrados]);

    // Evolução mensal por atividade.
    const dadosPorAtividade = useMemo(() => {
        return atividades.map((atividade) => {
            const dadosDaAtividade = kpisFiltrados.filter(
                (kpi) => kpi.atividadeKey === atividade.atividadeKey
            );

            const agrupamento = new Map<string, {
                ano: number;
                mes: number;
                mesLabel: string;
                dentroPrazo: number;
                foraPrazo: number;
            }>();

            dadosDaAtividade.forEach((kpi) => {
                const chave = `${kpi.ano}-${kpi.mes}`;

                const atual = agrupamento.get(chave) ?? {
                    ano: kpi.ano,
                    mes: kpi.mes,
                    mesLabel: `${kpi.mesLabel.slice(0, 3)}/${kpi.ano}`,
                    dentroPrazo: 0,
                    foraPrazo: 0,
                };

                atual.dentroPrazo += kpi.dentroPrazo;
                atual.foraPrazo += kpi.foraPrazo;

                agrupamento.set(chave, atual);
            });

            return {
                atividadeKey: atividade.atividadeKey,
                atividade: atividade.atividade,
                sla: atividade.sla,
                objetivoMetrica: atividade.objetivoMetrica,
                prazoHoras: atividade.prazoHoras,
                dados: Array.from(agrupamento.values()).sort(
                    (a, b) => a.ano - b.ano || a.mes - b.mes
                ),
            };
        });
    }, [atividades, kpisFiltrados]);

    const nomeUnidade =
        unidade === "guarulhos" ? "Guarulhos" : "Santa Catarina";

    return (
        <main className="space-y-6 p-6 md:p-8">
            <header>
                <p className="mb-2 text-sm text-gray-500">
                    Gestão Pré-embarque / {nomeUnidade}
                </p>

                <h1 className="text-2xl font-semibold text-white">
                    Gestão Pré-embarque - {nomeUnidade}
                </h1>

                <p className="mt-2 text-sm text-gray-400">
                    Acompanhamento das atividades pré-embarque,
                    cumprimento dos SLAs e eficiência operacional.
                </p>
            </header>

            {carregando ? (
                <div className={cardClass}>
                    <p className="text-center text-sm text-gray-400">
                        Carregando indicadores...
                    </p>
                </div>
            ) : erro ? (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-400">
                    {erro}
                </div>
            ) : atividades.length === 0 ? (
                <div className={cardClass}>
                    <p className="text-center text-sm text-yellow-400">
                        Nenhuma atividade da Etapa 2 foi encontrada para esta unidade.
                        Verifique o catálogo de atividades.
                    </p>
                </div>
            ) : (
                <>
                    {/* FILTROS */}
                    <section className={`${cardClass} flex flex-wrap items-end gap-4`}>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-gray-400">
                                Data inicial
                            </label>

                            <input
                                type="date"
                                value={dataInicio}
                                max={dataFim || undefined}
                                onChange={(event) =>
                                    setDataInicio(event.target.value)
                                }
                                className="rounded-lg border border-[#292B34] bg-[#20212A] px-3 py-2 text-sm text-white"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-gray-400">
                                Data final
                            </label>

                            <input
                                type="date"
                                value={dataFim}
                                min={dataInicio || undefined}
                                onChange={(event) =>
                                    setDataFim(event.target.value)
                                }
                                className="rounded-lg border border-[#292B34] bg-[#20212A] px-3 py-2 text-sm text-white"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-gray-400">
                                Modal de transporte
                            </label>

                            <select
                                value={modal}
                                onChange={(event) =>
                                    setModal(event.target.value)
                                }
                                className="min-w-44 rounded-lg border border-[#292B34] bg-[#20212A] px-3 py-2 text-sm text-white"
                            >
                                <option value="todos">Todos os modais</option>
                                <option value="aereo">Aéreo</option>
                                <option value="maritimo">Marítimo</option>
                                <option value="rodoviario">Rodoviário</option>
                            </select>
                        </div>

                        <div className="ml-auto self-end">
                            <span className="text-xs text-yellow-400">
                                Dados fictícios para validação
                            </span>
                        </div>
                    </section>

                    {!periodoValido ? (
                        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                            A data inicial deve ser anterior ou igual à data final.
                        </div>
                    ) : (
                        <>
                            {/* INDICADORES */}
                            <section>
                                <div className="mb-4">
                                    <h2 className="text-lg font-semibold text-white">
                                        Indicadores gerais
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-400">
                                        Resultados das atividades da Gestão Pré-embarque
                                        no período selecionado.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                                    <div className={cardClass}>
                                        <h3 className="mb-5 text-base font-semibold text-white">
                                            Total de execuções por mês
                                        </h3>

                                        <BarChart
                                            data={dadosMensais}
                                            dataKey="totalExecucoes"
                                            xAxisKey="mesLabel"
                                            color="#3988D8"
                                            height={300}
                                        />
                                    </div>

                                    <div className={cardClass}>
                                        <h3 className="mb-5 text-base font-semibold text-white">
                                            Execuções dentro e fora do SLA
                                        </h3>

                                        <BarChart
                                            data={dadosMensais}
                                            xAxisKey="mesLabel"
                                            height={300}
                                            series={[
                                                {
                                                    dataKey: "dentroPrazo",
                                                    label: "Dentro do SLA",
                                                    color: "#22C55E",
                                                },
                                                {
                                                    dataKey: "foraPrazo",
                                                    label: "Fora do SLA",
                                                    color: "#EF4444",
                                                },
                                            ]}
                                        />
                                    </div>

                                    <div className={cardClass}>
                                        <h3 className="mb-5 text-base font-semibold text-white">
                                            Aderência ao SLA por mês (%)
                                        </h3>

                                        <BarChart
                                            data={dadosMensais}
                                            dataKey="aderencia"
                                            xAxisKey="mesLabel"
                                            color="#22C55E"
                                            height={300}
                                        />
                                    </div>

                                    <div className={cardClass}>
                                        <h3 className="mb-5 text-base font-semibold text-white">
                                            Tempo médio de execução (horas)
                                        </h3>

                                        <BarChart
                                            data={dadosMensais}
                                            dataKey="tempoMedio"
                                            xAxisKey="mesLabel"
                                            color="#3988D8"
                                            height={300}
                                        />
                                    </div>

                                    <div className={`${cardClass} xl:col-span-2`}>
                                        <h3 className="mb-5 text-base font-semibold text-white">
                                            Distribuição geral das execuções por SLA
                                        </h3>

                                        <PieChart
                                            data={[
                                                {
                                                    name: "Dentro do SLA",
                                                    value: resumo.dentroPrazo,
                                                },
                                                {
                                                    name: "Fora do SLA",
                                                    value: resumo.foraPrazo,
                                                },
                                            ]}
                                            colors={["#22C55E", "#EF4444"]}
                                            height={300}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* DESEMPENHO POR ATIVIDADE */}
                            <section className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-white">
                                        Desempenho por atividade
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-400">
                                        Acompanhamento individual das atividades
                                        e seus respectivos limites de SLA.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                                    {dadosPorAtividade.map((item) => (
                                        <div
                                            key={item.atividadeKey}
                                            className={cardClass}
                                        >
                                            <h3 className="mb-3 text-sm font-semibold text-white">
                                                {item.atividade}
                                            </h3>

                                            <p className="mb-2 text-xs text-gray-400">
                                                SLA: {item.prazoHoras} horas
                                                {" · "}
                                                {item.sla}
                                            </p>

                                            <p className="mb-4 text-xs text-gray-500">
                                                Objetivo: {item.objetivoMetrica}
                                            </p>

                                            <BarChart
                                                data={item.dados}
                                                xAxisKey="mesLabel"
                                                height={240}
                                                series={[
                                                    {
                                                        dataKey: "dentroPrazo",
                                                        label: "Dentro do SLA",
                                                        color: "#22C55E",
                                                    },
                                                    {
                                                        dataKey: "foraPrazo",
                                                        label: "Fora do SLA",
                                                        color: "#EF4444",
                                                    },
                                                ]}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <p className="text-right text-xs text-gray-500">
                                {formatarNumero(resumo.totalExecucoes)} execuções no período
                                {" · "}
                                Aderência geral:{" "}
                                {resumo.aderencia === null
                                    ? "—"
                                    : `${formatarNumero(resumo.aderencia)}%`}
                                {" · "}
                                Tempo médio:{" "}
                                {resumo.tempoMedio === null
                                    ? "—"
                                    : `${formatarNumero(resumo.tempoMedio)} horas`}
                            </p>
                        </>
                    )}
                </>
            )}
        </main>
    );
}
