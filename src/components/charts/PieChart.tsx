
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface PieChartProps {
  data: {
    name: string;
    value: number;
  }[];
  colors?: string[];
  height?: number;
}

const defaultColors = [
  "#22C55E",
  "#5486D8",
  "#EAB308",
  "#EF4444",
  "#737783",
];

export function PieChart({
  data,
  colors = defaultColors,
  height = 300,
}: PieChartProps) {
  return (
    <div
      className="w-full rounded-lg border border-[#292B34] bg-[#181920] p-5"
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius="75%"
            innerRadius="48%"
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell
                key={`${entry.name}-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              backgroundColor: "#20212A",
              border: "1px solid #343640",
              borderRadius: "8px",
              color: "#fff",
            }}
          />

          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{
              fontSize: "12px",
              color: "#9CA3AF",
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
