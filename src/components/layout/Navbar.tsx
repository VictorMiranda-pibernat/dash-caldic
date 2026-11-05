
import { House, Database, RefreshCw } from "lucide-react";
import { NavLink } from "react-router-dom";

interface NavbarProps {
  processCount?: number;
  onRefresh?: () => void;
}

export default function Navbar({
  processCount = 0,
  onRefresh,
}: NavbarProps) {
  return (
    <header className="flex h-[72px] w-full shrink-0 items-center justify-between border-b border-[#292B34] bg-[#101116] px-8">

      {/* Navegação */}
      <div className="flex h-full items-center gap-3 overflow-x-auto scrollbar-hide">
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
      </div>

      {/* Indicador de processos */}
      <div className="flex shrink-0 items-center gap-4 pl-4">
        <div className="flex items-center gap-2 rounded-full border border-[#2e323e] bg-[#181920] px-4 py-2 text-sm text-gray-300">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />

          <Database size={16} className="text-gray-400" />

          <span className="font-medium">
            {processCount} processos
          </span>
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
