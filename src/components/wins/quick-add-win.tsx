"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2, Sparkles, Heart, HeartIcon, HeartHandshake } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { WinFormFields } from "@/components/wins/win-form-fields";
import { type Category, type WinDifficulty, type WinMood } from "@/types";

interface QuickAddWinProps {
  onWinAdded: () => void;
  categories?: Category[];
}

export function QuickAddWin({ onWinAdded, categories = [] }: QuickAddWinProps) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  const [description, setDescription] = useState("");
  const [celebrating, setCelebrating] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<WinDifficulty | null>(null);
  const [mood, setMood] = useState<WinMood | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit() {
    if (!title.trim()) return;
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];

    await supabase.from("wins").insert({
      user_id: user.id,
      title: title.trim(),
      description: description.trim() || null,
      date: today,
      category_id: categoryId,
      tags: tags.length > 0 ? tags : [],
      difficulty,
      mood,
    });

    // Update streak via RPC
    await supabase.rpc("update_streak", { p_user_id: user.id });

    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 1000);

    setTitle("");
    setDescription("");
    setShowDesc(false);
    setCategoryId(null);
    setTags([]);
    setDifficulty(null);
    setMood(null);
    setLoading(false);
    onWinAdded();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      setShowDesc(false);
      setDescription("");
    }
  }

  return (
    <div className="glass-card p-4 relative overflow-hidden">
      {/* Celebration flash */}
      <AnimatePresence>
        {celebrating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-violet-500/10 rounded-xl pointer-events-none z-10"
          />
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0">
          {loading ? (
            <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
          ) : celebrating ? (
            <Sparkles className="w-4 h-4 text-violet-400" />
          ) : (
            <HeartHandshake className="w-4 h-4 text-violet-400" />
          )}
        </div>
        <Input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowDesc(true)}
          placeholder="What did you accomplish today? Press Enter to save…"
          disabled={loading}
          data-quick-add-input
          className="border-transparent bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-3 text-sm placeholder:text-muted-foreground/50"
        />
        <button
          onClick={handleSubmit}
          disabled={!title.trim() || loading}
          className="shrink-0 text-sm sm:text-sm px-3 py-1.5 rounded-lg bg-violet-500 text-white hover:bg-violet-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium"
        >
          <span className="w-18 h-7 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
            <Plus className="w-4 h-4" />&nbsp; Add Win
          </span>

        </button>
      </div>

      <AnimatePresence>
        {showDesc && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-border space-y-3">
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a note (optional)"
                className="border-transparent bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-3 text-sm text-muted-foreground placeholder:text-muted-foreground/40"
              />
              <WinFormFields
                categories={categories}
                categoryId={categoryId}
                onCategoryChange={setCategoryId}
                tags={tags}
                onTagsChange={setTags}
                difficulty={difficulty}
                onDifficultyChange={setDifficulty}
                mood={mood}
                onMoodChange={setMood}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
