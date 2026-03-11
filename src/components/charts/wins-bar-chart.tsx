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

interface DataPoint {
  date: string;
  label: string;
  shortLabel: string;
  count: number;
}

interface Props {
  data: DataPoint[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; payload: DataPoint }[];
  label?: string;
}) => {
  if (active && payload && payload.length && payload[0]) {
    return (
      <div className="bg-popover border border-border rounded-lg px-3 py-2 text-sm shadow-xl">
        <p className="text-muted-foreground text-sm mb-0.5">
          {payload[0].payload.label}
        </p>
        <p className="text-foreground font-semibold">
          {payload[0].value}{" "}
          <span className="text-muted-foreground font-normal">
            {payload[0].value === 1 ? "win" : "wins"}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export function WinsBarChart({ data }: Props) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 4, right: 0, left: -28, bottom: 0 }}
          barCategoryGap="30%"
        >
          <XAxis
            dataKey="shortLabel"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            domain={[0, Math.max(maxCount + 1, 5)]}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.date}
                fill={
                  entry.date === today
                    ? "hsl(263, 70%, 60%)"
                    : entry.count > 0
                      ? "hsl(263, 70%, 40%)"
                      : "hsl(216, 34%, 17%)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
