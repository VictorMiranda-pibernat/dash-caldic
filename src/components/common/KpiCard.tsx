
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  accentColor?: string;
}

export default function KpiCard({
  title,
  value,
  description,
  icon: Icon,
  accentColor = "#5486D8",
}: KpiCardProps) {
  return (
    <div className="rounded-lg border border-[#292B34] bg-[#181920] p-5 transition hover:border-[#414450]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-400">
            {title}
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>

          {description && (
            <p className="mt-2 text-xs text-gray-500">
              {description}
            </p>
          )}
        </div>

        {Icon && (
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{
              backgroundColor: `${accentColor}20`,
              color: accentColor,
            }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
