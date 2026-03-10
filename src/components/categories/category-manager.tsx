"use client";

import { useState } from "react";
import { Trash2, Pencil, Plus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Category } from "@/types";
import { type useCategories } from "@/hooks/use-categories";

const COLOR_SWATCHES = [
  "#8b5cf6", // violet
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#ec4899", // pink
];

interface CategoryManagerProps {
  categories: Category[];
  onCreateCategory: ReturnType<typeof useCategories>["createCategory"];
  onUpdateCategory: ReturnType<typeof useCategories>["updateCategory"];
  onDeleteCategory: ReturnType<typeof useCategories>["deleteCategory"];
}

interface EditState {
  id: string;
  name: string;
  color: string;
}

export function CategoryManager({
  categories,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
}: CategoryManagerProps) {
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(COLOR_SWATCHES[0]!);
  const [adding, setAdding] = useState(false);
  const [editState, setEditState] = useState<EditState | null>(null);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    await onCreateCategory({ name: newName, color: newColor });
    setNewName("");
    setNewColor(COLOR_SWATCHES[0]!);
    setAdding(false);
  };

  const handleSaveEdit = async () => {
    if (!editState || !editState.name.trim()) return;
    await onUpdateCategory(editState.id, { name: editState.name, color: editState.color });
    setEditState(null);
  };

  return (
    <div className="space-y-3">
      {/* Existing categories */}
      {categories.length > 0 && (
        <div className="space-y-2">
          {categories.map((cat) =>
            editState?.id === cat.id ? (
              <div key={cat.id} className="flex items-center gap-2">
                <Input
                  value={editState.name}
                  onChange={(e) => setEditState({ ...editState, name: e.target.value })}
                  className="flex-1 h-8 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit();
                    if (e.key === "Escape") setEditState(null);
                  }}
                  autoFocus
                />
                <div className="flex gap-1">
                  {COLOR_SWATCHES.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-5 h-5 rounded-full border-2 flex-shrink-0 transition-transform hover:scale-110"
                      style={{
                        backgroundColor: color,
                        borderColor: editState.color === color ? "white" : "transparent",
                      }}
                      onClick={() => setEditState({ ...editState, color })}
                    />
                  ))}
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSaveEdit}>
                  <Check className="w-3.5 h-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditState(null)}>
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            ) : (
              <div key={cat.id} className="flex items-center gap-2 group">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="flex-1 text-sm">{cat.name}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => setEditState({ id: cat.id, name: cat.name, color: cat.color })}
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => onDeleteCategory(cat.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ),
          )}
        </div>
      )}

      {/* Add new category */}
      <div className="flex items-center gap-2 pt-2 border-t border-border">
        <Input
          placeholder="New category..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 h-8 text-sm"
          onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
        />
        <div className="flex gap-1">
          {COLOR_SWATCHES.map((color) => (
            <button
              key={color}
              type="button"
              className="w-5 h-5 rounded-full border-2 flex-shrink-0 transition-transform hover:scale-110"
              style={{
                backgroundColor: color,
                borderColor: newColor === color ? "white" : "transparent",
              }}
              onClick={() => setNewColor(color)}
            />
          ))}
        </div>
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleAdd} disabled={adding || !newName.trim()}>
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
