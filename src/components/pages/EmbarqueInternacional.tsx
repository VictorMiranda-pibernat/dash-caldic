
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
    AlertTriangle,
    CalendarDays,
    CheckCircle2,
    Clock3,
    RefreshCw,
    Ship
} from "lucide-react";

import { ResponsiveContainer,BarChart as RechartsBarChart,Bar, XAxis,YAxis,CartesianGrid,Tooltip,PieChart as RechartsPieChart,
    Pie,Cell,LineChart,Line} from "recharts";

import { usePlanejamento } from "../../hooks/usePlanejamento";
import type {AtividadePlanejamento, ModalTransporte, Unidade} from "../types/planejamento";

import { gerarExecucoesEmbarque } from "../data/mock/gerarExecucoesEmbarque";

import { calcularKPIsEmbarque} from "../utils/kpiEmbarque";

const MESES = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro",
];

const CORES = {
    verde: "#22C55E",
    vermelho: "#EF4444",
    amarelo: "#EAB308",
    azul: "#3B82F6",
    cinza: "#6B7280",
};

const CORES_GRAFICO = [
    "#22C55E",
    "#EF4444",
];

type ModalFiltro = ModalTransporte | "todos";

function formatarPercentual(valor: number): string {
    return `${valor.toFixed(1).replace(".", ",")}%`;
}

function formatarHoras(valor: number | null): string {
    if (valor === null) return "—";

    if (valor < 1) {
        return `${Math.round(valor * 60)} min`;
    }

    return `${valor.toFixed(1).replace(".", ",")} h`;
}

function nomeModal(modal: ModalTransporte): string {
    const nomes: Record<ModalTransporte, string> = {
        aereo: "Aéreo",
        maritimo: "Marítimo",
        rodoviario: "Rodoviário",
    };

    return nomes[modal];
}

function CardIndicador({
    titulo,
    valor,
    descricao,
    icone,
    cor,
}: {
    titulo: string;
    valor: string | number;
    descricao: string;
    icone: React.ReactNode;
    cor: string;
}) {
    return (
        <div className="rounded-xl border border-[#292B34] bg-[#181920] p-5">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-400">{titulo}</p>
                    <h3 className="mt-3 text-2xl font-bold text-white">
                        {valor}
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        {descricao}
                    </p>
                </div>

                <div
                    className="rounded-lg p-3"
                    style={{ backgroundColor: `${cor}20`, color: cor }}
                >
                    {icone}
                </div>
            </div>
        </div>
    );
}

