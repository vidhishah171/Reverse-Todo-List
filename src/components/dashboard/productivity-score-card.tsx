import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { type Win, type WinDifficulty } from "@/types";

interface ProductivityScoreCardProps {
  wins: Win[];
}

const WEIGHTS: Record<WinDifficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
  epic: 5,
};

const DIFFICULTY_COLORS: Record<WinDifficulty, string> = {
  easy: "bg-emerald-500",
  medium: "bg-amber-500",
  hard: "bg-red-500",
  epic: "bg-violet-500",
};

export function ProductivityScoreCard({ wins }: ProductivityScoreCardProps) {
  const score = wins.reduce((acc, w) => {
    return acc + (w.difficulty ? WEIGHTS[w.difficulty] : 1);
  }, 0);

  const byCounts: Partial<Record<WinDifficulty, number>> = {};
  wins.forEach((w) => {
    if (w.difficulty) {
      byCounts[w.difficulty] = (byCounts[w.difficulty] ?? 0) + 1;
    }
  });

  const maxScore = wins.length * 5;
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  const difficulties: WinDifficulty[] = ["easy", "medium", "hard", "epic"];

  return (
    <Card>
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Productivity Score
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4 space-y-2">
        <div className="flex items-end gap-2">
          <p className="text-3xl font-bold text-foreground tabular-nums">
            <AnimatedNumber value={score} />
          </p>
          <p className="text-sm text-muted-foreground mb-1">pts today</p>
          <p className="ml-auto text-sm font-medium text-violet-400 mb-1">{pct}%</p>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Breakdown */}
        {difficulties.some((d) => byCounts[d]) && (
          <div className="flex gap-3 pt-1">
            {difficulties.map((d) =>
              byCounts[d] ? (
                <div key={d} className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${DIFFICULTY_COLORS[d]}`} />
                  <span className="text-sm text-muted-foreground capitalize">{d}</span>
                  <span className="text-sm font-medium text-foreground">{byCounts[d]}</span>
                </div>
              ) : null,
            )}
          </div>
        )}

        {score === 0 && (
          <p className="text-sm text-muted-foreground">Add accomplishments to earn points. Epic = 5 pts!</p>
        )}
      </CardContent>
    </Card>
  );
}
