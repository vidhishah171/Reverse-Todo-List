"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { WinFormFields } from "@/components/wins/win-form-fields";
import { type Win, type Category, type WinDifficulty, type WinMood } from "@/types";

interface EditWinDialogProps {
  win: Win;
  categories: Category[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

export function EditWinDialog({
  win,
  categories,
  open,
  onOpenChange,
  onSaved,
}: EditWinDialogProps) {
  const [title, setTitle] = useState(win.title);
  const [description, setDescription] = useState(win.description ?? "");
  const [categoryId, setCategoryId] = useState<string | null>(win.category_id);
  const [tags, setTags] = useState<string[]>(win.tags ?? []);
  const [difficulty, setDifficulty] = useState<WinDifficulty | null>(win.difficulty);
  const [mood, setMood] = useState<WinMood | null>(win.mood);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!title.trim()) return;
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("wins")
      .update({
        title: title.trim(),
        description: description.trim() || null,
        category_id: categoryId,
        tags,
        difficulty,
        mood,
      })
      .eq("id", win.id);
    setSaving(false);
    onOpenChange(false);
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Win</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What did you accomplish?"
            className="text-sm"
            onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
            autoFocus
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a note (optional)"
            className="text-xs text-muted-foreground"
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

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim() || saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
