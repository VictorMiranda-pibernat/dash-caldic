
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import type {
    Unidade,
    AtividadePlanejamento,
} from "../types/planejamento";

import { usePlanejamento } from "../../hooks/usePlanejamento";
import { execucoesTeste } from "../data/mock/execucoesTeste";
import { calcularKPIsMensais } from "../utils/kpiPlanejamento";

import { BarChart } from "../charts/BarChart";
import { PieChart } from "../charts/PieChart";

const unidadesValidas: Unidade[] = [
    "guarulhos",
    "santa-catarina",
];

const meses = [
    { value: 6, label: "Junho" },
    { value: 7, label: "Julho" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Setembro" },
    { value: 10, label: "Outubro" },
    { value: 11, label: "Novembro" },
];
const formatarNumero = (valor: number) =>
    valor.toLocaleString("pt-BR", {
        maximumFractionDigits: 2,
    });

export default function Planejamento() {
    const { local } = useParams<{ local: string }>();

    const unidade = unidadesValidas.includes(local as Unidade)
        ? (local as Unidade)
        : "guarulhos";

    const [atividades, setAtividades] = useState<
        AtividadePlanejamento[]
    >([]);

    const [mes, setMes] = useState(11);
    const [modal, setModal] = useState("todos");

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        let ativo = true;

        async function carregarDados() {
            try {
                setCarregando(true);
                setErro(null);

                const planejamento = await usePlanejamento(unidade);

                if (ativo) {
                    setAtividades(planejamento.atividades.slice(0, 12));
                }
            } catch {
                if (ativo) {
                    setErro("Não foi possível carregar o planejamento.");
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

    const kpis = useMemo(() => {
        const execucoesDaUnidade = execucoesTeste.filter(
            (execucao) => execucao.unidade === unidade
        );

        return calcularKPIsMensais(
            atividades,
            execucoesDaUnidade,
            2026,
            mes
        );
    }, [atividades, unidade, mes]);

    const kpisFiltrados = useMemo(() => {
        if (modal === "todos") return kpis;

        return kpis.filter((kpi) => kpi.modal === modal);
    }, [kpis, modal]);

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

    const dadosPorEtapa = useMemo(() => {
        const agrupamento = new Map<
            string,
            {
                etapa: string;
                execucoes: number;
                dentroPrazo: number;
                foraPrazo: number;
                horasAcumuladas: number;
            }
        >();

        kpisFiltrados.forEach((kpi) => {
            const atual = agrupamento.get(kpi.etapa) ?? {
                etapa: kpi.etapa,
                execucoes: 0,
                dentroPrazo: 0,
                foraPrazo: 0,
                horasAcumuladas: 0,
            };

            atual.execucoes += kpi.totalExecucoes;
            atual.dentroPrazo += kpi.dentroPrazo;
            atual.foraPrazo += kpi.foraPrazo;
            atual.horasAcumuladas +=
                (kpi.tempoMedioHoras ?? 0) * kpi.totalExecucoes;

            agrupamento.set(kpi.etapa, atual);
        });

        return Array.from(agrupamento.values()).map((item) => ({
            ...item,
            aderencia:
                item.execucoes > 0
                    ? (item.dentroPrazo / item.execucoes) * 100
                    : 0,
            tempoMedio:
                item.execucoes > 0
                    ? item.horasAcumuladas / item.execucoes
                    : 0,
        }));
    }, [kpisFiltrados]);
    const dadosPorAtividade = useMemo(() => {
        const agrupamento = new Map<
            string,
            {
                atividadeKey: string;
                atividade: string;
                etapa: string;
                dentroPrazo: number;
                foraPrazo: number;
                totalExecucoes: number;
            }
        >();

        kpisFiltrados.forEach((kpi) => {
            const atual = agrupamento.get(kpi.atividadeKey) ?? {
                atividadeKey: kpi.atividadeKey,
                atividade: kpi.atividade,
                etapa: kpi.etapa,
                dentroPrazo: 0,
                foraPrazo: 0,
                totalExecucoes: 0,
            };

            atual.dentroPrazo += kpi.dentroPrazo;
            atual.foraPrazo += kpi.foraPrazo;
            atual.totalExecucoes += kpi.totalExecucoes;

            agrupamento.set(kpi.atividadeKey, atual);
        });

        return Array.from(agrupamento.values());
    }, [kpisFiltrados]);

    const nomeUnidade =
        unidade === "guarulhos" ? "Guarulhos" : "Santa Catarina";

    const cardClass =
        "rounded-xl border border-[#292B34] bg-[#181920] p-5";

    return (
        <main className="space-y-6 p-6 md:p-8">
            <header>
                <p className="mb-2 text-sm text-gray-500">
                    Planejamento / {nomeUnidade}
                </p>

                <h1 className="text-2xl font-semibold text-white">
                    Dashboard de KPI - {nomeUnidade}
                </h1>

                <p className="mt-2 text-sm text-gray-400">
                    Indicadores de desempenho, acompanhamento de SLAs e eficiência operacional.
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
            ) : (
                <>
                    {/* FILTROS */}
                    <section className={`${cardClass} flex flex-wrap items-center gap-4`}>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-gray-400">
                                Mês KPI
                            </label>

                            <select
                                value={mes}
                                onChange={(event) => setMes(Number(event.target.value))}
                                className="min-w-36 rounded-lg border border-[#292B34] bg-[#20212A] px-3 py-2 text-sm text-white"
                            >
                                {meses.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label} / 2026
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-gray-400">
                                Modal de transporte
                            </label>

                            <select
                                value={modal}
                                onChange={(event) => setModal(event.target.value)}
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

                    {/* CARDS DE KPI */}
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <div className={cardClass}>
                            <p className="text-sm text-gray-400">
                                Total de execuções
                            </p>
                            <p className="mt-3 text-3xl font-semibold text-white">
                                {formatarNumero(resumo.totalExecucoes)}
                            </p>
                            <p className="mt-2 text-xs text-gray-500">
                                Execuções concluídas no período
                            </p>
                        </div>

                        <div className={cardClass}>
                            <p className="text-sm text-gray-400">
                                Dentro do SLA
                            </p>
                            <p className="mt-3 text-3xl font-semibold text-white">
                                {formatarNumero(resumo.dentroPrazo)}
                            </p>
                            <p className="mt-2 text-xs text-gray-500">
                                Execuções dentro do prazo definido
                            </p>
                        </div>

                        <div className={cardClass}>
                            <p className="text-sm text-gray-400">
                                Fora do SLA
                            </p>
                            <p className="mt-3 text-3xl font-semibold text-white">
                                {formatarNumero(resumo.foraPrazo)}
                            </p>
                            <p className="mt-2 text-xs text-gray-500">
                                Execuções acima do prazo definido
                            </p>
                        </div>

                        <div className={cardClass}>
                            <p className="text-sm text-gray-400">
                                Aderência ao SLA
                            </p>
                            <p className="mt-3 text-3xl font-semibold text-white">
                                {resumo.aderencia === null
                                    ? "—"
                                    : `${formatarNumero(resumo.aderencia)}%`}
                            </p>
                            <p className="mt-2 text-xs text-gray-500">
                                Percentual de execuções dentro do SLA
                            </p>
                        </div>
                    </section>

                    {/* GRÁFICOS */}
                    <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                        <div className={cardClass}>
                            <h2 className="mb-5 text-base font-semibold text-white">
                                Volume de execuções por etapa
                            </h2>

                            <BarChart
                                data={dadosPorEtapa}
                                dataKey="execucoes"
                                xAxisKey="etapa"
                                color="#3988D8"
                                height={320}
                            />
                        </div>

                        <div className={cardClass}>
                            <h2 className="mb-5 text-base font-semibold text-white">
                                Distribuição de execuções por SLA
                            </h2>

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
                                height={320}
                            />
                        </div>

                        <div className={cardClass}>
                            <h2 className="mb-5 text-base font-semibold text-white">
                                Aderência ao SLA por etapa
                            </h2>

                            <BarChart
                                data={dadosPorEtapa}
                                dataKey="aderencia"
                                xAxisKey="etapa"
                                color="#3988D8"
                                height={320}
                            />
                        </div>

                        <div className={cardClass}>
                            <h2 className="mb-5 text-base font-semibold text-white">
                                Tempo médio de execução por etapa
                            </h2>

                            <BarChart
                                data={dadosPorEtapa}
                                dataKey="tempoMedio"
                                xAxisKey="etapa"
                                color="#3988D8"
                                height={320}
                            />
                        </div>
                    </section>

                    {/* GRÁFICOS INDIVIDUAIS POR ATIVIDADE */}
                    <section className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-white">
                                Desempenho por atividade
                            </h2>

                            <p className="mt-1 text-sm text-gray-400">
                                Comparativo de execuções dentro e fora do SLA, agrupado por etapa.
                            </p>
                        </div>

                        {atividades.reduce<string[]>((etapas, atividade) => {
                            if (!etapas.includes(atividade.etapa)) {
                                etapas.push(atividade.etapa);
                            }

                            return etapas;
                        }, []).map((etapa) => {
                            const atividadesDaEtapa = dadosPorAtividade.filter(
                                (item) => item.etapa === etapa
                            );

                            return (
                                <div key={etapa} className="space-y-4">
                                    <h3 className="border-b border-[#292B34] pb-3 text-base font-semibold text-gray-200">
                                        {etapa}
                                    </h3>

                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                                        {atividadesDaEtapa.map((item) => (
                                            <div
                                                key={item.atividadeKey}
                                                className={cardClass}
                                            >
                                                <h4 className="mb-2 min-h-10 text-sm font-medium text-white">
                                                    {item.atividade}
                                                </h4>

                                                <div className="mb-4 flex flex-wrap gap-4 text-xs">
                                                    <span className="text-gray-400">
                                                        Total: {formatarNumero(item.totalExecucoes)}
                                                    </span>

                                                    <span className="text-green-400">
                                                        Dentro: {formatarNumero(item.dentroPrazo)}
                                                    </span>

                                                    <span className="text-red-400">
                                                        Fora: {formatarNumero(item.foraPrazo)}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="rounded-lg bg-[#20212A] p-3">
                                                        <p className="text-xs text-gray-400">
                                                            Dentro do SLA
                                                        </p>
                                                        <p className="mt-1 text-xl font-semibold text-green-400">
                                                            {formatarNumero(item.dentroPrazo)}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-lg bg-[#20212A] p-3">
                                                        <p className="text-xs text-gray-400">
                                                            Fora do SLA
                                                        </p>
                                                        <p className="mt-1 text-xl font-semibold text-red-400">
                                                            {formatarNumero(item.foraPrazo)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#292B34]">
                                                    <div className="flex h-full w-full">
                                                        <div
                                                            className="h-full bg-[#22C55E]"
                                                            style={{
                                                                width: `${item.totalExecucoes > 0
                                                                        ? (item.dentroPrazo / item.totalExecucoes) * 100
                                                                        : 0
                                                                    }%`,
                                                            }}
                                                        />

                                                        <div
                                                            className="h-full bg-[#EF4444]"
                                                            style={{
                                                                width: `${item.totalExecucoes > 0
                                                                        ? (item.foraPrazo / item.totalExecucoes) * 100
                                                                        : 0
                                                                    }%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <p className="mt-2 text-right text-xs text-gray-500">
                                                    {item.totalExecucoes > 0
                                                        ? `${formatarNumero(
                                                            (item.dentroPrazo / item.totalExecucoes) * 100
                                                        )}% de aderência`
                                                        : "Sem execuções no período"}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </section>

                    <p className="text-right text-xs text-gray-500">
                        Tempo médio geral:{" "}
                        {resumo.tempoMedio === null
                            ? "—"
                            : `${formatarNumero(resumo.tempoMedio)} horas`}
                    </p>
                </>
            )}
        </main>
    );
}
