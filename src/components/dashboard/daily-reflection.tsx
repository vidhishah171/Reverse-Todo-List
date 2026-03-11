"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Save, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { getTodayISO } from "@/lib/utils";
import type { DailyReflection, WinMood } from "@/types";

const MOOD_OPTIONS: { value: WinMood; emoji: string; label: string }[] = [
  { value: "lovely", emoji: " ❤ Lovely ", label: "Lovely" },
  { value: "great", emoji: " 😄 Great ", label: "Great" },
  { value: "good", emoji: " 🙂 Good ", label: "Good" },
  { value: "okay", emoji: " 😐 Okay ", label: "Okay" },
  { value: "tough", emoji: " 😓 Tough ", label: "Tough" },
];

interface DailyReflectionCardProps {
  onSave?: () => void;
}

export function DailyReflectionCard({ onSave }: DailyReflectionCardProps) {
  const [reflection, setReflection] = useState<DailyReflection | null>(null);
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<WinMood | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const supabase = createClient();
  const today = getTodayISO();

  // Set open state to true if there's content or a mood selected
  useEffect(() => {
    if (reflection || content.trim() || mood) {
      setOpen(true);
    }
  }, [reflection, content, mood]);

  const fetchReflection = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("daily_reflections")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today)
      .single();

    if (data) {
      setReflection(data);
      setContent(data.content);
      setMood(data.mood as WinMood | null);
    }
    setLoading(false);
  }, [supabase, today]);

  useEffect(() => {
    fetchReflection();
  }, [fetchReflection]);

  async function handleSave() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !content.trim()) return;

    setSaving(true);

    if (reflection) {
      await supabase
        .from("daily_reflections")
        .update({
          content: content.trim(),
          mood,
          updated_at: new Date().toISOString(),
        })
        .eq("id", reflection.id);
    } else {
      await supabase.from("daily_reflections").insert({
        user_id: user.id,
        date: today,
        content: content.trim(),
        mood,
      });
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    fetchReflection();
    onSave?.();
  }

  if (loading) {
    return (
      <div className="glass-card p-5 animate-pulse">
        <div className="h-5 w-32 bg-muted rounded mb-4" />
        <div className="h-20 bg-muted rounded" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-violet-500 dark:text-violet-400" />
          <h3 className="text-sm font-semibold text-foreground">
            Daily Reflection
          </h3>
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-[10px] text-emerald-500 font-medium"
            >
              Saved ✓
            </motion.span>
          )}

        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* Mood selector */}
            <div className="flex items-center gap-4 mb-3 mt-4 p-2 overflow-x-auto whitespace-nowrap">
              <span className="text-[15px] text-muted-foreground uppercase tracking-wider mr-1">
                Mood
              </span>
              {MOOD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMood(mood === option.value ? null : option.value)}
                  className={`w-35 h-8 rounded-lg text-sm transition-all flex items-center justify-center ${mood === option.value
                    ? "bg-violet-500/15 ring-1 p-2 ring-violet-500/30 scale-110"
                    : "hover:bg-muted/50"
                    }`}
                  title={option.label}
                  aria-label={`Set mood to ${option.label}`}
                >
                  {option.emoji}
                </button>
              ))}
            </div>

            {/* Text area */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="How was your day? What did you learn? What are you grateful for?"
              className="w-full min-h-[130px] p-3 rounded-lg bg-muted/30 border border-border/50 text-md text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-all"
              rows={3}
            />

            <div className="flex items-center justify-between mt-3">
              <span className="text-[10px] text-muted-foreground">
                {content.length > 0 ? `${content.length} chars` : ""}
              </span>
              <Button
                onClick={handleSave}
                disabled={!content.trim() || saving}
                size="sm"
                className="h-7 text-md gap-1.5"
              >
                {saving ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {reflection ? "Update" : "Save"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
