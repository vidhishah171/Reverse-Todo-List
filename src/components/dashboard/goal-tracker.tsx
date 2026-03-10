"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Target,
  Check,
  Trash2,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressRing } from "@/components/dashboard/progress-ring";
import type { Goal, GoalFormData } from "@/types";

interface GoalTrackerProps {
  onGoalComplete?: () => void;
}

export function GoalTracker({ onGoalComplete }: GoalTrackerProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [form, setForm] = useState<GoalFormData>({
    title: "",
    target_count: 5,
    deadline: null,
  });
  const supabase = createClient();

  const fetchGoals = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setGoals(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  async function addGoal() {
    if (!form.title.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("goals").insert({
      user_id: user.id,
      title: form.title.trim(),
      target_count: form.target_count,
      deadline: form.deadline || null,
    });

    if (!error) {
      setForm({ title: "", target_count: 5, deadline: null });
      setShowForm(false);
      fetchGoals();
    }
  }

  async function incrementGoal(goal: Goal) {
    const newCount = Math.min(goal.current_count + 1, goal.target_count);
    const completed = newCount >= goal.target_count;

    const { error } = await supabase
      .from("goals")
      .update({
        current_count: newCount,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", goal.id);

    if (!error) {
      fetchGoals();
      if (completed) onGoalComplete?.();
    }
  }

  async function deleteGoal(id: string) {
    await supabase.from("goals").delete().eq("id", id);
    fetchGoals();
  }

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  if (loading) {
    return (
      <div className="glass-card p-5 animate-pulse">
        <div className="h-5 w-24 bg-muted rounded mb-4" />
        <div className="h-16 bg-muted rounded" />
      </div>
    );
  }

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-violet-500" />
          <h3 className="text-sm font-semibold text-foreground">Goals</h3>
          {activeGoals.length > 0 && (
            <span className="text-[10px] bg-violet-500/10 text-violet-600 dark:text-violet-400 px-1.5 py-0.5 rounded-full font-medium">
              {activeGoals.length}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Add goal form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border/50">
              <Input
                placeholder="Goal title..."
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && addGoal()}
                className="h-9 text-sm"
              />
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">
                    Target
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={999}
                    value={form.target_count}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, target_count: parseInt(e.target.value) || 1 }))
                    }
                    className="h-8 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">
                    Deadline
                  </label>
                  <Input
                    type="date"
                    value={form.deadline || ""}
                    onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value || null }))}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <Button onClick={addGoal} size="sm" className="w-full h-8 text-xs">
                Add Goal
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active goals */}
      {activeGoals.length === 0 && !showForm ? (
        <div className="text-center py-6">
          <Target className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">No active goals</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-xs text-violet-500 hover:text-violet-400 mt-1"
          >
            Set your first goal
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {activeGoals.map((goal) => (
              <GoalItem
                key={goal.id}
                goal={goal}
                onIncrement={() => incrementGoal(goal)}
                onDelete={() => deleteGoal(goal.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Completed goals */}
      {completedGoals.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border/50">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
          >
            {showCompleted ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
            {completedGoals.length} completed
          </button>
          <AnimatePresence>
            {showCompleted && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 mt-2 overflow-hidden"
              >
                {completedGoals.map((goal) => (
                  <GoalItem
                    key={goal.id}
                    goal={goal}
                    onDelete={() => deleteGoal(goal.id)}
                    completed
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ── Single Goal Item ─────────────────────────────────────────
function GoalItem({
  goal,
  onIncrement,
  onDelete,
  completed = false,
}: {
  goal: Goal;
  onIncrement?: () => void;
  onDelete: () => void;
  completed?: boolean;
}) {
  const pct = Math.round((goal.current_count / goal.target_count) * 100);
  const isOverdue = goal.deadline && new Date(goal.deadline) < new Date() && !goal.completed;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: completed ? 0.6 : 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors group"
    >
      {/* Mini progress ring */}
      <ProgressRing
        value={pct}
        size={36}
        strokeWidth={3}
        label={completed ? "✓" : undefined}
        color={completed ? "hsl(var(--chart-2))" : isOverdue ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
      />

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
          {goal.title}
        </p>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>{goal.current_count}/{goal.target_count}</span>
          {goal.deadline && (
            <span className={`flex items-center gap-0.5 ${isOverdue ? "text-destructive" : ""}`}>
              <Calendar className="w-2.5 h-2.5" />
              {new Date(goal.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!completed && onIncrement && (
          <button
            onClick={onIncrement}
            className="p-1.5 rounded-md bg-violet-500/10 hover:bg-violet-500/20 text-violet-500 transition-colors"
            aria-label="Increment goal progress"
          >
            <Check className="w-3 h-3" />
          </button>
        )}
        <button
          onClick={onDelete}
          className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          aria-label="Delete goal"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}
