
import {
    House,
    Database,
    RefreshCw,
    ChevronDown,
    ClipboardList,
    Ship,
    PackageCheck,
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
    | "posEmbarque";

export default function Navbar({
    processCount = 0,
    onRefresh,
}: NavbarProps) {
    const [dropdownAberto, setDropdownAberto] =
        useState<Pagina | null>(null);

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

    function selecionarUnidade(unidade: string, pagina: Pagina) {
        const rotas: Record<Pagina, string> = {
            planejamento: `/planejamento/${unidade}`,
            gestao: `/gestao-pre-embarque/${unidade}`,
            embarque: `/embarque-internacional/${unidade}`,
            posEmbarque: `/pos-embarque/${unidade}`,
        };

        navigate(rotas[pagina]);
        setDropdownAberto(null);
    }

    const classeMenu = (ativo: boolean) =>
        `flex items-center gap-3 rounded-md px-4 py-3 text-base whitespace-nowrap transition ${
            ativo
                ? "bg-[#343640] font-semibold text-white"
                : "text-gray-400 hover:bg-[#252731] hover:text-white"
        }`;

    function renderDropdown(pagina: Pagina) {
        return (
            <div className="absolute left-0 top-full z-50 mt-2 min-w-[210px] overflow-hidden rounded-md border border-[#292B34] bg-[#181920] py-1 shadow-xl">
                <button
                    type="button"
                    onClick={() =>
                        selecionarUnidade("guarulhos", pagina)
                    }
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

                {dropdownAberto === pagina &&
                    renderDropdown(pagina)}
            </div>
        );
    }

    return (
        <header className="flex h-[72px] w-full shrink-0 items-center justify-between border-b border-[#292B34] bg-[#101116] px-8">
            <div className="flex h-full items-center gap-3">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) => classeMenu(isActive)}
                >
                    <House size={18} />
                    Home
                </NavLink>

                {renderBotaoMenu(
                    "planejamento",
                    "Planejamento",
                    <Database size={18} />,
                    planejamentoAtivo
                )}

                {renderBotaoMenu(
                    "gestao",
                    "Gestão Pré-embarque",
                    <ClipboardList size={18} />,
                    gestaoAtiva
                )}

                {renderBotaoMenu(
                    "embarque",
                    "Embarque Internacional",
                    <Ship size={18} />,
                    embarqueAtivo
                )}

                {renderBotaoMenu(
                    "posEmbarque",
                    "Pós-Embarque",
                    <PackageCheck size={18} />,
                    posEmbarqueAtivo
                )}
            </div>

            <div className="flex shrink-0 items-center gap-4 pl-4">
                <div className="flex items-center gap-2 rounded-full border border-[#2e323e] bg-[#181920] px-4 py-2 text-sm text-gray-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <Database size={16} className="text-gray-400" />
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
                    <RefreshCw size={17} />
                </button>
            </div>
        </header>
    );
}
