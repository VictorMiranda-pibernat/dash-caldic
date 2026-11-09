
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
    ClipboardCheck,
    Clock,
    PackageCheck,
    RefreshCw,
    TrendingUp,
} from "lucide-react";

import { usePlanejamento } from "../../hooks/usePlanejamento";

import type {
    AtividadePlanejamento,
    Unidade,
} from "../types/planejamento";

import { gerarExecucoesPosProcesso } from "../data/mock/gerarExecucoesPosProcesso";
import { calcularKPIsPosProcesso } from "../utils/kpiPosProcesso";

import { BarChart } from "../charts/BarChart";
import { PieChart } from "../charts/PieChart";

const CORES = {
    azul: "#3988D8",
    verde: "#22C55E",
    vermelho: "#EF4444",
    amarelo: "#EAB308",
};

const CARD_CLASS =
    "rounded-xl border border-[#292B34] bg-[#181920] p-5";

const MODAIS = [
    { value: "todos", label: "Todos os modais" },
    { value: "aereo", label: "Aéreo" },
    { value: "maritimo", label: "Marítimo" },
    { value: "rodoviario", label: "Rodoviário" },
];

const DATA_INICIAL = "2026-06-01";
const DATA_FINAL = "2026-11-30";

function formatarPercentual(valor: number): string {
    return `${valor.toFixed(1).replace(".", ",")}%`;
}

function formatarHoras(valor: number): string {
    return `${valor.toFixed(1).replace(".", ",")} h`;
}

