"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Lock, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Achievement, AchievementDef } from "@/types";

// ── Achievement definitions ─────────────────────────────────
export const ACHIEVEMENTS: AchievementDef[] = [
  { key: "first_win", title: "First Win", description: "Log your first win", icon: "🏆" },
  { key: "wins_10", title: "Getting Started", description: "Log 10 wins total", icon: "🌱" },
  { key: "wins_50", title: "On a Roll", description: "Log 50 wins total", icon: "🔥" },
  { key: "streak_3", title: "Three-peat", description: "Reach a 3-day streak", icon: "3️⃣" },
  { key: "streak_7", title: "Week Warrior", description: "Reach a 7-day streak", icon: "📅" },
  { key: "streak_14", title: "Fortnight", description: "Reach a 14-day streak", icon: "🗓️" },
  { key: "epic_win", title: "Epic Achievement", description: "Log an epic difficulty win", icon: "🌟" },
  { key: "hard_5", title: "Challenge Seeker", description: "Log 5 hard wins", icon: "💪" },
  { key: "categories_3", title: "Well-Rounded", description: "Use 3 different categories", icon: "🎯" },
  { key: "five_in_day", title: "Productive Day", description: "Log 5 wins in one day", icon: "🚀" },
  { key: "early_bird", title: "Early Bird", description: "Log a win before 8 AM", icon: "🐦" },
  { key: "night_owl", title: "Night Owl", description: "Log a win after 10 PM", icon: "🦉" },
];

// ── Hook ─────────────────────────────────────────────────────
export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string | null>(null);
  const supabase = createClient();

  const fetchAchievements = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("achievements")
      .select("*")
      .eq("user_id", user.id);

    setAchievements(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const unlock = useCallback(async (key: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (achievements.some((a) => a.key === key)) return; // already unlocked

    const { data, error } = await supabase
      .from("achievements")
      .insert({ user_id: user.id, key })
      .select()
      .single();

    if (!error && data) {
      setAchievements((prev) => [...prev, data]);
      setNewlyUnlocked(key);
      setTimeout(() => setNewlyUnlocked(null), 3000);
    }
  }, [supabase, achievements]);

  const isUnlocked = useCallback((key: string) => {
    return achievements.some((a) => a.key === key);
  }, [achievements]);

  return { achievements, loading, unlock, isUnlocked, newlyUnlocked, refetch: fetchAchievements };
}

// ── Badge Grid Component ─────────────────────────────────────
interface AchievementBadgesProps {
  achievements: Achievement[];
  compact?: boolean;
}

export function AchievementBadges({ achievements, compact = false }: AchievementBadgesProps) {
  const unlockedKeys = new Set(achievements.map((a) => a.key));

  if (compact) {
    const unlocked = ACHIEVEMENTS.filter((a) => unlockedKeys.has(a.key));
    if (unlocked.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1.5">
        {unlocked.slice(0, 6).map((def) => (
          <motion.div
            key={def.key}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-8 h-8 rounded-lg bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center text-sm cursor-default"
            title={`${def.title}: ${def.description}`}
          >
            {def.icon}
          </motion.div>
        ))}
        {unlocked.length > 6 && (
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-[10px] text-muted-foreground font-medium">
            +{unlocked.length - 6}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {ACHIEVEMENTS.map((def) => {
        const unlocked = unlockedKeys.has(def.key);
        return (
          <motion.div
            key={def.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-4 text-center transition-all ${unlocked
              ? "ring-1 ring-violet-500/30"
              : "opacity-40 grayscale"
              }`}
          >
            <div className="text-2xl mb-2">
              {unlocked ? def.icon : <Lock className="w-5 h-5 mx-auto text-muted-foreground" />}
            </div>
            <p className="text-sm font-semibold text-foreground truncate">{def.title}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
              {def.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Toast for newly unlocked ─────────────────────────────────
export function AchievementToast({ achievementKey }: { achievementKey: string | null }) {
  const def = ACHIEVEMENTS.find((a) => a.key === achievementKey);

  return (
    <AnimatePresence>
      {def && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-500/25">
            <Sparkles className="w-5 h-5 shrink-0" />
            <div>
              <p className="text-sm font-semibold">Achievement Unlocked!</p>
              <p className="text-sm text-violet-200">
                {def.icon} {def.title}
              </p>
            </div>
            <Trophy className="w-5 h-5 shrink-0 text-yellow-300" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
