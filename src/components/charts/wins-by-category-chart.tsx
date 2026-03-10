"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { type Category, type Win } from "@/types";

interface WinsByCategoryChartProps {
  wins: Win[];
  categories: Category[];
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: { name: string; color: string } }[];
}) => {
  if (active && payload && payload.length && payload[0]) {
    return (
      <div className="bg-popover border border-border rounded-lg px-3 py-2 text-sm shadow-xl">
        <p className="text-foreground font-semibold">{payload[0].payload.name}</p>
        <p className="text-muted-foreground">
          {payload[0].value} {payload[0].value === 1 ? "win" : "wins"}
        </p>
      </div>
    );
  }
  return null;
};

export function WinsByCategoryChart({ wins, categories }: WinsByCategoryChartProps) {
  const countById: Record<string, number> = {};
  wins.forEach((w) => {
    if (w.category_id) {
      countById[w.category_id] = (countById[w.category_id] ?? 0) + 1;
    }
  });

  const uncategorized = wins.filter((w) => !w.category_id).length;

  const data = [
    ...categories
      .filter((c) => countById[c.id])
      .map((c) => ({ name: c.name, count: countById[c.id]!, color: c.color }))
      .sort((a, b) => b.count - a.count),
    ...(uncategorized > 0
      ? [{ name: "Uncategorized", count: uncategorized, color: "hsl(var(--muted-foreground))" }]
      : []),
  ];

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No categorized wins yet. Add categories to your wins to see this chart.
      </p>
    );
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
          barCategoryGap="30%"
        >
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            width={90}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
