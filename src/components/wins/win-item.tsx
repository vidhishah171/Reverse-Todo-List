"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Trash2, Clock, Pin, PinOff, Pencil } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { type Win, type Category } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { CategoryBadge } from "@/components/wins/category-badge";
import { DifficultyBadge } from "@/components/wins/difficulty-badge";
import { MoodIndicator } from "@/components/wins/mood-indicator";
import { TagList } from "@/components/wins/tag-list";
import { EditWinDialog } from "@/components/wins/edit-win-dialog";

interface WinItemProps {
  win: Win;
  categories?: Category[];
  onDeleted?: () => void;
  onUpdated?: () => void;
  showDate?: boolean;
}

export function WinItem({ win, categories = [], onDeleted, onUpdated, showDate }: WinItemProps) {
  const [deleting, setDeleting] = useState(false);
  const [pinning, setPinning] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [pinned, setPinned] = useState(win.pinned);

  async function handleDelete() {
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("wins").delete().eq("id", win.id);
    onDeleted?.();
  }

  async function handleTogglePin() {
    setPinning(true);
    const supabase = createClient();
    const newPinned = !pinned;
    await supabase.from("wins").update({ pinned: newPinned }).eq("id", win.id);
    setPinned(newPinned);
    setPinning(false);
    onUpdated?.();
  }

  const category = win.category ?? categories.find((c) => c.id === win.category_id);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20, scale: 0.95 }}
        whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.03)" }}
        transition={{ duration: 0.25, layout: { duration: 0.2 } }}
        className={`group flex items-start gap-3 py-3 px-4 rounded-lg transition-colors ${deleting ? "opacity-40 pointer-events-none" : ""
          } ${pinned ? "bg-violet-500/5 border border-violet-500/10" : ""}`}
      >
        <div className="mt-0.5 shrink-0">
          <CheckCircle2 className="w-4 h-4 text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-md text-foreground/90 font-medium truncate">{win.title}</p>
            {pinned && <Pin className="w-3 h-3 text-violet-400 shrink-0" />}
          </div>
          {win.description && (
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
              {win.description}
            </p>
          )}
          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            {category && <CategoryBadge category={category} />}
            {win.difficulty && <DifficultyBadge difficulty={win.difficulty} />}
            {win.mood && <MoodIndicator mood={win.mood} />}
            {win.tags && win.tags.length > 0 && <TagList tags={win.tags} />}
          </div>
          {showDate && (
            <div className="flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3 text-muted-foreground/60" />
              <span className="text-[11px] text-muted-foreground/60">
                {formatDate(win.date)}
              </span>
            </div>
          )}
        </div>

        {/* Action buttons — visible on hover */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => setEditOpen(true)}
            aria-label="Edit win"
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleTogglePin}
            disabled={pinning}
            aria-label={pinned ? "Unpin win" : "Pin win"}
            className="p-1 rounded hover:bg-violet-500/10 text-muted-foreground hover:text-violet-400 transition-colors"
          >
            {pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleDelete}
            aria-label="Delete win"
            className="p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      <EditWinDialog
        win={win}
        categories={categories}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={() => onUpdated?.()}
      />
    </>
  );
}
