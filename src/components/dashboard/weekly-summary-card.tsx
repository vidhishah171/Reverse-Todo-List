import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { type Win, type Category } from "@/types";

interface WeeklySummaryCardProps {
  wins: Win[];
  categories: Category[];
}

export function WeeklySummaryCard({ wins, categories }: WeeklySummaryCardProps) {
  const totalWins = wins.length;
  const avgPerDay = +(totalWins / 7).toFixed(1);

  // Best day
  const countByDay: Record<string, number> = {};
  wins.forEach((w) => {
    countByDay[w.date] = (countByDay[w.date] ?? 0) + 1;
  });
  const bestEntry = Object.entries(countByDay).sort((a, b) => b[1] - a[1])[0];
  const bestDay = bestEntry
    ? new Date(bestEntry[0] + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" })
    : null;
  const bestDayCount = bestEntry ? bestEntry[1] : 0;

  // Top category
  const catCounts: Record<string, number> = {};
  wins.forEach((w) => {
    if (w.category_id) catCounts[w.category_id] = (catCounts[w.category_id] ?? 0) + 1;
  });
  const topCatEntry = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0];
  const topCategory = topCatEntry ? categories.find((c) => c.id === topCatEntry[0]) : null;

  const stats = [
    { label: "Total wins", value: totalWins, suffix: "" },
    { label: "Avg / day", value: avgPerDay, suffix: "" },
    { label: "Best day", value: bestDayCount, prefix: bestDay ?? "—", isDay: true },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Summary</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-foreground tabular-nums">
                {s.isDay ? (
                  <>
                    <span className="text-lg">{s.prefix}</span>
                    {bestDayCount > 0 && (
                      <span className="text-sm text-muted-foreground ml-1">
                        (<AnimatedNumber value={s.value} />)
                      </span>
                    )}
                  </>
                ) : (
                  <AnimatedNumber value={s.value} />
                )}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        {topCategory && (
          <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Top category:</span>
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-medium"
              style={{
                backgroundColor: `${topCategory.color}22`,
                color: topCategory.color,
                border: `1px solid ${topCategory.color}44`,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: topCategory.color }} />
              {topCategory.name}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
