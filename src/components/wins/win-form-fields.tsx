"use client";

import { type Category, type WinDifficulty, type WinMood } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface WinFormFieldsProps {
  categories: Category[];
  categoryId: string | null;
  onCategoryChange: (val: string | null) => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  difficulty: WinDifficulty | null;
  onDifficultyChange: (val: WinDifficulty | null) => void;
  mood: WinMood | null;
  onMoodChange: (val: WinMood | null) => void;
}

const DIFFICULTIES: { value: WinDifficulty; label: string; color: string }[] = [
  { value: "easy", label: "Easy", color: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10 data-[active=true]:bg-emerald-500/20 data-[active=true]:border-emerald-500/50" },
  { value: "medium", label: "Medium", color: "text-amber-500 border-amber-500/30 bg-amber-500/10 data-[active=true]:bg-amber-500/20 data-[active=true]:border-amber-500/50" },
  { value: "hard", label: "Hard", color: "text-red-500 border-red-500/30 bg-red-500/10 data-[active=true]:bg-red-500/20 data-[active=true]:border-red-500/50" },
  { value: "epic", label: "Epic", color: "text-violet-500 border-violet-500/30 bg-violet-500/10 data-[active=true]:bg-violet-500/20 data-[active=true]:border-violet-500/50" },
];

const MOODS: { value: WinMood; emoji: string; label: string }[] = [
  { value: "great", emoji: "✨", label: "Great" },
  { value: "good", emoji: "😊", label: "Good" },
  { value: "okay", emoji: "😐", label: "Okay" },
  { value: "tough", emoji: "💪", label: "Tough" },
];

export function WinFormFields({
  categories,
  categoryId,
  onCategoryChange,
  tags,
  onTagsChange,
  difficulty,
  onDifficultyChange,
  mood,
  onMoodChange,
}: WinFormFieldsProps) {
  const [tagInput, setTagInput] = useState("");

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/^#/, "").toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        onTagsChange([...tags, newTag]);
      }
      setTagInput("");
    }
    if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      onTagsChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="space-y-3">
      {/* Category */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground w-16 shrink-0">Category</span>
          <Select
            value={categoryId ?? "none"}
            onValueChange={(v) => onCategoryChange(v === "none" ? null : v)}
          >
            <SelectTrigger className="h-7 text-sm flex-1">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    {cat.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Difficulty */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground w-16 shrink-0">Difficulty</span>
        <div className="flex gap-1">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.value}
              type="button"
              data-active={difficulty === d.value}
              className={`rounded-full px-2 py-0.5 text-sm border transition-colors font-medium ${d.color}`}
              onClick={() => onDifficultyChange(difficulty === d.value ? null : d.value)}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mood */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground w-16 shrink-0">Mood</span>
        <div className="flex gap-1">
          {MOODS.map((m) => (
            <button
              key={m.value}
              type="button"
              className={`rounded-full px-2 py-0.5 text-sm border transition-colors ${mood === m.value
                ? "bg-violet-500/20 border-violet-500/50 text-foreground"
                : "bg-muted border-border text-muted-foreground hover:border-violet-500/30"
                }`}
              onClick={() => onMoodChange(mood === m.value ? null : m.value)}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="flex items-start gap-2">
        <span className="text-sm text-muted-foreground w-16 shrink-0 pt-1">Tags</span>
        <div className="flex-1 flex flex-wrap gap-1 border border-border rounded-md px-2 py-1 min-h-[28px]">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-0.5 rounded-full bg-muted px-1.5 py-0.5 text-sm text-muted-foreground"
            >
              #{tag}
              <button
                type="button"
                onClick={() => onTagsChange(tags.filter((t) => t !== tag))}
                className="hover:text-foreground transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder={tags.length === 0 ? "Add tags, press Enter…" : ""}
            className="flex-1 min-w-[80px] bg-transparent text-sm outline-none placeholder:text-muted-foreground/40"
          />
        </div>
      </div>
    </div>
  );
}
