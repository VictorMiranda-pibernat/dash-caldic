
import {
    House,
    Database,
    RefreshCw,
    ChevronDown,
    ClipboardList,
    Ship,
    PackageCheck,
    Anchor,
    FileCheck2,
} from "lucide-react";

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

interface NavbarProps {
    processCount?: number;
    onRefresh?: () => void;
}

type Pagina =
    | "planejamento"
    | "gestao"
    | "embarque"
    | "posEmbarque"
    | "chegadaBrasil"
    | "desembaraco"
    | "transporteNacional"
    | "posProcesso";

export default function Navbar({
    processCount = 0,
    onRefresh,
}: NavbarProps) {
    const [dropdownAberto, setDropdownAberto] =
        useState<Pagina | "etapas89" | null>(null);

    const location = useLocation();
    const navigate = useNavigate();

    const planejamentoAtivo =
        location.pathname.startsWith("/planejamento");

    const gestaoAtiva =
        location.pathname.startsWith("/gestao-pre-embarque");

    const embarqueAtivo =
        location.pathname.startsWith("/embarque-internacional");

    const posEmbarqueAtivo =
        location.pathname.startsWith("/pos-embarque");

    const chegadaBrasilAtiva =
        location.pathname.startsWith("/chegada-brasil");

    const desembaracoAtivo =
        location.pathname.startsWith("/desembaraco");

    const transporteNacionalAtivo =
        location.pathname.startsWith("/transporte-nacional");

    const posProcessoAtivo =
        location.pathname.startsWith("/pos-processo");

    const etapas89Ativas =
        transporteNacionalAtivo || posProcessoAtivo;

    function selecionarUnidade(unidade: string, pagina: Pagina) {
        const rotas: Record<Pagina, string> = {
            planejamento: `/planejamento/${unidade}`,
            gestao: `/gestao-pre-embarque/${unidade}`,
            embarque: `/embarque-internacional/${unidade}`,
            posEmbarque: `/pos-embarque/${unidade}`,
            chegadaBrasil: `/chegada-brasil/${unidade}`,
            desembaraco: `/desembaraco/${unidade}`,
            transporteNacional: `/transporte-nacional/${unidade}`,
            posProcesso: `/pos-processo/${unidade}`,
        };

        navigate(rotas[pagina]);
        setDropdownAberto(null);
    }

    const classeMenu = (ativo: boolean) =>
        `flex items-center gap-1.5 rounded-md px-2 py-2 text-[12px] whitespace-nowrap transition ${
            ativo
                ? "bg-[#343640] font-semibold text-white"
                : "text-gray-400 hover:bg-[#252731] hover:text-white"
        }`;

    function renderDropdown(pagina: Pagina) {
        return (
            <div className="absolute left-0 top-full z-50 mt-2 min-w-[210px] overflow-hidden rounded-md border border-[#292B34] bg-[#181920] py-1 shadow-xl">
                <button
                    type="button"
                    onClick={() => selecionarUnidade("guarulhos", pagina)}
                    className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-[#252731] hover:text-white"
                >
                    Guarulhos
                </button>

                <button
                    type="button"
                    onClick={() =>
                        selecionarUnidade("santa-catarina", pagina)
                    }
                    className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-[#252731] hover:text-white"
                >
                    Santa Catarina
                </button>
            </div>
        );
    }

    function renderBotaoMenu(
        pagina: Pagina,
        titulo: string,
        icone: React.ReactNode,
        ativo: boolean
    ) {
        return (
            <div className="relative">
                <button
                    type="button"
                    onClick={() =>
                        setDropdownAberto(
                            dropdownAberto === pagina ? null : pagina
                        )
                    }
                    className={classeMenu(ativo)}
                >
                    {icone}
                    {titulo}

                    <ChevronDown
                        size={16}
                        className={`transition-transform ${
                            dropdownAberto === pagina ? "rotate-180" : ""
                        }`}
                    />
                </button>

                {dropdownAberto === pagina && renderDropdown(pagina)}
            </div>
        );
    }

    return (
        <header className="flex h-[56px] w-full shrink-0 items-center justify-between gap-2 border-b border-[#292B34] bg-[#101116] px-3">
            <div className="flex h-full min-w-0 items-center gap-1">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) => classeMenu(isActive)}
                >
                    <House size={15} />
                    Home
                </NavLink>

                {renderBotaoMenu(
                    "planejamento",
                    "Planejamento",
                    <Database size={15} />,
                    planejamentoAtivo
                )}

                {renderBotaoMenu(
                    "gestao",
                    "Gestão Pré-embarque",
                    <ClipboardList size={15} />,
                    gestaoAtiva
                )}

                {renderBotaoMenu(
                    "embarque",
                    "Embarque Internacional",
                    <Ship size={15} />,
                    embarqueAtivo
                )}

                {renderBotaoMenu(
                    "posEmbarque",
                    "Pós-Embarque",
                    <PackageCheck size={15} />,
                    posEmbarqueAtivo
                )}

                {renderBotaoMenu(
                    "chegadaBrasil",
                    "Chegada da Carga no Brasil",
                    <Anchor size={15} />,
                    chegadaBrasilAtiva
                )}

                {renderBotaoMenu(
                    "desembaraco",
                    "Desembaraço Aduaneiro",
                    <FileCheck2 size={15} />,
                    desembaracoAtivo
                )}

                {/* Etapas 8 e 9 */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() =>
                            setDropdownAberto(
                                dropdownAberto === "etapas89"
                                    ? null
                                    : "etapas89"
                            )
                        }
                        className={classeMenu(etapas89Ativas)}
                    >
                        +4

                        <ChevronDown
                            size={16}
                            className={`transition-transform ${
                                dropdownAberto === "etapas89"
                                    ? "rotate-180"
                                    : ""
                            }`}
                        />
                    </button>

                    {dropdownAberto === "etapas89" && (
                        <div className="absolute right-0 top-full z-50 mt-2 min-w-[270px] overflow-hidden rounded-md border border-[#292B34] bg-[#181920] py-2 shadow-xl">
                            <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Etapa 8
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    selecionarUnidade(
                                        "guarulhos",
                                        "transporteNacional"
                                    )
                                }
                                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#252731] ${
                                    transporteNacionalAtivo &&
                                    location.pathname.includes("guarulhos")
                                        ? "text-white"
                                        : "text-gray-300"
                                }`}
                            >
                                Transporte Nacional — Guarulhos
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    selecionarUnidade(
                                        "santa-catarina",
                                        "transporteNacional"
                                    )
                                }
                                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#252731] ${
                                    transporteNacionalAtivo &&
                                    location.pathname.includes("santa-catarina")
                                        ? "text-white"
                                        : "text-gray-300"
                                }`}
                            >
                                Transporte Nacional — Santa Catarina
                            </button>

                            <div className="my-2 border-t border-[#292B34]" />

                            <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Etapa 9
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    selecionarUnidade(
                                        "guarulhos",
                                        "posProcesso"
                                    )
                                }
                                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#252731] ${
                                    posProcessoAtivo &&
                                    location.pathname.includes("guarulhos")
                                        ? "text-white"
                                        : "text-gray-300"
                                }`}
                            >
                                Pós-processo / Controle — Guarulhos
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    selecionarUnidade(
                                        "santa-catarina",
                                        "posProcesso"
                                    )
                                }
                                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#252731] ${
                                    posProcessoAtivo &&
                                    location.pathname.includes("santa-catarina")
                                        ? "text-white"
                                        : "text-gray-300"
                                }`}
                            >
                                Pós-processo / Controle — Santa Catarina
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 pl-1">
                <div className="flex items-center gap-1.5 rounded-full border border-[#2e323e] bg-[#181920] px-2 py-1 text-xs text-gray-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />

                    <Database
                        size={15}
                        className="text-gray-400"
                    />

                    <span className="font-medium">
                        {processCount} processos
                    </span>
                </div>

                <button
                    onClick={
                        onRefresh ?? (() => window.location.reload())
                    }
                    title="Atualizar dashboard"
                    className="flex items-center justify-center rounded-md border border-[#2e323e] bg-[#181920] p-2 text-gray-400 hover:bg-[#252731] hover:text-white"
                >
                    <RefreshCw size={15} />
                </button>
            </div>
        </header>
    );
}
