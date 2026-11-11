
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
} from "lucide-react";

import { PieChart } from "../charts/PieChart";

type Pais = {
    nome: string;
    id: string;
    quantidade: number;
    percentual: number;
};

const dadosOrigem: Pais[] = [
    { nome: "China", id: "156", quantidade: 128, percentual: 32 },
    { nome: "Estados Unidos", id: "840", quantidade: 86, percentual: 21 },
    { nome: "Alemanha", id: "276", quantidade: 64, percentual: 16 },
    { nome: "Índia", id: "356", quantidade: 48, percentual: 12 },
    { nome: "Itália", id: "380", quantidade: 38, percentual: 9 },
    { nome: "Outros", id: "0", quantidade: 40, percentual: 10 },
];

const dadosDestino: Pais[] = [
    { nome: "Brasil", id: "076", quantidade: 112, percentual: 28 },
    { nome: "Argentina", id: "032", quantidade: 82, percentual: 20 },
    { nome: "Chile", id: "152", quantidade: 70, percentual: 17 },
    { nome: "México", id: "484", quantidade: 58, percentual: 14 },
    { nome: "Estados Unidos", id: "840", quantidade: 48, percentual: 12 },
    { nome: "Outros", id: "0", quantidade: 36, percentual: 9 },
];

const dadosModal = [
    { name: "Marítimo", value: 58 },
    { name: "Aéreo", value: 29 },
    { name: "Rodoviário", value: 13 },
];

const geoUrl =
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

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
    const paisesAtivos = useMemo(
        () => new Map(dados.filter((p) => p.id !== "0").map((p) => [p.id, p])),
        [dados]
    );

    return (
        <div className="w-full overflow-hidden">
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
                                    fill={pais ? "#22C55E" : "#292B34"}
                                    stroke="#101116"
                                    strokeWidth={0.6}
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

    const dados = visao === "origem" ? dadosOrigem : dadosDestino;

    const total = dados.reduce((soma, pais) => soma + pais.quantidade, 0);

    const dadosGrafico = dados
        .filter((pais) => pais.id !== "0")
        .map((pais) => ({
            name: pais.nome,
            value: pais.quantidade,
        }));

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
                    className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${visao === "origem"
                            ? "bg-[#22C55E] text-black"
                            : "border border-[#292B34] bg-[#181920] text-gray-400 hover:text-white"
                        }`}
                >
                    <ArrowDownToLine size={17} />
                    Origens de Importação
                </button>

                <button
                    onClick={() => setVisao("destino")}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${visao === "destino"
                            ? "bg-[#22C55E] text-black"
                            : "border border-[#292B34] bg-[#181920] text-gray-400 hover:text-white"
                        }`}
                >
                    <ArrowUpFromLine size={17} />
                    Destinos de Exportação
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Indicador
                    titulo="Total de operações"
                    valor={total.toLocaleString("pt-BR")}
                    descricao="Operações demonstrativas"
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
                    valor={dados[0].nome}
                    descricao={`${dados[0].percentual}% das operações`}
                    icon={ArrowDownToLine}
                />
                <Indicador
                    titulo="Modal predominante"
                    valor="Marítimo"
                    descricao="58% das operações"
                    icon={Ship}
                />
            </div>

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
                    <h2 className="font-semibold">
                        Ranking de países
                    </h2>
                    <p className="mt-1 text-xs text-gray-500">
                        Participação nas operações
                    </p>

                    <div className="mt-5 space-y-5">
                        {dados.map((pais, index) => (
                            <div key={pais.nome}>
                                <div className="mb-2 flex justify-between text-sm">
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
                                        style={{ width: `${pais.percentual}%` }}
                                    />
                                </div>

                                <p className="mt-1 text-xs text-gray-500">
                                    {pais.quantidade} operações
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

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
