"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { type Win, type Category } from "@/types";
import { WinItem } from "./win-item";

interface DraggableWinItemProps {
    win: Win;
    categories?: Category[];
    onDeleted?: () => void;
    onUpdated?: () => void;
    showDate?: boolean;
}

export function DraggableWinItem({
    win,
    categories,
    onDeleted,
    onUpdated,
    showDate,
}: DraggableWinItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: win.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
        position: "relative" as const,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-0 ${isDragging
                ? "opacity-90 scale-[1.02] shadow-xl shadow-violet-500/10 rounded-lg bg-card ring-2 ring-violet-500/20"
                : ""
                } transition-shadow`}
        >
            <button
                {...attributes}
                {...listeners}
                className="shrink-0 p-1.5 cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground transition-colors touch-none"
                aria-label="Drag to reorder"
            >
                <GripVertical className="w-3.5 h-3.5" />
            </button>
            <div className="flex-1 min-w-0">
                <WinItem
                    win={win}
                    categories={categories}
                    onDeleted={onDeleted}
                    onUpdated={onUpdated}
                    showDate={showDate}
                />
            </div>
        </div>
    );
}
