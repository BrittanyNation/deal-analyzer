import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WaterfallStep } from "../lib/deal";
import { usd } from "../lib/format";

const COLORS: Record<WaterfallStep["kind"], string> = {
  total: "#2dd4bf",
  deduction: "#f87171",
  result: "#0d9488",
};

interface Props {
  steps: WaterfallStep[];
}

export default function WaterfallChart({ steps }: Props) {
  const data = steps.filter((s) => s.delta > 0);
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "#a1a1aa", fontSize: 11 }}
            axisLine={{ stroke: "#3f3f46" }}
            tickLine={false}
            interval={0}
            angle={-18}
            dy={8}
            height={52}
          />
          <YAxis
            tick={{ fill: "#a1a1aa", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) =>
              v >= 1000 ? `$${Math.round(v / 1000)}k` : `$${v}`
            }
            width={52}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: 8,
              color: "#fafafa",
              fontSize: 13,
            }}
            formatter={(value) => [usd(Number(value)), "Amount"]}
            labelStyle={{ color: "#d4d4d8" }}
          />
          <Bar dataKey="base" stackId="w" fill="transparent" isAnimationActive={false} />
          <Bar dataKey="delta" stackId="w" radius={[4, 4, 0, 0]}>
            {data.map((s) => (
              <Cell key={s.name} fill={COLORS[s.kind]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
