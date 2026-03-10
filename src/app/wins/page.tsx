"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Inbox, CalendarDays } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { QuickAddWin } from "@/components/wins/quick-add-win";
import { WinItem } from "@/components/wins/win-item";
import { WinsSearch } from "@/components/wins/wins-search";
import { WinsFilterBar } from "@/components/wins/wins-filter-bar";
import { WinsExport } from "@/components/wins/wins-export";
import { WinsSkeleton } from "@/components/skeletons/wins-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { type Win, type Category, type WinFilter, DEFAULT_FILTER } from "@/types";

type GroupedWins = Record<string, Win[]>;

function groupWinsByDate(wins: Win[]): GroupedWins {
  return wins.reduce<GroupedWins>((acc, win) => {
    const key = win.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(win);
    return acc;
  }, {});
}

function applyFilters(wins: Win[], filter: WinFilter): Win[] {
  return wins.filter((w) => {
    if (filter.search) {
      const q = filter.search.toLowerCase();
      const matches =
        w.title.toLowerCase().includes(q) ||
        (w.description ?? "").toLowerCase().includes(q) ||
        (w.tags ?? []).some((t) => t.toLowerCase().includes(q));
      if (!matches) return false;
    }
    if (filter.category_id && w.category_id !== filter.category_id) return false;
    if (filter.difficulty && w.difficulty !== filter.difficulty) return false;
    if (filter.mood && w.mood !== filter.mood) return false;
    if (filter.dateFrom && w.date < filter.dateFrom) return false;
    if (filter.dateTo && w.date > filter.dateTo) return false;
    if (filter.pinnedOnly && !w.pinned) return false;
    return true;
  });
}

export default function WinsPage() {
  const [wins, setWins] = useState<Win[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<WinFilter>(DEFAULT_FILTER);

  const fetchData = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const [winsResult, catsResult] = await Promise.all([
      supabase
        .from("wins")
        .select("*, category:categories(*)")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .order("created_at", { ascending: false }),
      supabase.from("categories").select("*").eq("user_id", user.id),
    ]);

    setWins(winsResult.data ?? []);
    setCategories(catsResult.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = applyFilters(wins, filter);

  // Sort pinned first within each date group
  const grouped = groupWinsByDate(
    filtered.sort((a, b) => {
      if (a.date !== b.date) return a.date > b.date ? -1 : 1;
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return 0;
    }),
  );
  const sortedDates = Object.keys(grouped).sort((a, b) => (a > b ? -1 : 1));

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-violet-400" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">My Wins</h1>
          </div>
          {!loading && wins.length > 0 && <WinsExport wins={filtered} />}
        </div>
        <p className="text-sm text-muted-foreground">
          Your complete win history. Every accomplishment matters.
        </p>
      </motion.div>

      {/* Quick add */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mb-4"
      >
        <QuickAddWin onWinAdded={fetchData} categories={categories} />
      </motion.div>

      {/* Search + Filter */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-4 space-y-2"
        >
          <div className="flex items-center gap-2">
            <WinsSearch
              value={filter.search}
              onChange={(search) => setFilter((f) => ({ ...f, search }))}
            />
          </div>
          <WinsFilterBar filter={filter} onChange={setFilter} categories={categories} />
        </motion.div>
      )}

      {/* Summary bar */}
      {!loading && filtered.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-4 mb-4 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-violet-400" />
            <span>
              <strong className="text-foreground">{filtered.length}</strong> wins
              {filtered.length !== wins.length && ` of ${wins.length}`}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5 text-violet-400" />
            <span>
              <strong className="text-foreground">{sortedDates.length}</strong> days
            </span>
          </div>
        </motion.div>
      )}

      {/* Win groups */}
      {loading ? (
        <WinsSkeleton />
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center mb-4">
            <Inbox className="w-6 h-6 text-muted-foreground/60" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            {wins.length === 0 ? "No wins yet" : "No wins match your filters"}
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            {wins.length === 0
              ? "Log your first win above to get started!"
              : "Try adjusting your search or filters."}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {sortedDates.map((date, i) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <Card>
                  <CardHeader className="pb-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-foreground">
                        {formatDate(date)}
                      </CardTitle>
                      <span className="text-xs text-violet-400 font-medium">
                        {grouped[date]!.length}{" "}
                        {grouped[date]!.length === 1 ? "win" : "wins"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="divide-y divide-border">
                      <AnimatePresence mode="popLayout">
                        {grouped[date]!.map((win) => (
                          <WinItem
                            key={win.id}
                            win={win}
                            categories={categories}
                            onDeleted={fetchData}
                            onUpdated={fetchData}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
