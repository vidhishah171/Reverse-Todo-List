"use client";

import { motion } from "framer-motion";
import { Flame, Trophy, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getStreakEmoji } from "@/lib/utils";
import { type Streak } from "@/types";

interface StreakCardProps {
  streak: Streak | null;
}

export function StreakCard({ streak }: StreakCardProps) {
  const current = streak?.current_streak ?? 0;
  const longest = streak?.longest_streak ?? 0;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Flame className="w-4 h-4 text-orange-400" />
            </div>
            <span className="text-sm font-medium text-foreground">Streak</span>
          </div>
          <span className="text-2xl">{getStreakEmoji(current)}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-2.5 border border-border">
            <motion.p
              key={current}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-bold text-foreground tabular-nums"
            >
              {current}
            </motion.p>
            <div className="flex items-center gap-1 mt-1">
              <Flame className="w-3 h-3 text-orange-400" />
              <p className="text-sm text-muted-foreground">Current streak</p>
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-2.5 border border-border">
            <p className="text-2xl font-bold text-foreground tabular-nums">{longest}</p>
            <div className="flex items-center gap-1 mt-1">
              <Trophy className="w-3 h-3 text-yellow-400" />
              <p className="text-sm text-muted-foreground">Best streak</p>
            </div>
          </div>
        </div>

        {streak?.last_logged_date && (
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground/60" />
            <p className="text-sm text-muted-foreground">
              Last active:{" "}
              <span className="text-foreground/70">
                {new Date(streak.last_logged_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
