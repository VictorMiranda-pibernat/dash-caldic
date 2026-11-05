
import { Search, FilterX } from "lucide-react";

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: {
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  }[];
  onClear?: () => void;
}

export default function FilterBar({
  searchValue,
  onSearchChange,
  filters = [],
  onClear,
}: FilterBarProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3 rounded-lg border border-[#292B34] bg-[#181920] p-4">
      <div className="relative min-w-[220px] flex-1">
        <Search
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />

        <input
          type="text"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Pesquisar atividade..."
          className="w-full rounded-md border border-[#343640] bg-[#101116] py-2.5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
        />
      </div>

      {filters.map((filter) => (
        <select
          key={filter.label}
          value={filter.value}
          onChange={(event) => filter.onChange(event.target.value)}
          className="min-w-[150px] rounded-md border border-[#343640] bg-[#101116] px-3 py-2.5 text-sm text-gray-300 outline-none focus:border-blue-500"
        >
          <option value="">Todos — {filter.label}</option>

          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}

      {onClear && (
        <button
          type="button"
          onClick={onClear}
          title="Limpar filtros"
          className="flex items-center gap-2 rounded-md border border-[#343640] px-3 py-2.5 text-sm text-gray-400 transition hover:bg-[#252731] hover:text-white"
        >
          <FilterX size={16} />
          Limpar
        </button>
      )}
    </div>
  );
}
