
import { useMemo, useState } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
} from "react-simple-maps";
import {
    Globe2,
    Plane,
    Ship,
    Truck,
    Package,
    ArrowDownToLine,
    ArrowUpFromLine,
    CalendarDays,
    Building2,
    Filter,
} from "lucide-react";

import { PieChart } from "../charts/PieChart";

type Pais = {
    nome: string;
    id: string;
    quantidade: number;
    percentual: number;
};

type Modal = "Marítimo" | "Aéreo" | "Rodoviário";

type Operacao = {
    pais: string;
    id: string;
    unidade: "Santa Catarina" | "Guarulhos";
    modal: Modal;
    data: string;
};

type Periodo = "todos" | "30" | "90" | "ano";

const paisesOrigem = [
    { nome: "China", id: "156", quantidade: 128 },
    { nome: "Estados Unidos", id: "840", quantidade: 86 },
    { nome: "Alemanha", id: "276", quantidade: 64 },
    { nome: "Índia", id: "356", quantidade: 48 },
    { nome: "Itália", id: "380", quantidade: 38 },
    { nome: "Outros", id: "0", quantidade: 40 },
];

const paisesDestino = [
    { nome: "Brasil", id: "076", quantidade: 112 },
    { nome: "Argentina", id: "032", quantidade: 82 },
    { nome: "Chile", id: "152", quantidade: 70 },
    { nome: "México", id: "484", quantidade: 58 },
    { nome: "Estados Unidos", id: "840", quantidade: 48 },
    { nome: "Outros", id: "0", quantidade: 36 },
];

const geoUrl =
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

function gerarOperacoes(
    paises: typeof paisesOrigem,
    tipo: "origem" | "destino"
): Operacao[] {
    const operacoes: Operacao[] = [];
    const hoje = new Date();

    paises.forEach((pais, indicePais) => {
        for (let i = 0; i < pais.quantidade; i++) {
            const indice = operacoes.length;

            const data = new Date(hoje);
            data.setDate(hoje.getDate() - ((indice * 7 + indicePais * 3) % 365));

            const modal: Modal =
                indice % 100 < 58
                    ? "Marítimo"
                    : indice % 100 < 87
                        ? "Aéreo"
                        : "Rodoviário";

            operacoes.push({
                pais: pais.nome,
                id: pais.id,
                unidade:
                    indice % 2 === 0 ? "Santa Catarina" : "Guarulhos",
                modal,
                data: data.toISOString().slice(0, 10),
            });
        }
    });

    return operacoes;
}

const operacoesOrigem = gerarOperacoes(paisesOrigem, "origem");
const operacoesDestino = gerarOperacoes(paisesDestino, "destino");

function Indicador({
    titulo,
    valor,
    descricao,
    icon: Icon,
}: {
    titulo: string;
    valor: string;
    descricao: string;
    icon: React.ElementType;
}) {
    return (
        <div className="rounded-xl border border-[#292B34] bg-[#181920] p-5">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">{titulo}</p>
                <Icon size={19} className="text-[#22C55E]" />
            </div>

            <p className="mt-3 text-2xl font-bold text-white">{valor}</p>
            <p className="mt-1 text-xs text-gray-500">{descricao}</p>
        </div>
    );
}

