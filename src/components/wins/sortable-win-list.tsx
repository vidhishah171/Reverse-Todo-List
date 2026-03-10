"use client";

import { useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { DraggableWinItem } from "./draggable-win-item";
import { type Win, type Category } from "@/types";

interface SortableWinListProps {
    wins: Win[];
    categories: Category[];
    onDeleted: () => void;
    onUpdated: () => void;
    onReorder: (wins: Win[]) => void;
}

export function SortableWinList({
    wins,
    categories,
    onDeleted,
    onUpdated,
    onReorder,
}: SortableWinListProps) {
    const [items, setItems] = useState(wins);

    // Sync external wins changes
    if (wins.length !== items.length || wins.some((w, i) => w.id !== items[i]?.id)) {
        setItems(wins);
    }

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex((w) => w.id === active.id);
        const newIndex = items.findIndex((w) => w.id === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex);
        setItems(reordered);
        onReorder(reordered);

        // Persist new sort order
        const supabase = createClient();
        const updates = reordered.map((w, i) => ({
            id: w.id,
            sort_order: i,
        }));

        for (const u of updates) {
            await supabase.from("wins").update({ sort_order: u.sort_order }).eq("id", u.id);
        }
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((w) => w.id)} strategy={verticalListSortingStrategy}>
                <AnimatePresence mode="popLayout">
                    <div className="divide-y divide-border">
                        {items.map((win) => (
                            <DraggableWinItem
                                key={win.id}
                                win={win}
                                categories={categories}
                                onDeleted={onDeleted}
                                onUpdated={onUpdated}
                            />
                        ))}
                    </div>
                </AnimatePresence>
            </SortableContext>
        </DndContext>
    );
}