export default function PosProcesso() {
    const { local } = useParams<{ local: string }>();

    const unidadesValidas: Unidade[] = [
        "guarulhos",
        "santa-catarina",
    ];

    const unidade: Unidade = unidadesValidas.includes(local as Unidade)
        ? (local as Unidade)
        : "guarulhos";

    const [atividades, setAtividades] = useState<AtividadePlanejamento[]>([]);
    const [dataInicio, setDataInicio] = useState(DATA_INICIAL);
    const [dataFim, setDataFim] = useState(DATA_FINAL);
    const [modal, setModal] = useState("todos");
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let ativo = true;

        async function carregarPlanejamento() {
            try {
                setCarregando(true);
                setErro("");

                const planejamento = await usePlanejamento(unidade);

                if (!ativo) return;

                const atividadesEtapa9 = planejamento.atividades.filter(
                    (atividade) =>
                        atividade.etapa.trim().startsWith("9.")
                );

                setAtividades(atividadesEtapa9);
            } catch (error) {
                console.error("Erro ao carregar Pós-processo:", error);

                if (ativo) {
                    setErro(
                        "Não foi possível carregar os dados do planejamento."
                    );
                }
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        carregarPlanejamento();

        return () => {
            ativo = false;
        };
    }, [unidade]);

    // Geração dos dados fictícios.
    const execucoes = useMemo(
        () => gerarExecucoesPosProcesso(atividades, unidade),
        [atividades, unidade]
    );

    // Cálculo dos indicadores.
    const todosKPIs = useMemo(
        () =>
            calcularKPIsPosProcesso(
                atividades,
                execucoes,
                unidade,
                dataInicio,
                dataFim
            ),
        [atividades, execucoes, unidade, dataInicio, dataFim]
    );

    // Aplicação do filtro de modal.
    const dadosFiltrados = useMemo(
        () =>
            modal === "todos"
                ? todosKPIs
                : todosKPIs.filter((item) => item.modal === modal),
        [todosKPIs, modal]
    );

    // Consolidação geral dos indicadores.
    const resumo = useMemo(() => {
        const totalExecucoes = dadosFiltrados.reduce(
            (total, item) => total + item.totalExecucoes,
            0
        );

        const dentroPrazo = dadosFiltrados.reduce(
            (total, item) => total + item.dentroPrazo,
            0
        );

        const foraPrazo = dadosFiltrados.reduce(
            (total, item) => total + item.foraPrazo,
            0
        );

        return {
            totalExecucoes,
            dentroPrazo,
            foraPrazo,
            aderencia:
                totalExecucoes > 0
                    ? (dentroPrazo / totalExecucoes) * 100
                    : 0,
        };
    }, [dadosFiltrados]);

    // Consolidação mensal.
    const dadosMensais = useMemo(() => {
        const grupos = new Map<
            string,
            {
                mes: number;
                mesLabel: string;
                totalExecucoes: number;
                dentroPrazo: number;
                foraPrazo: number;
            }
        >();

        dadosFiltrados.forEach((item) => {
            const chave = `${item.ano}-${item.mes}`;

            const grupo = grupos.get(chave) ?? {
                mes: item.mes,
                mesLabel: item.mesLabel,
                totalExecucoes: 0,
                dentroPrazo: 0,
                foraPrazo: 0,
            };

            grupo.totalExecucoes += item.totalExecucoes;
            grupo.dentroPrazo += item.dentroPrazo;
            grupo.foraPrazo += item.foraPrazo;

            grupos.set(chave, grupo);
        });

        return Array.from(grupos.values())
            .sort((a, b) => a.mes - b.mes)
            .map((item) => ({
                ...item,
                aderencia:
                    item.totalExecucoes > 0
                        ? (item.dentroPrazo / item.totalExecucoes) * 100
                        : 0,
            }));
    }, [dadosFiltrados]);

    // Desempenho mensal de cada atividade.
    const dadosDesempenhoMensal = useMemo(() => {
        const atividadesUnicas = Array.from(
            new Map(
                dadosFiltrados.map((item) => [
                    item.atividadeKey,
                    {
                        atividadeKey: item.atividadeKey,
                        atividade: item.atividade,
                    },
                ])
            ).values()
        ).map((item, index) => ({
            ...item,
            chartKey: `atividade_${index}`,
        }));

        const grupos = new Map<
            string,
            {
                mes: number;
                mesLabel: string;
                atividades: Map<
                    string,
                    {
                        totalExecucoes: number;
                        dentroPrazo: number;
                    }
                >;
            }
        >();

        dadosFiltrados.forEach((item) => {
            const chave = `${item.ano}-${item.mes}`;

            const grupo = grupos.get(chave) ?? {
                mes: item.mes,
                mesLabel: item.mesLabel,
                atividades: new Map(),
            };

            const atividade = grupo.atividades.get(item.atividadeKey) ?? {
                totalExecucoes: 0,
                dentroPrazo: 0,
            };

            atividade.totalExecucoes += item.totalExecucoes;
            atividade.dentroPrazo += item.dentroPrazo;

            grupo.atividades.set(item.atividadeKey, atividade);
            grupos.set(chave, grupo);
        });

        const dados = Array.from(grupos.values())
            .sort((a, b) => a.mes - b.mes)
            .map((grupo) => {
                const resultado: Record<string, string | number> = {
                    mesLabel: grupo.mesLabel,
                };

                atividadesUnicas.forEach((atividade) => {
                    const valores = grupo.atividades.get(
                        atividade.atividadeKey
                    );

                    resultado[atividade.chartKey] =
                        valores && valores.totalExecucoes > 0
                            ? (valores.dentroPrazo /
                                valores.totalExecucoes) *
                              100
                            : 0;
                });

                return resultado;
            });

        return {
            dados,
            series: atividadesUnicas.map((atividade, index) => ({
                dataKey: atividade.chartKey,
                label: atividade.atividade,
                color: [
                    CORES.azul,
                    CORES.verde,
                    CORES.amarelo,
                ][index % 3],
            })),
        };
    }, [dadosFiltrados]);

    // Consolidação por atividade.
    const dadosPorAtividade = useMemo(() => {
        const grupos = new Map<
            string,
            {
                atividade: string;
                totalExecucoes: number;
                dentroPrazo: number;
                foraPrazo: number;
            }
        >();

        dadosFiltrados.forEach((item) => {
            const grupo = grupos.get(item.atividadeKey) ?? {
                atividade: item.atividade,
                totalExecucoes: 0,
                dentroPrazo: 0,
                foraPrazo: 0,
            };

            grupo.totalExecucoes += item.totalExecucoes;
            grupo.dentroPrazo += item.dentroPrazo;
            grupo.foraPrazo += item.foraPrazo;

            grupos.set(item.atividadeKey, grupo);
        });

        return Array.from(grupos.values()).map((item) => ({
            ...item,
            aderencia:
                item.totalExecucoes > 0
                    ? (item.dentroPrazo / item.totalExecucoes) * 100
                    : 0,
        }));
    }, [dadosFiltrados]);

    // Métricas de tempo separadas por atividade.
    // Não misturamos antecedência com duração após evento.
    const metricasTempo = useMemo(() => {
        const grupos = new Map<
            string,
            {
                atividade: string;
                atividadeKey: string;
                horasAcumuladas: number;
                total: number;
            }
        >();

        dadosFiltrados.forEach((item) => {
            const grupo = grupos.get(item.atividadeKey) ?? {
                atividade: item.atividade,
                atividadeKey: item.atividadeKey,
                horasAcumuladas: 0,
                total: 0,
            };

            grupo.horasAcumuladas +=
                item.tempoMedioHoras * item.totalExecucoes;

            grupo.total += item.totalExecucoes;

            grupos.set(item.atividadeKey, grupo);
        });

        return Array.from(grupos.values()).map((item) => ({
            atividade: item.atividade,
            atividadeKey: item.atividadeKey,
            tempoMedio:
                item.total > 0
                    ? item.horasAcumuladas / item.total
                    : 0,
        }));
    }, [dadosFiltrados]);

    const metricasConferencia = metricasTempo.filter((item) =>
        [
            "guarulhos-51",
            "santa-catarina-43",
        ].includes(item.atividadeKey)
    );

    const metricasPosEvento = metricasTempo.filter((item) =>
        [
            "guarulhos-52",
            "santa-catarina-44",
            "guarulhos-53",
            "santa-catarina-45",
        ].includes(item.atividadeKey)
    );

    if (carregando) {
        return (
            <div className="flex min-h-[400px] items-center justify-center text-gray-400">
                <RefreshCw className="mr-2 animate-spin" size={20} />
                Carregando Pós-processo...
            </div>
        );
    }

    if (erro) {
        return (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-400">
                {erro}
            </div>
        );
    }

    return (
        <main className="space-y-6 p-6 md:p-8 text-white">
            {/* Cabeçalho */}
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold">
                        Pós-processo / Controle
                    </h1>

                    <p className="mt-1 text-sm text-gray-400">
                        Etapa 9 · Acompanhamento dos processos após a chegada.
                    </p>

                    <p className="mt-1 text-xs uppercase tracking-wider text-gray-500">
                        Unidade:{" "}
                        {unidade === "guarulhos"
                            ? "Guarulhos"
                            : "Santa Catarina"}
                    </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <RefreshCw size={16} />
                    Dados demonstrativos
                </div>
            </div>

            {/* Filtros */}
            <div className={`${CARD_CLASS} grid grid-cols-1 gap-4 md:grid-cols-3`}>
                <div>
                    <label className="mb-2 block text-sm text-gray-400">
                        Data inicial
                    </label>

                    <input
                        type="date"
                        value={dataInicio}
                        max={dataFim}
                        onChange={(event) => setDataInicio(event.target.value)}
                        className="w-full rounded-lg border border-[#353741] bg-[#22232C] px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm text-gray-400">
                        Data final
                    </label>

                    <input
                        type="date"
                        value={dataFim}
                        min={dataInicio}
                        onChange={(event) => setDataFim(event.target.value)}
                        className="w-full rounded-lg border border-[#353741] bg-[#22232C] px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm text-gray-400">
                        Modal de transporte
                    </label>

                    <select
                        value={modal}
                        onChange={(event) => setModal(event.target.value)}
                        className="w-full rounded-lg border border-[#353741] bg-[#22232C] px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                    >
                        {MODAIS.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Indicadores principais */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className={CARD_CLASS}>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">
                            Total de execuções
                        </p>
                        <ClipboardCheck className="text-blue-400" size={21} />
                    </div>

                    <p className="mt-3 text-3xl font-bold">
                        {resumo.totalExecucoes}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        Atividades realizadas no período
                    </p>
                </div>

                <div className={CARD_CLASS}>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">
                            Dentro do SLA
                        </p>
                        <PackageCheck className="text-green-400" size={21} />
                    </div>

                    <p className="mt-3 text-3xl font-bold text-green-400">
                        {resumo.dentroPrazo}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        Execuções dentro do prazo
                    </p>
                </div>

                <div className={CARD_CLASS}>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">
                            Fora do SLA
                        </p>
                        <Clock className="text-red-400" size={21} />
                    </div>

                    <p className="mt-3 text-3xl font-bold text-red-400">
                        {resumo.foraPrazo}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        Execuções fora do prazo
                    </p>
                </div>

                <div className={CARD_CLASS}>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">
                            Aderência geral
                        </p>
                        <TrendingUp className="text-blue-400" size={21} />
                    </div>

                    <p className="mt-3 text-3xl font-bold text-blue-400">
                        {formatarPercentual(resumo.aderencia)}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        Percentual dentro do SLA
                    </p>
                </div>
            </div>

            {/* Gráficos mensais */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <div className={CARD_CLASS}>
                    <h2 className="mb-4 text-base font-semibold">
                        Volume de execuções por mês
                    </h2>

                    <BarChart
                        data={dadosMensais}
                        dataKey="totalExecucoes"
                        xAxisKey="mesLabel"
                        color={CORES.azul}
                        height={300}
                    />
                </div>

                <div className={CARD_CLASS}>
                    <h2 className="mb-4 text-base font-semibold">
                        Execuções dentro x fora do SLA
                    </h2>

                    <BarChart
                        data={dadosMensais}
                        xAxisKey="mesLabel"
                        height={300}
                        series={[
                            {
                                dataKey: "dentroPrazo",
                                label: "Dentro do SLA",
                                color: CORES.verde,
                            },
                            {
                                dataKey: "foraPrazo",
                                label: "Fora do SLA",
                                color: CORES.vermelho,
                            },
                        ]}
                    />
                </div>
            </div>

            {/* Aderência por atividade */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <div className={CARD_CLASS}>
                    <h2 className="mb-4 text-base font-semibold">
                        Aderência ao SLA por atividade
                    </h2>

                    <BarChart
                        data={dadosPorAtividade}
                        dataKey="aderencia"
                        xAxisKey="atividade"
                        color={CORES.azul}
                        height={320}
                    />
                </div>

                <div className={CARD_CLASS}>
                    <h2 className="mb-4 text-base font-semibold">
                        Distribuição geral do SLA
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
                        colors={[CORES.verde, CORES.vermelho]}
                        height={320}
                    />
                </div>
            </div>

            {/* Indicadores de tempo por natureza */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <div className={CARD_CLASS}>
                    <h2 className="mb-2 text-base font-semibold">
                        Antecedência média da conferência de custos
                    </h2>

                    <p className="mb-4 text-xs text-gray-400">
                        Intervalo entre a conferência dos custos e o faturamento.
                    </p>

                    {metricasConferencia.length > 0 ? (
                        <div className="space-y-3">
                            {metricasConferencia.map((item) => (
                                <div
                                    key={item.atividadeKey}
                                    className="flex items-center justify-between gap-3 border-b border-[#292B34] pb-3 last:border-0"
                                >
                                    <span className="text-sm text-gray-300">
                                        {item.atividade}
                                    </span>

                                    <span className="whitespace-nowrap text-sm font-semibold text-blue-400">
                                        {formatarHoras(item.tempoMedio)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="py-8 text-center text-sm text-gray-500">
                            Sem dados para o período selecionado.
                        </p>
                    )}
                </div>

                <div className={CARD_CLASS}>
                    <h2 className="mb-2 text-base font-semibold">
                        Tempo médio após evento
                    </h2>

                    <p className="mb-4 text-xs text-gray-400">
                        Entrega até faturamento e faturamento até anexação.
                    </p>

                    {metricasPosEvento.length > 0 ? (
                        <div className="space-y-3">
                            {metricasPosEvento.map((item) => (
                                <div
                                    key={item.atividadeKey}
                                    className="flex items-center justify-between gap-3 border-b border-[#292B34] pb-3 last:border-0"
                                >
                                    <span className="text-sm text-gray-300">
                                        {item.atividade}
                                    </span>

                                    <span className="whitespace-nowrap text-sm font-semibold text-blue-400">
                                        {formatarHoras(item.tempoMedio)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="py-8 text-center text-sm text-gray-500">
                            Sem dados para o período selecionado.
                        </p>
                    )}
                </div>
            </div>

            {/* Desempenho mensal por atividade */}
            <div className={CARD_CLASS}>
                <h2 className="mb-2 text-base font-semibold">
                    Desempenho por atividade
                </h2>

                <p className="mb-4 text-xs text-gray-400">
                    Comparativo mensal da aderência ao SLA de cada atividade.
                </p>

                {dadosDesempenhoMensal.dados.length > 0 ? (
                    <BarChart
                        data={dadosDesempenhoMensal.dados}
                        xAxisKey="mesLabel"
                        height={350}
                        series={dadosDesempenhoMensal.series}
                    />
                ) : (
                    <p className="py-12 text-center text-sm text-gray-500">
                        Nenhuma execução encontrada para os filtros selecionados.
                    </p>
                )}
            </div>
        </main>
    );
}
