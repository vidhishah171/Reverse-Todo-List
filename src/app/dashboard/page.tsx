"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Trophy, Smile } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { QuickAddWin } from "@/components/wins/quick-add-win";
import { SortableWinList } from "@/components/wins/sortable-win-list";
import { StreakCard } from "@/components/dashboard/streak-card";
import { ReminderBanner } from "@/components/dashboard/reminder-banner";
import { ProductivityScoreCard } from "@/components/dashboard/productivity-score-card";
import { GoalTracker } from "@/components/dashboard/goal-tracker";
import { AchievementBadges, useAchievements, AchievementToast, ACHIEVEMENTS } from "@/components/dashboard/achievement-badges";
import { ChallengesCard } from "@/components/dashboard/challenges-card";
import { LeaderboardCard } from "@/components/dashboard/leaderboard-card";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMotivationMessage } from "@/lib/utils";
import { fireConfetti, fireStreakConfetti } from "@/hooks/use-confetti";
import { type Win, type Streak, type Category } from "@/types";
import { format, subDays } from "date-fns";

interface WeekDay {
  date: string;
  label: string;
  count: number;
  isToday: boolean;
}

export default function DashboardPage() {
  const [todayWins, setTodayWins] = useState<Win[]>([]);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [weekDays, setWeekDays] = useState<WeekDay[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const prevWinCount = useRef(0);
  const { achievements, newlyUnlocked, unlock, refetch: refetchAchievements } = useAchievements();

  const today = format(new Date(), "yyyy-MM-dd");
  const dayOfWeek = format(new Date(), "EEEE");

  const fetchData = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const weekStart = format(subDays(new Date(), 6), "yyyy-MM-dd");

    const [winsRes, streakRes, weekWinsRes, catsRes] = await Promise.all([
      supabase
        .from("wins")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today)
        .order("created_at", { ascending: false }),
      supabase.from("streaks").select("*").eq("user_id", user.id).single(),
      supabase
        .from("wins")
        .select("*, category:categories(*)")
        .eq("user_id", user.id)
        .gte("date", weekStart)
        .lte("date", today),
      supabase.from("categories").select("*").eq("user_id", user.id),
    ]);

    const allWeekWins = weekWinsRes.data ?? [];
    const newTodayWins = winsRes.data ?? [];
    setTodayWins(newTodayWins);
    setStreak(streakRes.data ?? null);
    setCategories(catsRes.data ?? []);

    // Build week grid
    const countByDate: Record<string, number> = {};
    allWeekWins.forEach((w: { date: string }) => {
      countByDate[w.date] = (countByDate[w.date] ?? 0) + 1;
    });

    const days: WeekDay[] = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      const dateStr = format(d, "yyyy-MM-dd");
      return {
        date: dateStr,
        label: format(d, "EEE"),
        count: countByDate[dateStr] ?? 0,
        isToday: dateStr === today,
      };
    });

    setWeekDays(days);
    setLoading(false);

    // Fire confetti when a new win is added
    if (prevWinCount.current > 0 && newTodayWins.length > prevWinCount.current) {
      fireConfetti();
    }
    prevWinCount.current = newTodayWins.length;

    // Fire streak milestone confetti
    const currentStreak2 = streakRes.data?.current_streak ?? 0;
    if (currentStreak2 > 0) {
      fireStreakConfetti(currentStreak2);
    }

    // ── Achievement checks ─────────────────────────────
    // Total wins count
    const { count: totalWins } = await supabase
      .from("wins")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (totalWins && totalWins >= 1) unlock("first_win");
    if (totalWins && totalWins >= 10) unlock("wins_10");
    if (totalWins && totalWins >= 50) unlock("wins_50");
    if (totalWins && totalWins >= 100) unlock("wins_100");
    if (totalWins && totalWins >= 500) unlock("wins_500");

    // Streak achievements
    const currentStreak = streakRes.data?.current_streak ?? 0;
    if (currentStreak >= 3) unlock("streak_3");
    if (currentStreak >= 7) unlock("streak_7");
    if (currentStreak >= 14) unlock("streak_14");
    if (currentStreak >= 30) unlock("streak_30");

    // Epic win
    if (newTodayWins.some((w: Win) => w.difficulty === "epic")) unlock("epic_win");

    // 5 wins in a day
    if (newTodayWins.length >= 5) unlock("five_in_day");
  }, [today, unlock]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const motivationMessage = getMotivationMessage(todayWins.length);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-6 space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-sm text-muted-foreground">{dayOfWeek}</p>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-sm text-violet-500 dark:text-violet-400 mt-0.5" aria-live="polite">
          {motivationMessage}
        </p>
      </motion.div>

      {/* Reminder banner */}
      {todayWins.length === 0 && <ReminderBanner />}

      {/* Quick add */}
      <QuickAddWin onWinAdded={fetchData} categories={categories} />

      {/* Row 1: Stats — 3 equal cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <Trophy className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
              </div>
              <span className="text-sm font-medium">Today&apos;s Wins</span>
            </div>
            <p className="text-3xl font-bold text-foreground tabular-nums" aria-live="polite">
              <AnimatedNumber value={todayWins.length} />
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {todayWins.length === 0 ? "Nothing added yet" : todayWins.length === 1 ? "Great start!" : "Keep it up!"}
            </p>
          </CardContent>
        </Card>
        <StreakCard streak={streak} />
        <ProductivityScoreCard wins={todayWins} />
      </div>

      {/* Row 2: Weekly activity + Today's wins list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Weekly activity bar */}
        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm text-muted-foreground font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="flex items-end gap-2 h-20">
              {weekDays.map((day) => {
                const maxCount = Math.max(...weekDays.map((d) => d.count), 1);
                const heightPct = day.count > 0 ? Math.max((day.count / maxCount) * 100, 20) : 0;
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end justify-center h-14">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPct}%` }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className={`w-full rounded-sm ${day.isToday
                          ? "bg-violet-500"
                          : day.count > 0
                            ? "bg-violet-500/40"
                            : "bg-muted"
                          }`}
                        style={{ minHeight: day.count > 0 ? 4 : 0 }}
                      />
                    </div>
                    <span className={`text-[10px] font-medium ${day.isToday ? "text-violet-500 dark:text-violet-400" : "text-muted-foreground/60"}`}>
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Today's wins list */}
        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground font-medium">Today&apos;s Wins</CardTitle>
              {todayWins.length > 0 && (
                <span className="text-xs text-violet-500 dark:text-violet-400 font-medium">{todayWins.length} today</span>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            {todayWins.length === 0 ? (
              <div className="flex items-center gap-3 py-3 text-center justify-center">
                <Smile className="w-4 h-4 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No accomplishments yet today</p>
              </div>
            ) : (
              <SortableWinList
                wins={todayWins}
                categories={categories}
                onDeleted={fetchData}
                onUpdated={fetchData}
                onReorder={(reordered) => setTodayWins(reordered)}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Goals + Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <GoalTracker onGoalComplete={() => { fetchData(); refetchAchievements(); }} />
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              🏆 Achievements
              <span className="text-[10px] text-muted-foreground/60">{achievements.length}/{ACHIEVEMENTS.length}</span>
            </h3>
            <AchievementBadges achievements={achievements} />
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Challenges + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <ChallengesCard />
        <LeaderboardCard />
      </div>

      <AchievementToast achievementKey={newlyUnlocked} />
    </div>
  );
}