function MapaMundi({ dados }: { dados: Pais[] }) {
    const [paisSelecionado, setPaisSelecionado] = useState<Pais | null>(null);

    const paisesAtivos = useMemo(
        () =>
            new Map(
                dados
                    .filter((pais) => pais.id !== "0")
                    .map((pais) => [pais.id, pais])
            ),
        [dados]
    );

    return (
        <div className="relative w-full overflow-hidden">
            <div className="absolute left-3 top-3 z-10 min-w-[190px] rounded-lg border border-[#343640] bg-[#20212A]/95 p-3 shadow-lg backdrop-blur-sm">
                {paisSelecionado ? (
                    <>
                        <p className="text-sm font-semibold text-white">
                            {paisSelecionado.nome}
                        </p>

                        <div className="mt-2 flex justify-between gap-4">
                            <span className="text-xs text-gray-400">
                                Operações
                            </span>
                            <span className="text-xs font-semibold text-white">
                                {paisSelecionado.quantidade}
                            </span>
                        </div>

                        <div className="mt-1 flex justify-between gap-4">
                            <span className="text-xs text-gray-400">
                                Participação
                            </span>
                            <span className="text-xs font-semibold text-[#22C55E]">
                                {paisSelecionado.percentual}%
                            </span>
                        </div>
                    </>
                ) : (
                    <p className="text-xs text-gray-400">
                        Passe o mouse sobre um país destacado
                    </p>
                )}
            </div>

            <ComposableMap
                projection="geoMercator"
                projectionConfig={{ scale: 125, center: [0, 15] }}
                width={800}
                height={390}
                style={{ width: "100%", height: "auto" }}
            >
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => {
                            const pais = paisesAtivos.get(String(geo.id));

                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill={
                                        paisSelecionado?.id === String(geo.id)
                                            ? "#4ADE80"
                                            : pais
                                                ? "#22C55E"
                                                : "#292B34"
                                    }
                                    stroke="#101116"
                                    strokeWidth={0.6}
                                    onMouseEnter={() =>
                                        setPaisSelecionado(pais ?? null)
                                    }
                                    onMouseLeave={() =>
                                        setPaisSelecionado(null)
                                    }
                                    style={{
                                        outline: "none",
                                        transition: "fill 200ms ease",
                                        cursor: pais ? "pointer" : "default",
                                    }}
                                />
                            );
                        })
                    }
                </Geographies>
            </ComposableMap>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <span className="h-3 w-3 rounded-sm bg-[#22C55E]" />
                Países com operações
                <span className="ml-3 h-3 w-3 rounded-sm bg-[#292B34]" />
                Demais países
            </div>
        </div>
    );
}