function CardGrafico({
    titulo,
    descricao,
    children,
}: {
    titulo: string;
    descricao: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-[#292B34] bg-[#181920] p-5">
            <div className="mb-5">
                <h3 className="font-semibold text-white">{titulo}</h3>
                <p className="mt-1 text-xs text-gray-500">{descricao}</p>
            </div>
            {children}
        </div>
    );
}

export default function EmbarqueInternacional() {
    const modais: ModalTransporte[] = [
        "aereo",
        "maritimo",
        "rodoviario",
    ];
    const { local } = useParams<{ local: string }>();

    const unidade: Unidade =
        local === "santa-catarina"
            ? "santa-catarina"
            : "guarulhos";

    const [atividades, setAtividades] = useState<AtividadePlanejamento[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    const [dataInicio, setDataInicio] = useState("2026-06-01");
    const [dataFim, setDataFim] = useState("2026-11-30");
    const [modal, setModal] = useState<ModalFiltro>("todos");

    useEffect(() => {
        let ativo = true;

        async function carregarDados() {
            try {
                setCarregando(true);
                setErro(null);

                const resultado = await usePlanejamento(unidade);

                if (!ativo) return;

                const atividadesEtapa3 = resultado.atividades.filter(
                    (atividade) =>
                        atividade.etapa.trim().startsWith("3.")
                );

                setAtividades(atividadesEtapa3);
            } catch (error) {
                console.error("Erro ao carregar Embarque Internacional:", error);

                if (ativo) {
                    setErro(
                        "Não foi possível carregar as atividades de Embarque Internacional."
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

    const execucoes = useMemo(() => {
        return gerarExecucoesEmbarque(atividades, unidade);
    }, [atividades, unidade]);

    const resultados = useMemo(() => {
        return calcularKPIsEmbarque(
            atividades,
            execucoes,
            dataInicio,
            dataFim
        );
    }, [atividades, execucoes, dataInicio, dataFim]);

    const resultadosFiltrados = useMemo(() => {
        if (modal === "todos") return resultados;

        return resultados.filter((item) => item.modal === modal);
    }, [resultados, modal]);

    const resumo = useMemo(() => {
        const total = resultadosFiltrados.reduce(
            (soma, item) => soma + item.totalExecucoes,
            0
        );

        const dentro = resultadosFiltrados.reduce(
            (soma, item) => soma + item.dentroPrazo,
            0
        );

        const fora = resultadosFiltrados.reduce(
            (soma, item) => soma + item.foraPrazo,
            0
        );

        const somaHoras = resultadosFiltrados.reduce(
            (soma, item) =>
                soma + (item.tempoMedioHoras ?? 0) * item.totalExecucoes,
            0
        );

        return {
            total,
            dentro,
            fora,
            aderencia: total > 0 ? (dentro / total) * 100 : 0,
            tempoMedio: total > 0 ? somaHoras / total : null,
        };
    }, [resultadosFiltrados]);

    const dadosMensais = useMemo(() => {
        const agrupado = new Map<
            string,
            {
                mes: string;
                total: number;
                dentro: number;
                fora: number;
                aderencia: number;
            }
        >();

        resultadosFiltrados.forEach((item) => {
            const chave = `${item.ano}-${String(item.mes).padStart(2, "0")}`;

            if (!agrupado.has(chave)) {
                agrupado.set(chave, {
                    mes: `${MESES[item.mes - 1].slice(0, 3)}/${String(item.ano).slice(-2)}`,
                    total: 0,
                    dentro: 0,
                    fora: 0,
                    aderencia: 0,
                });
            }

            const registro = agrupado.get(chave)!;

            registro.total += item.totalExecucoes;
            registro.dentro += item.dentroPrazo;
            registro.fora += item.foraPrazo;
        });

        return Array.from(agrupado.values()).map((item) => ({
            ...item,
            aderencia:
                item.total > 0
                    ? (item.dentro / item.total) * 100
                    : 0,
        }));
    }, [resultadosFiltrados]);

    const dadosAtividades = useMemo(() => {
        const agrupado = new Map<
            number,
            {
                atividadeId: number;
                atividade: string;
                dentro: number;
                fora: number;
                total: number;
            }
        >();

        resultadosFiltrados.forEach((item) => {
            if (!agrupado.has(item.atividadeId)) {
                agrupado.set(item.atividadeId, {
                    atividadeId: item.atividadeId,
                    atividade: item.atividade,
                    dentro: 0,
                    fora: 0,
                    total: 0,
                });
            }

            const registro = agrupado.get(item.atividadeId)!;

            registro.dentro += item.dentroPrazo;
            registro.fora += item.foraPrazo;
            registro.total += item.totalExecucoes;
        });

        return Array.from(agrupado.values())
            .map((item) => ({
                ...item,
                nome:
                    item.atividade.length > 34
                        ? `${item.atividade.slice(0, 34)}...`
                        : item.atividade,
                aderencia:
                    item.total > 0
                        ? (item.dentro / item.total) * 100
                        : 0,
            }))
            .sort((a, b) => a.aderencia - b.aderencia);
    }, [resultadosFiltrados]);

   
const dadosModal = useMemo(() => {
    return modais
        .filter((item) => modal === "todos" || item === modal)
        .map((item) => {
            const registros = resultadosFiltrados.filter(
                (resultado) => resultado.modal === item
            );

            const total = registros.reduce(
                (soma, registro) => soma + registro.totalExecucoes,
                0
            );

            const dentro = registros.reduce(
                (soma, registro) => soma + registro.dentroPrazo,
                0
            );

            return {
                modal: nomeModal(item),
                total,
                dentro,
                fora: total - dentro,
            };
        })
        .filter((item) => item.total > 0);
}, [resultadosFiltrados, modal, modais]);


    const dadosPizza = [
        { nome: "Dentro do SLA", valor: resumo.dentro },
        { nome: "Fora do SLA", valor: resumo.fora },
    ].filter((item) => item.valor > 0);

    const unidadeLabel =
        unidade === "guarulhos" ? "Guarulhos" : "Santa Catarina";

    

    if (carregando) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-gray-400">
                <RefreshCw className="mr-3 animate-spin" size={20} />
                Carregando Embarque Internacional...
            </div>
        );
    }

    if (erro) {
        return (
            <div className="m-6 rounded-xl border border-red-500/30 bg-[#181920] p-6 text-red-400">
                {erro}
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 md:p-8">
            {/* Cabeçalho */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                        <Ship size={16} />
                        <span>Etapa 3 • Operação Internacional</span>
                    </div>

                    <h1 className="text-2xl font-bold text-white">
                        Embarque Internacional
                    </h1>

                    <p className="mt-2 text-sm text-gray-400">
                        Monitoramento dos embarques, documentos, tracking e
                        cumprimento dos prazos operacionais.
                    </p>
                </div>

                <div className="rounded-lg border border-[#292B34] bg-[#181920] px-4 py-2">
                    <p className="text-xs text-gray-500">Unidade selecionada</p>
                    <p className="font-semibold text-white">{unidadeLabel}</p>
                </div>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 gap-4 rounded-xl border border-[#292B34] bg-[#181920] p-5 md:grid-cols-3">
                <div>
                    <label className="mb-2 flex items-center gap-2 text-xs text-gray-400">
                        <CalendarDays size={14} />
                        Data inicial
                    </label>
                    <input
                        type="date"
                        value={dataInicio}
                        onChange={(event) => setDataInicio(event.target.value)}
                        className="w-full rounded-lg border border-[#292B34] bg-[#101116] px-3 py-2 text-sm text-white outline-none focus:border-green-500"
                    />
                </div>

                <div>
                    <label className="mb-2 flex items-center gap-2 text-xs text-gray-400">
                        <CalendarDays size={14} />
                        Data final
                    </label>
                    <input
                        type="date"
                        value={dataFim}
                        min={dataInicio}
                        onChange={(event) => setDataFim(event.target.value)}
                        className="w-full rounded-lg border border-[#292B34] bg-[#101116] px-3 py-2 text-sm text-white outline-none focus:border-green-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-xs text-gray-400">
                        Modal de transporte
                    </label>
                    <select
                        value={modal}
                        onChange={(event) =>
                            setModal(event.target.value as ModalFiltro)
                        }
                        className="w-full rounded-lg border border-[#292B34] bg-[#101116] px-3 py-2 text-sm text-white outline-none focus:border-green-500"
                    >
                        <option value="todos">Todos os modais</option>
                        <option value="aereo">Aéreo</option>
                        <option value="maritimo">Marítimo</option>
                        <option value="rodoviario">Rodoviário</option>
                    </select>
                </div>
            </div>

            {/* Indicadores */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <CardIndicador
                    titulo="Total de execuções"
                    valor={resumo.total}
                    descricao="Registros no período selecionado"
                    icone={<Ship size={21} />}
                    cor={CORES.azul}
                />

                <CardIndicador
                    titulo="Dentro do SLA"
                    valor={resumo.dentro}
                    descricao="Atividades concluídas no prazo"
                    icone={<CheckCircle2 size={21} />}
                    cor={CORES.verde}
                />

                <CardIndicador
                    titulo="Fora do SLA"
                    valor={resumo.fora}
                    descricao="Atividades que ultrapassaram o prazo"
                    icone={<AlertTriangle size={21} />}
                    cor={CORES.vermelho}
                />

                <CardIndicador
                    titulo="Aderência ao SLA"
                    valor={formatarPercentual(resumo.aderencia)}
                    descricao={`Tempo médio: ${formatarHoras(resumo.tempoMedio)}`}
                    icone={<Clock3 size={21} />}
                    cor={CORES.amarelo}
                />
            </div>

            {/* Gráficos principais */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <CardGrafico
                    titulo="Evolução mensal da aderência"
                    descricao="Percentual de execuções dentro do SLA por mês"
                >
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={dadosMensais}>
                            <CartesianGrid
                                stroke="#292B34"
                                strokeDasharray="3 3"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="mes"
                                stroke="#9CA3AF"
                                tick={{ fontSize: 11 }}
                            />
                            <YAxis
                                domain={[0, 100]}
                                stroke="#9CA3AF"
                                tick={{ fontSize: 11 }}
                                tickFormatter={(valor) => `${valor}%`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#181920",
                                    border: "1px solid #292B34",
                                    borderRadius: 8,
                                    color: "#fff",
                                }}
                                formatter={(valor) => [
                                    `${Number(valor).toFixed(1)}%`,
                                    "Aderência",
                                ]}
                            />
                            <Line
                                type="monotone"
                                dataKey="aderencia"
                                name="Aderência"
                                stroke={CORES.verde}
                                strokeWidth={3}
                                dot={{ r: 4, fill: CORES.verde }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardGrafico>

                <CardGrafico
                    titulo="Distribuição dos resultados"
                    descricao="Comparativo entre execuções dentro e fora do SLA"
                >
                    {dadosPizza.length > 0 ? (
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <ResponsiveContainer width="100%" height={250}>
                                <RechartsPieChart>
                                    <Pie
                                        data={dadosPizza}
                                        dataKey="valor"
                                        nameKey="nome"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={95}
                                        paddingAngle={4}
                                    >
                                        {dadosPizza.map((item, index) => (
                                            <Cell
                                                key={item.nome}
                                                fill={CORES_GRAFICO[index]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#181920",
                                            border: "1px solid #292B34",
                                            borderRadius: 8,
                                            color: "#fff",
                                        }}
                                    />
                                </RechartsPieChart>
                            </ResponsiveContainer>

                            <div className="space-y-4">
                                {dadosPizza.map((item, index) => (
                                    <div
                                        key={item.nome}
                                        className="flex items-center gap-3"
                                    >
                                        <span
                                            className="h-3 w-3 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    CORES_GRAFICO[index],
                                            }}
                                        />
                                        <div>
                                            <p className="text-sm text-gray-300">
                                                {item.nome}
                                            </p>
                                            <p className="font-semibold text-white">
                                                {item.valor} execuções
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-[250px] items-center justify-center text-sm text-gray-500">
                            Sem execuções no período.
                        </div>
                    )}
                </CardGrafico>
            </div>

            {/* Atividades */}
            <CardGrafico
                titulo="Aderência por atividade"
                descricao="Identifique quais atividades apresentam maior volume de desvios"
            >
                {dadosAtividades.length > 0 ? (
                    <ResponsiveContainer
                        width="100%"
                        height={Math.max(280, dadosAtividades.length * 58)}
                    >
                        <RechartsBarChart
                            data={dadosAtividades}
                            layout="vertical"
                            margin={{
                                top: 5,
                                right: 25,
                                left: 10,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid
                                stroke="#292B34"
                                strokeDasharray="3 3"
                                horizontal={false}
                            />
                            <XAxis
                                type="number"
                                domain={[0, 100]}
                                stroke="#9CA3AF"
                                tick={{ fontSize: 11 }}
                                tickFormatter={(valor) => `${valor}%`}
                            />
                            <YAxis
                                type="category"
                                dataKey="nome"
                                width={190}
                                stroke="#9CA3AF"
                                tick={{ fontSize: 10 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#181920",
                                    border: "1px solid #292B34",
                                    borderRadius: 8,
                                    color: "#fff",
                                }}
                                formatter={(valor) => [
                                    `${Number(valor).toFixed(1)}%`,
                                    "Aderência",
                                ]}
                            />
                            <Bar
                                dataKey="aderencia"
                                name="Aderência"
                                radius={[0, 5, 5, 0]}
                            >
                                {dadosAtividades.map((item) => (
                                    <Cell
                                        key={item.atividadeId}
                                        fill={
                                            item.aderencia >= 90
                                                ? CORES.verde
                                                : item.aderencia >= 70
                                                    ? CORES.amarelo
                                                    : CORES.vermelho
                                        }
                                    />
                                ))}
                            </Bar>
                        </RechartsBarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-[220px] items-center justify-center text-sm text-gray-500">
                        Sem atividades para os filtros selecionados.
                    </div>
                )}
            </CardGrafico>

            {/* Volume por modal */}
            <CardGrafico
                titulo="Volume de execuções por modal"
                descricao="Comparativo de atividades dentro e fora do SLA por modalidade de transporte"
            >
                {dadosModal.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                        <RechartsBarChart data={dadosModal}>
                            <CartesianGrid
                                stroke="#292B34"
                                strokeDasharray="3 3"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="modal"
                                stroke="#9CA3AF"
                                tick={{ fontSize: 11 }}
                            />
                            <YAxis
                                stroke="#9CA3AF"
                                tick={{ fontSize: 11 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#181920",
                                    border: "1px solid #292B34",
                                    borderRadius: 8,
                                    color: "#fff",
                                }}
                            />
                            <Bar
                                dataKey="dentro"
                                name="Dentro do SLA"
                                stackId="a"
                                fill={CORES.verde}
                            />
                            <Bar
                                dataKey="fora"
                                name="Fora do SLA"
                                stackId="a"
                                fill={CORES.vermelho}
                                radius={[5, 5, 0, 0]}
                            />
                        </RechartsBarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-[220px] items-center justify-center text-sm text-gray-500">
                        Sem execuções por modal no período.
                    </div>
                )}
            </CardGrafico>

            {/* Resumo por atividade */}
            <div className="overflow-hidden rounded-xl border border-[#292B34] bg-[#181920]">
                <div className="border-b border-[#292B34] p-5">
                    <h3 className="font-semibold text-white">
                        Resumo das atividades
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                        Indicadores consolidados conforme os filtros selecionados
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[750px] text-left text-sm">
                        <thead className="bg-[#101116] text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-5 py-4">Atividade</th>
                                <th className="px-5 py-4 text-center">Execuções</th>
                                <th className="px-5 py-4 text-center">Dentro SLA</th>
                                <th className="px-5 py-4 text-center">Fora SLA</th>
                                <th className="px-5 py-4 text-center">Aderência</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#292B34]">
                            {dadosAtividades.map((item) => (
                                <tr
                                    key={item.atividadeId}
                                    className="transition-colors hover:bg-[#20212A]"
                                >
                                    <td className="max-w-[420px] px-5 py-4 text-gray-300">
                                        {item.atividade}
                                    </td>
                                    <td className="px-5 py-4 text-center text-gray-300">
                                        {item.total}
                                    </td>
                                    <td className="px-5 py-4 text-center text-green-400">
                                        {item.dentro}
                                    </td>
                                    <td className="px-5 py-4 text-center text-red-400">
                                        {item.fora}
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span
                                            className={
                                                item.aderencia >= 90
                                                    ? "font-semibold text-green-400"
                                                    : item.aderencia >= 70
                                                        ? "font-semibold text-yellow-400"
                                                        : "font-semibold text-red-400"
                                            }
                                        >
                                            {formatarPercentual(item.aderencia)}
                                        </span>
                                    </td>
                                </tr>
                            ))}

                            {dadosAtividades.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-5 py-8 text-center text-gray-500"
                                    >
                                        Nenhum registro encontrado para os filtros selecionados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Observação das regras */}
            <div className="rounded-xl border border-[#292B34] bg-[#181920] p-4">
                <p className="text-xs leading-relaxed text-gray-400">
                    <strong className="text-gray-300">Critérios de SLA:</strong>{" "}
                    as atividades padrão são consideradas dentro do prazo
                    quando a duração é menor ou igual ao SLA definido. A
                    nomeação de navio graneleiro em Guarulhos exige pelo menos
                    168 horas de antecedência em relação à chegada. As
                    atualizações de Follow Up são contabilizadas como
                    ocorrências individuais, com SLA de 8 horas.
                </p>
            </div>
        </div>
    );
}
