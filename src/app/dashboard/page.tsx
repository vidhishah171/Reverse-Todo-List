"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Smile } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { QuickAddWin } from "@/components/wins/quick-add-win";
import { SortableWinList } from "@/components/wins/sortable-win-list";
import { StreakCard } from "@/components/dashboard/streak-card";
import { ReminderBanner } from "@/components/dashboard/reminder-banner";
import { WeeklySummaryCard } from "@/components/dashboard/weekly-summary-card";
import { ProductivityScoreCard } from "@/components/dashboard/productivity-score-card";
import { MotivationalQuote } from "@/components/dashboard/motivational-quote";
import { GoalTracker } from "@/components/dashboard/goal-tracker";
import { DailyReflectionCard } from "@/components/dashboard/daily-reflection";
import { AchievementBadges, useAchievements, AchievementToast, ACHIEVEMENTS } from "@/components/dashboard/achievement-badges";
import { AISummaryCard } from "@/components/dashboard/ai-summary-card";
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
  const [weekWins, setWeekWins] = useState<Win[]>([]);
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
    setWeekWins(allWeekWins);
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
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-5"
      >
        <p className="text-sm text-muted-foreground mb-1">{dayOfWeek}</p>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <motion.p
          key={motivationMessage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-violet-500 dark:text-violet-400 mt-1"
          aria-live="polite"
        >
          {motivationMessage}
        </motion.p>
      </motion.div>

      {/* Reminder banner when no wins today */}
      {todayWins.length === 0 && <ReminderBanner />}

      {/* Quick add — always at top for fast access */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.03 }}
        className="mb-5"
      >
        <QuickAddWin onWinAdded={fetchData} categories={categories} />
      </motion.div>

      {/* Stats row: Today's Wins + Streak + Productivity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <Card className="h-full">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-violet-500 dark:text-violet-400" />
                </div>
                <span className="text-sm font-medium">Today&apos;s Wins</span>
              </div>
              <p className="text-4xl font-bold text-foreground tabular-nums" aria-live="polite">
                <AnimatedNumber value={todayWins.length} />
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {todayWins.length === 0
                  ? "No wins logged yet"
                  : todayWins.length === 1
                    ? "Great start!"
                    : "Keep it up!"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
        >
          <StreakCard streak={streak} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.11 }}
        >
          <ProductivityScoreCard wins={todayWins} />
        </motion.div>
      </div>

      {/* Two-column layout: Main content + Right sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Main content (2/3 width) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Weekly activity bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.13 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground font-medium">This Week</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-end gap-2 h-14">
                  {weekDays.map((day) => {
                    const maxCount = Math.max(...weekDays.map((d) => d.count), 1);
                    const heightPct = day.count > 0 ? Math.max((day.count / maxCount) * 100, 20) : 0;
                    return (
                      <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex items-end justify-center h-10">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPct}%` }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className={`w-full rounded-sm ${day.isToday
                              ? "bg-violet-500"
                              : day.count > 0
                                ? "bg-violet-500/30"
                                : "bg-muted"
                              }`}
                            style={{ minHeight: day.count > 0 ? 4 : 0 }}
                          />
                        </div>
                        <span
                          className={`text-[10px] font-medium ${day.isToday ? "text-violet-500 dark:text-violet-400" : "text-muted-foreground/60"
                            }`}
                        >
                          {day.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Today's wins list */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Today&apos;s Wins</CardTitle>
                  {todayWins.length > 0 && (
                    <span className="text-xs text-violet-500 dark:text-violet-400 font-medium">
                      {todayWins.length} logged
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {todayWins.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center mb-3">
                      <Smile className="w-5 h-5 text-muted-foreground/60" />
                    </div>
                    <p className="text-sm text-muted-foreground">No wins logged yet today.</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      Use the form above to log your first win!
                    </p>
                  </motion.div>
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
          </motion.div>

          {/* Weekly summary */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.17 }}
          >
            <WeeklySummaryCard wins={weekWins} categories={categories} />
          </motion.div>

          {/* Goals + Achievements side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.19 }}
            >
              <GoalTracker onGoalComplete={() => { fetchData(); refetchAchievements(); }} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.21 }}
            >
              <div className="glass-card p-5 h-full">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-base">🏆</span> Achievements
                  <span className="text-[10px] text-muted-foreground font-normal">
                    {achievements.length}/{ACHIEVEMENTS.length}
                  </span>
                </h3>
                <AchievementBadges achievements={achievements} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right sidebar (1/3 width) */}
        <div className="space-y-5">
          {/* AI Summary */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.14 }}
          >
            <AISummaryCard wins={todayWins} streak={streak} />
          </motion.div>

          {/* Motivational Quote */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.16 }}
          >
            <MotivationalQuote />
          </motion.div>

          {/* Daily reflection */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18 }}
          >
            <DailyReflectionCard />
          </motion.div>

          {/* Challenges */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <ChallengesCard />
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22 }}
          >
            <LeaderboardCard />
          </motion.div>
        </div>
      </div>

      {/* Achievement unlock toast */}
      <AchievementToast achievementKey={newlyUnlocked} />
    </div>
  );
}
