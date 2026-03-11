"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { type Category, type WinFilter, type WinDifficulty, type WinMood } from "@/types";

interface WinsFilterBarProps {
  filter: WinFilter;
  onChange: (filter: WinFilter) => void;
  categories: Category[];
}

const DIFFICULTIES: { value: WinDifficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "epic", label: "Epic" },
];

const MOODS: { value: WinMood; label: string }[] = [
  { value: "great", label: "✨ Great" },
  { value: "good", label: "😊 Good" },
  { value: "okay", label: "😐 Okay" },
  { value: "tough", label: "💪 Tough" },
];

const isFilterActive = (filter: WinFilter) =>
  filter.category_id !== null ||
  filter.difficulty !== null ||
  filter.mood !== null ||
  filter.dateFrom !== null ||
  filter.dateTo !== null ||
  filter.pinnedOnly;

export function WinsFilterBar({ filter, onChange, categories }: WinsFilterBarProps) {
  const active = isFilterActive(filter);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Category */}
      {categories.length > 0 && (
        <Select
          value={filter.category_id ?? "all"}
          onValueChange={(v) => onChange({ ...filter, category_id: v === "all" ? null : v })}
        >
          <SelectTrigger className="h-8 text-sm w-36">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
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
      )}

      {/* Difficulty */}
      <Select
        value={filter.difficulty ?? "all"}
        onValueChange={(v) => onChange({ ...filter, difficulty: v === "all" ? null : (v as WinDifficulty) })}
      >
        <SelectTrigger className="h-8 text-sm w-28">
          <SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All levels</SelectItem>
          {DIFFICULTIES.map((d) => (
            <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Mood */}
      <Select
        value={filter.mood ?? "all"}
        onValueChange={(v) => onChange({ ...filter, mood: v === "all" ? null : (v as WinMood) })}
      >
        <SelectTrigger className="h-8 text-sm w-28">
          <SelectValue placeholder="Mood" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All moods</SelectItem>
          {MOODS.map((m) => (
            <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date from */}
      <input
        type="date"
        value={filter.dateFrom ?? ""}
        onChange={(e) => onChange({ ...filter, dateFrom: e.target.value || null })}
        className="h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground"
        placeholder="From"
      />
      <input
        type="date"
        value={filter.dateTo ?? ""}
        onChange={(e) => onChange({ ...filter, dateTo: e.target.value || null })}
        className="h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground"
        placeholder="To"
      />

      {/* Pinned only */}
      <div className="flex items-center gap-1.5 h-8">
        <Switch
          id="pinned-filter"
          checked={filter.pinnedOnly}
          onCheckedChange={(v) => onChange({ ...filter, pinnedOnly: v })}
          className="scale-75"
        />
        <Label htmlFor="pinned-filter" className="text-sm cursor-pointer">Pinned</Label>
      </div>

      {/* Clear */}
      {active && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-sm text-muted-foreground"
          onClick={() =>
            onChange({
              search: filter.search,
              category_id: null,
              difficulty: null,
              mood: null,
              dateFrom: null,
              dateTo: null,
              pinnedOnly: false,
            })
          }
        >
          <X className="w-3 h-3 mr-1" /> Clear filters
        </Button>
      )}
    </div>
  );
}