export default function PanoramaInternacional() {
    const [visao, setVisao] = useState<"origem" | "destino">("origem");
    const [periodo, setPeriodo] = useState<Periodo>("todos");
    const [unidade, setUnidade] = useState("Todas");
    const [modalSelecionado, setModalSelecionado] = useState("Todos");

    const operacoes =
        visao === "origem" ? operacoesOrigem : operacoesDestino;

    const operacoesFiltradas = useMemo(() => {
        const hoje = new Date();
        const inicioAno = new Date(hoje.getFullYear(), 0, 1);

        return operacoes.filter((operacao) => {
            const dataOperacao = new Date(`${operacao.data}T12:00:00`);

            const dataValida =
                periodo === "todos" ||
                (periodo === "ano" && dataOperacao >= inicioAno) ||
                (periodo === "30" &&
                    dataOperacao >= new Date(
                        hoje.getFullYear(),
                        hoje.getMonth(),
                        hoje.getDate() - 30
                    )) ||
                (periodo === "90" &&
                    dataOperacao >= new Date(
                        hoje.getFullYear(),
                        hoje.getMonth(),
                        hoje.getDate() - 90
                    ));

            const unidadeValida =
                unidade === "Todas" || operacao.unidade === unidade;

            const modalValido =
                modalSelecionado === "Todos" ||
                operacao.modal === modalSelecionado;

            return dataValida && unidadeValida && modalValido;
        });
    }, [operacoes, periodo, unidade, modalSelecionado]);

    const total = operacoesFiltradas.length;

    const dados = useMemo(() => {
        const agrupados = new Map<string, Pais>();

        operacoesFiltradas.forEach((operacao) => {
            const atual = agrupados.get(operacao.pais);

            if (atual) {
                atual.quantidade++;
            } else {
                agrupados.set(operacao.pais, {
                    nome: operacao.pais,
                    id: operacao.id,
                    quantidade: 1,
                    percentual: 0,
                });
            }
        });

        return Array.from(agrupados.values())
            .map((pais) => ({
                ...pais,
                percentual:
                    total > 0
                        ? Math.round((pais.quantidade / total) * 100)
                        : 0,
            }))
            .sort((a, b) => b.quantidade - a.quantidade);
    }, [operacoesFiltradas, total]);

    const dadosModal = useMemo(() => {
        const modais: Modal[] = ["Marítimo", "Aéreo", "Rodoviário"];

        return modais.map((modal) => {
            const quantidade = operacoesFiltradas.filter(
                (operacao) => operacao.modal === modal
            ).length;

            return {
                name: modal,
                value:
                    total > 0
                        ? Math.round((quantidade / total) * 100)
                        : 0,
            };
        });
    }, [operacoesFiltradas, total]);

    const dadosGrafico = dados.map((pais) => ({
        name: pais.nome,
        value: pais.quantidade,
    }));

    const principalPais = dados[0];

    const limparFiltros = () => {
        setPeriodo("todos");
        setUnidade("Todas");
        setModalSelecionado("Todos");
    };

    return (
        <div className="min-h-full space-y-6 bg-[#101116] p-5 text-white md:p-7">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <Globe2 className="text-[#22C55E]" size={23} />
                        <h1 className="text-2xl font-bold">
                            Panorama Internacional
                        </h1>
                    </div>
                    <p className="mt-2 text-sm text-gray-400">
                        Visão estratégica das operações internacionais da Caldic.
                    </p>
                </div>

                <span className="w-fit rounded-md border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-400">
                    Dados demonstrativos
                </span>
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setVisao("origem")}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                        visao === "origem"
                            ? "bg-[#22C55E] text-black"
                            : "border border-[#292B34] bg-[#181920] text-gray-400 hover:text-white"
                    }`}
                >
                    <ArrowDownToLine size={17} />
                    Origens de Importação
                </button>

                <button
                    onClick={() => setVisao("destino")}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                        visao === "destino"
                            ? "bg-[#22C55E] text-black"
                            : "border border-[#292B34] bg-[#181920] text-gray-400 hover:text-white"
                    }`}
                >
                    <ArrowUpFromLine size={17} />
                    Destinos de Exportação
                </button>
            </div>

            {/* FILTROS */}
            <section className="rounded-xl border border-[#292B34] bg-[#181920] p-4">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Filter size={17} className="text-[#22C55E]" />
                        <h2 className="text-sm font-semibold">
                            Filtros do panorama
                        </h2>
                    </div>

                    <button
                        onClick={limparFiltros}
                        className="text-xs text-[#22C55E] transition hover:text-green-300"
                    >
                        Limpar filtros
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <label className="space-y-2">
                        <span className="flex items-center gap-2 text-xs text-gray-400">
                            <CalendarDays size={15} />
                            Período
                        </span>
                        <select
                            value={periodo}
                            onChange={(e) =>
                                setPeriodo(e.target.value as Periodo)
                            }
                            className="w-full rounded-lg border border-[#292B34] bg-[#20212A] px-3 py-2.5 text-sm text-white outline-none focus:border-[#22C55E]"
                        >
                            <option value="todos">Todo o período</option>
                            <option value="30">Últimos 30 dias</option>
                            <option value="90">Últimos 90 dias</option>
                            <option value="ano">Este ano</option>
                        </select>
                    </label>

                    <label className="space-y-2">
                        <span className="flex items-center gap-2 text-xs text-gray-400">
                            <Building2 size={15} />
                            Unidade
                        </span>
                        <select
                            value={unidade}
                            onChange={(e) => setUnidade(e.target.value)}
                            className="w-full rounded-lg border border-[#292B34] bg-[#20212A] px-3 py-2.5 text-sm text-white outline-none focus:border-[#22C55E]"
                        >
                            <option value="Todas">Todas as unidades</option>
                            <option value="Santa Catarina">Santa Catarina</option>
                            <option value="Guarulhos">Guarulhos</option>
                        </select>
                    </label>

                    <label className="space-y-2">
                        <span className="flex items-center gap-2 text-xs text-gray-400">
                            <Truck size={15} />
                            Modal de transporte
                        </span>
                        <select
                            value={modalSelecionado}
                            onChange={(e) =>
                                setModalSelecionado(e.target.value)
                            }
                            className="w-full rounded-lg border border-[#292B34] bg-[#20212A] px-3 py-2.5 text-sm text-white outline-none focus:border-[#22C55E]"
                        >
                            <option value="Todos">Todos os modais</option>
                            <option value="Marítimo">Marítimo</option>
                            <option value="Aéreo">Aéreo</option>
                            <option value="Rodoviário">Rodoviário</option>
                        </select>
                    </label>
                </div>
            </section>

            {/* INDICADORES */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Indicador
                    titulo="Total de operações"
                    valor={total.toLocaleString("pt-BR")}
                    descricao="Operações no filtro selecionado"
                    icon={Package}
                />

                <Indicador
                    titulo="Países envolvidos"
                    valor={String(dados.filter((p) => p.id !== "0").length)}
                    descricao="Países com operações"
                    icon={Globe2}
                />

                <Indicador
                    titulo="Principal país"
                    valor={principalPais?.nome ?? "-"}
                    descricao={
                        principalPais
                            ? `${principalPais.percentual}% das operações`
                            : "Sem operações no período"
                    }
                    icon={ArrowDownToLine}
                />

                <Indicador
                    titulo="Modal predominante"
                    valor={
                        total > 0
                            ? [...dadosModal].sort(
                                (a, b) => b.value - a.value
                            )[0].name
                            : "-"
                    }
                    descricao={
                        total > 0
                            ? `${Math.max(...dadosModal.map((m) => m.value))}% das operações`
                            : "Sem operações no período"
                    }
                    icon={Ship}
                />
            </div>

            {/* MAPA E RANKING */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                <section className="rounded-xl border border-[#292B34] bg-[#181920] p-5 xl:col-span-2">
                    <div className="mb-3">
                        <h2 className="font-semibold text-white">
                            {visao === "origem"
                                ? "Mapa de origem das importações"
                                : "Mapa de destino das exportações"}
                        </h2>
                        <p className="mt-1 text-xs text-gray-500">
                            Distribuição geográfica das operações internacionais
                        </p>
                    </div>

                    <MapaMundi dados={dados} />
                </section>

                <section className="rounded-xl border border-[#292B34] bg-[#181920] p-5">
                    <h2 className="font-semibold">Ranking de países</h2>
                    <p className="mt-1 text-xs text-gray-500">
                        Participação nas operações
                    </p>

                    <div className="mt-5 space-y-5">
                        {dados.length > 0 ? (
                            dados.map((pais, index) => (
                                <div key={pais.nome}>
                                    <div className="mb-2 flex justify-between gap-2 text-sm">
                                        <span className="text-gray-300">
                                            {index + 1}. {pais.nome}
                                        </span>
                                        <span className="font-medium text-white">
                                            {pais.percentual}%
                                        </span>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-[#292B34]">
                                        <div
                                            className="h-full rounded-full bg-[#22C55E]"
                                            style={{
                                                width: `${pais.percentual}%`,
                                            }}
                                        />
                                    </div>

                                    <p className="mt-1 text-xs text-gray-500">
                                        {pais.quantidade} operações
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="py-8 text-center text-sm text-gray-500">
                                Nenhuma operação encontrada.
                            </p>
                        )}
                    </div>
                </section>
            </div>

            {/* GRÁFICOS */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <section>
                    <h2 className="mb-3 font-semibold">
                        Distribuição por país
                    </h2>
                    <PieChart data={dadosGrafico} height={330} />
                </section>

                <section>
                    <h2 className="mb-3 font-semibold">
                        Distribuição por modal
                    </h2>

                    <div className="rounded-xl border border-[#292B34] bg-[#181920] p-5">
                        <div className="mb-5 flex items-center justify-between">
                            <span className="text-sm text-gray-400">
                                Participação por transporte
                            </span>
                            <Package size={19} className="text-[#22C55E]" />
                        </div>

                        <div className="space-y-6">
                            {dadosModal.map((modal) => {
                                const Icon =
                                    modal.name === "Aéreo"
                                        ? Plane
                                        : modal.name === "Marítimo"
                                            ? Ship
                                            : Truck;

                                return (
                                    <div key={modal.name}>
                                        <div className="mb-2 flex justify-between">
                                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                                <Icon size={17} />
                                                {modal.name}
                                            </div>
                                            <span className="text-sm font-semibold">
                                                {modal.value}%
                                            </span>
                                        </div>

                                        <div className="h-2 rounded-full bg-[#292B34]">
                                            <div
                                                className="h-2 rounded-full bg-[#22C55E]"
                                                style={{
                                                    width: `${modal.value}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
