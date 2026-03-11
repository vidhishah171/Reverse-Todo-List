"use client";

import { useMemo } from "react";
import { format, subDays, eachDayOfInterval, startOfWeek } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type Win } from "@/types";

interface Props {
  wins: Win[];
}

function getLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count <= 4) return 3;
  return 4;
}

const LEVEL_COLORS: Record<number, string> = {
  0: "bg-muted",
  1: "bg-violet-200 dark:bg-violet-500/25",
  2: "bg-violet-300 dark:bg-violet-500/45",
  3: "bg-violet-400 dark:bg-violet-500/65",
  4: "bg-violet-500",
};

const WEEKS_TO_SHOW = 13; // ~3 months

export function WinsHeatmap({ wins }: Props) {
  const { weeks, months, countByDate } = useMemo(() => {
    const today = new Date();
    const startDate = subDays(today, WEEKS_TO_SHOW * 7 - 1);

    const countByDate: Record<string, number> = {};
    wins.forEach((w) => {
      countByDate[w.date] = (countByDate[w.date] ?? 0) + 1;
    });

    const allDays = eachDayOfInterval({ start: startDate, end: today });

    // Pad to start from Sunday
    const firstSunday = startOfWeek(allDays[0], { weekStartsOn: 0 });
    const dayBeforeStart = subDays(allDays[0], 1);
    const paddedStart =
      firstSunday < allDays[0]
        ? eachDayOfInterval({ start: firstSunday, end: dayBeforeStart })
        : [];
    const padded = [...paddedStart.map(() => null), ...allDays];

    // Group into weeks
    const weeksArr: (Date | null)[][] = [];
    for (let i = 0; i < padded.length; i += 7) {
      weeksArr.push(padded.slice(i, i + 7));
    }

    // Extract month labels at the first day of each month
    const monthLabels: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    weeksArr.forEach((week, wi) => {
      week.forEach((day) => {
        if (day && day.getMonth() !== lastMonth) {
          lastMonth = day.getMonth();
          monthLabels.push({
            label: format(day, "MMM"),
            weekIndex: wi,
          });
        }
      });
    });

    return { weeks: weeksArr, countByDate, months: monthLabels };
  }, [wins]);

  const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <TooltipProvider delayDuration={100}>
      <div className="overflow-x-auto">
        <div className="inline-flex gap-0.5">
          {/* Day labels */}
          <div className="flex flex-col gap-0.5 mr-1 pr-1">
            <div className="h-4" /> {/* month label spacer */}
            {DAY_LABELS.map((d) => (
              <div
                key={d}
                className="h-3 w-6 text-[9px] text-muted-foreground/50 flex items-center leading-none"
              >
                {d[0]}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {/* Month label */}
              <div className="h-4 text-[9px] text-muted-foreground/60 leading-none flex items-center">
                {months.find((m) => m.weekIndex === wi)?.label ?? ""}
              </div>
              {/* Days */}
              {week.map((day, di) => {
                if (!day) return <div key={di} className="w-3 h-3" />;
                const dateStr = format(day, "yyyy-MM-dd");
                const count = countByDate[dateStr] ?? 0;
                const level = getLevel(count);
                const isToday = dateStr === format(new Date(), "yyyy-MM-dd");

                return (
                  <Tooltip key={di}>
                    <TooltipTrigger asChild>
                      <div
                        className={`w-3 h-3 rounded-sm cursor-default transition-colors ${LEVEL_COLORS[level]
                          } ${isToday ? "ring-1 ring-violet-400/50" : ""}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">
                        {count} {count === 1 ? "win" : "wins"}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {format(day, "EEE, MMM d yyyy")}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 mt-3 justify-end">
          <span className="text-[10px] text-muted-foreground/60 mr-1">Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm ${LEVEL_COLORS[level]}`}
            />
          ))}
          <span className="text-[10px] text-muted-foreground/60 ml-1">More</span>
        </div>
      </div>
    </TooltipProvider>
  );
}
