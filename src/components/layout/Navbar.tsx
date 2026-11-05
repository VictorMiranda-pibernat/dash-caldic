
import { House, Database, RefreshCw, ChevronDown } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

interface NavbarProps {
  processCount?: number;
  onRefresh?: () => void;
}

export default function Navbar({
  processCount = 0,
  onRefresh,
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const planejamentoAtivo = location.pathname.startsWith("/planejamento");

  function selecionarUnidade(unidade: string) {
    navigate(`/planejamento/${unidade}`);
    setDropdownOpen(false);
  }

  return (
    <header className="flex h-[72px] w-full shrink-0 items-center justify-between border-b border-[#292B34] bg-[#101116] px-8">
      <div className="flex h-full items-center gap-3">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-md px-4 py-3 text-base whitespace-nowrap transition ${
              isActive
                ? "bg-[#343640] font-semibold text-white"
                : "text-gray-400 hover:bg-[#252731] hover:text-white"
            }`
          }
        >
          <House size={18} />
          Home
        </NavLink>

        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center gap-3 rounded-md px-4 py-3 text-base whitespace-nowrap transition ${
              planejamentoAtivo
                ? "bg-[#343640] font-semibold text-white"
                : "text-gray-400 hover:bg-[#252731] hover:text-white"
            }`}
          >
            <Database size={18} />
            Planejamento
            <ChevronDown
              size={16}
              className={`transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 top-full z-50 mt-2 min-w-[210px] overflow-hidden rounded-md border border-[#292B34] bg-[#181920] py-1 shadow-xl">
              <button
                type="button"
                onClick={() => selecionarUnidade("guarulhos")}
                className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-[#252731] hover:text-white"
              >
                Guarulhos
              </button>

              <button
                type="button"
                onClick={() => selecionarUnidade("santa-catarina")}
                className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-[#252731] hover:text-white"
              >
                Santa Catarina
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4 pl-4">
        <div className="flex items-center gap-2 rounded-full border border-[#2e323e] bg-[#181920] px-4 py-2 text-sm text-gray-300">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <Database size={16} className="text-gray-400" />
          <span className="font-medium">{processCount} processos</span>
        </div>

        <button
          onClick={onRefresh ?? (() => window.location.reload())}
          title="Atualizar dashboard"
          className="flex items-center justify-center rounded-md border border-[#2e323e] bg-[#181920] p-2 text-gray-400 hover:bg-[#252731] hover:text-white"
        >
          <RefreshCw size={17} />
        </button>
      </div>
    </header>
  );
}
