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
import { type Win, type WinDifficulty } from "@/types";

interface DifficultyDistributionChartProps {
  wins: Win[];
}

const DIFFICULTY_CONFIG: Record<WinDifficulty, { label: string; color: string }> = {
  easy: { label: "Easy", color: "#10b981" },
  medium: { label: "Medium", color: "#f59e0b" },
  hard: { label: "Hard", color: "#ef4444" },
  epic: { label: "Epic", color: "#8b5cf6" },
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: { label: string } }[];
}) => {
  if (active && payload && payload.length && payload[0]) {
    return (
      <div className="bg-popover border border-border rounded-lg px-3 py-2 text-sm shadow-xl">
        <p className="text-foreground font-semibold">{payload[0].payload.label}</p>
        <p className="text-muted-foreground">
          {payload[0].value} {payload[0].value === 1 ? "win" : "wins"}
        </p>
      </div>
    );
  }
  return null;
};

export function DifficultyDistributionChart({ wins }: DifficultyDistributionChartProps) {
  const difficulties: WinDifficulty[] = ["easy", "medium", "hard", "epic"];

  const data = difficulties.map((d) => ({
    label: DIFFICULTY_CONFIG[d].label,
    count: wins.filter((w) => w.difficulty === d).length,
    color: DIFFICULTY_CONFIG[d].color,
  }));

  const total = data.reduce((s, d) => s + d.count, 0);

  if (total === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No wins with difficulty set yet. Set difficulty when logging wins to see this chart.
      </p>
    );
  }

  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 4, right: 0, left: -28, bottom: 0 }}
          barCategoryGap="30%"
        >
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
