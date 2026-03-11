"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { BarChart3, Trophy, TrendingUp, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WinsBarChart } from "@/components/charts/wins-bar-chart";
import { WinsHeatmap } from "@/components/charts/wins-heatmap";
import { WinsByCategoryChart } from "@/components/charts/wins-by-category-chart";
import { DifficultyDistributionChart } from "@/components/charts/difficulty-distribution-chart";
import { WinsByDayOfWeek } from "@/components/charts/wins-by-day-of-week";
import { AnalyticsSkeleton } from "@/components/skeletons/analytics-skeleton";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { type Win, type Category } from "@/types";
import { format, subDays, subMonths, startOfMonth, endOfMonth } from "date-fns";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  description?: string;
  delay?: number;
}

function StatCard({ label, value, icon: Icon, description, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="h-full">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Icon className="w-4 h-4 text-violet-400" />
            </div>
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
          <p className="text-4xl font-bold text-foreground tabular-nums">
            <AnimatedNumber value={value} />
          </p>
          {description && (
            <p className="text-sm text-muted-foreground/60 mt-1">{description}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const [wins, setWins] = useState<Win[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const threeMonthsAgo = format(subMonths(new Date(), 3), "yyyy-MM-dd");

    const [winsRes, catsRes] = await Promise.all([
      supabase
        .from("wins")
        .select("*, category:categories(*)")
        .eq("user_id", user.id)
        .gte("date", threeMonthsAgo)
        .order("date", { ascending: true }),
      supabase.from("categories").select("*").eq("user_id", user.id),
    ]);

    setWins(winsRes.data ?? []);
    setCategories(catsRes.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const today = format(new Date(), "yyyy-MM-dd");
  const weekAgo = format(subDays(new Date(), 6), "yyyy-MM-dd");
  const monthStart = format(startOfMonth(new Date()), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(new Date()), "yyyy-MM-dd");

  const winsToday = wins.filter((w) => w.date === today).length;
  const winsThisWeek = wins.filter((w) => w.date >= weekAgo && w.date <= today).length;
  const winsThisMonth = wins.filter((w) => w.date >= monthStart && w.date <= monthEnd).length;

  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const d = subDays(new Date(), 13 - i);
    const dateStr = format(d, "yyyy-MM-dd");
    return {
      date: dateStr,
      label: format(d, "MMM d"),
      shortLabel: format(d, "d"),
      count: wins.filter((w) => w.date === dateStr).length,
    };
  });

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Analytics</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Your productivity insights and patterns at a glance.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Today" value={winsToday} icon={Trophy} description="Wins logged today" delay={0.05} />
        <StatCard label="This Week" value={winsThisWeek} icon={TrendingUp} description="Last 7 days" delay={0.1} />
        <StatCard label="This Month" value={winsThisMonth} icon={Calendar} description={format(new Date(), "MMMM yyyy")} delay={0.15} />
      </div>

      {/* Row 1: Daily bar chart (full width) */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="mb-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle>Daily Wins — Last 14 Days</CardTitle></CardHeader>
          <CardContent><WinsBarChart data={last14Days} /></CardContent>
        </Card>
      </motion.div>

      {/* Row 2: Day of Week + Difficulty side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.22 }}>
          <Card className="h-full">
            <CardHeader className="pb-2"><CardTitle>Wins by Day of Week</CardTitle></CardHeader>
            <CardContent><WinsByDayOfWeek wins={wins} /></CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.24 }}>
          <Card className="h-full">
            <CardHeader className="pb-2"><CardTitle>Difficulty Distribution</CardTitle></CardHeader>
            <CardContent><DifficultyDistributionChart wins={wins} /></CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Row 3: Category + Heatmap side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {categories.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.26 }}>
            <Card className="h-full">
              <CardHeader className="pb-2"><CardTitle>Wins by Category</CardTitle></CardHeader>
              <CardContent><WinsByCategoryChart wins={wins} categories={categories} /></CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.28 }} className={categories.length === 0 ? "lg:col-span-2" : ""}>
          <Card className="h-full">
            <CardHeader className="pb-2"><CardTitle>Activity Heatmap — Last 3 Months</CardTitle></CardHeader>
            <CardContent><WinsHeatmap wins={wins} /></CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
