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
import { type Win } from "@/types";

interface WinsByDayOfWeekProps {
  wins: Win[];
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: { day: string } }[];
}) => {
  if (active && payload && payload.length && payload[0]) {
    return (
      <div className="bg-popover border border-border rounded-lg px-3 py-2 text-sm shadow-xl">
        <p className="text-foreground font-semibold">{payload[0].payload.day}</p>
        <p className="text-muted-foreground">
          {payload[0].value} {payload[0].value === 1 ? "win" : "wins"}
        </p>
      </div>
    );
  }
  return null;
};

export function WinsByDayOfWeek({ wins }: WinsByDayOfWeekProps) {
  // 0=Sun, 1=Mon...6=Sat in JS Date
  const countByDay = Array(7).fill(0) as number[];
  wins.forEach((w) => {
    const jsDay = new Date(w.date + "T00:00:00").getDay(); // 0=Sun
    // remap to Mon=0...Sun=6
    const idx = jsDay === 0 ? 6 : jsDay - 1;
    countByDay[idx]++;
  });

  const maxCount = Math.max(...countByDay, 1);
  const bestIdx = countByDay.indexOf(maxCount);

  const data = DAYS.map((day, i) => ({
    day,
    count: countByDay[i],
    isBest: i === bestIdx && countByDay[i] > 0,
  }));

  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 4, right: 0, left: -28, bottom: 0 }}
          barCategoryGap="30%"
        >
          <XAxis
            dataKey="day"
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
              <Cell
                key={i}
                fill={
                  entry.isBest
                    ? "hsl(263, 70%, 60%)"
                    : entry.count > 0
                      ? "hsl(263, 70%, 40%)"
                      : "hsl(var(--muted))"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
