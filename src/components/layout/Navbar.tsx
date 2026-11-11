
import {
    House, Database, RefreshCw, ChevronDown, ClipboardList,
    Ship, PackageCheck, Anchor, FileCheck2, Globe, Truck, ClipboardCheck,
} from "lucide-react";

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { ReactNode, MouseEvent } from "react";
import { createPortal } from "react-dom";

interface NavbarProps {
    processCount?: number;
    onRefresh?: () => void;
}

type Pagina =
    | "planejamento" | "gestao" | "embarque" | "posEmbarque"
    | "chegadaBrasil" | "desembaraco" | "transporteNacional" | "posProcesso";

const rotas: Record<Pagina, string> = {
    planejamento: "/planejamento",
    gestao: "/gestao-pre-embarque",
    embarque: "/embarque-internacional",
    posEmbarque: "/pos-embarque",
    chegadaBrasil: "/chegada-brasil",
    desembaraco: "/desembaraco",
    transporteNacional: "/transporte-nacional",
    posProcesso: "/pos-processo",
};

const unidades = [
    { nome: "Guarulhos", valor: "guarulhos" },
    { nome: "Santa Catarina", valor: "santa-catarina" },
];

export default function Navbar({
    processCount = 0,
    onRefresh,
}: NavbarProps) {
    const location = useLocation();
    const navigate = useNavigate();

    const [dropdownAberto, setDropdownAberto] = useState<Pagina | null>(null);
    const [posicao, setPosicao] = useState({ top: 0, left: 0 });

    const classeMenu = (ativo: boolean) =>
        `flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-2 text-[12px] whitespace-nowrap transition ${
            ativo
                ? "bg-[#343640] font-semibold text-white"
                : "text-gray-400 hover:bg-[#252731] hover:text-white"
        }`;

    function alternarDropdown(
        pagina: Pagina,
        event: MouseEvent<HTMLButtonElement>
    ) {
        if (dropdownAberto === pagina) {
            setDropdownAberto(null);
            return;
        }

        const rect = event.currentTarget.getBoundingClientRect();

        setPosicao({
            top: rect.bottom + 8,
            left: Math.max(8, Math.min(rect.left, window.innerWidth - 218)),
        });

        setDropdownAberto(pagina);
    }

    function selecionarUnidade(pagina: Pagina, unidade: string) {
        navigate(`${rotas[pagina]}/${unidade}`);
        setDropdownAberto(null);
    }

    function renderDropdown(pagina: Pagina) {
        return createPortal(
            <div
                style={{
                    position: "fixed",
                    top: posicao.top,
                    left: posicao.left,
                    zIndex: 9999,
                }}
                className="min-w-[210px] overflow-hidden rounded-md border border-[#292B34] bg-[#181920] py-1 shadow-2xl"
            >
                {unidades.map((unidade) => (
                    <button
                        key={unidade.valor}
                        type="button"
                        onClick={() => selecionarUnidade(pagina, unidade.valor)}
                        className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-[#252731] hover:text-white"
                    >
                        {unidade.nome}
                    </button>
                ))}
            </div>,
            document.body
        );
    }

    const menus: {
        pagina: Pagina;
        titulo: string;
        icone: ReactNode;
    }[] = [
        { pagina: "planejamento", titulo: "Planejamento", icone: <Database size={15} /> },
        { pagina: "gestao", titulo: "Gestão Pré-embarque", icone: <ClipboardList size={15} /> },
        { pagina: "embarque", titulo: "Embarque Internacional", icone: <Ship size={15} /> },
        { pagina: "posEmbarque", titulo: "Pós-Embarque", icone: <PackageCheck size={15} /> },
        { pagina: "chegadaBrasil", titulo: "Chegada da Carga no Brasil", icone: <Anchor size={15} /> },
        { pagina: "desembaraco", titulo: "Desembaraço Aduaneiro", icone: <FileCheck2 size={15} /> },
        { pagina: "transporteNacional", titulo: "Transporte Nacional", icone: <Truck size={15} /> },
        { pagina: "posProcesso", titulo: "Pós-processo / Controle", icone: <ClipboardCheck size={15} /> },
    ];

    return (
        <header className="relative z-40 flex h-16 w-full shrink-0 items-center gap-2 border-b border-[#292B34] bg-[#101116] px-3">

            {/* NAVEGAÇÃO COM SCROLL */}
            <div className="navbar-scroll flex h-full min-w-0 flex-1 items-center gap-1 overflow-x-auto overflow-y-hidden">

                <NavLink
                    to="/"
                    end
                    onClick={() => setDropdownAberto(null)}
                    className={({ isActive }) => classeMenu(isActive)}
                >
                    <House size={15} /> Home
                </NavLink>


                {menus.map(({ pagina, titulo, icone }) => {
                    const ativo = location.pathname.startsWith(rotas[pagina]);

                    return (
                        <div key={pagina} className="shrink-0">
                            <button
                                type="button"
                                onClick={(event) => alternarDropdown(pagina, event)}
                                className={classeMenu(ativo)}
                            >
                                {icone}
                                {titulo}
                                <ChevronDown
                                    size={15}
                                    className={`shrink-0 transition-transform ${
                                        dropdownAberto === pagina ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {dropdownAberto === pagina && renderDropdown(pagina)}
                        </div>
                    );
                })}

                
                <NavLink
                    to="/panorama-internacional"
                    onClick={() => setDropdownAberto(null)}
                    className={() => classeMenu(
                        location.pathname.startsWith("/panorama-internacional")
                    )}
                >
                    <Globe size={15} /> Panorama Internacional
                </NavLink>
            </div>

            {/* INDICADORES FIXOS */}
            <div className="ml-auto flex shrink-0 items-center gap-2 pl-2">
                <div className="flex items-center gap-1.5 rounded-full border border-[#2e323e] bg-[#181920] px-2 py-1 text-xs text-gray-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <Database size={15} className="text-gray-400" />
                    <span className="whitespace-nowrap font-medium">
                        {processCount} processos
                    </span>
                </div>

                <button
                    type="button"
                    onClick={onRefresh ?? (() => window.location.reload())}
                    title="Atualizar dashboard"
                    className="flex shrink-0 items-center justify-center rounded-md border border-[#2e323e] bg-[#181920] p-2 text-gray-400 hover:bg-[#252731] hover:text-white"
                >
                    <RefreshCw size={15} />
                </button>
            </div>
        </header>
    );
}
