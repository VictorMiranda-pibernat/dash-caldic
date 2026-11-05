
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface BarChartProps {
  data: Record<string, string | number>[];
  dataKey: string;
  xAxisKey: string;
  color?: string;
  height?: number;
}

export function BarChart({
  data,
  dataKey,
  xAxisKey,
  color = "#5486D8",
  height = 300,
}: BarChartProps) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data}>
          <CartesianGrid
            stroke="#292B34"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey={xAxisKey}
            stroke="#777B89"
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="#777B89"
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#20212A",
              border: "1px solid #343640",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Bar dataKey={dataKey} fill={color} radius={[5, 5, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
