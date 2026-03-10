import { type WinDifficulty } from "@/types";

interface DifficultyBadgeProps {
  difficulty: WinDifficulty;
  className?: string;
}

const DIFFICULTY_CONFIG: Record<WinDifficulty, { label: string; className: string }> = {
  easy: { label: "Easy", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" },
  medium: { label: "Medium", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" },
  hard: { label: "Hard", className: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20" },
  epic: { label: "Epic", className: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20" },
};

export function DifficultyBadge({ difficulty, className = "" }: DifficultyBadgeProps) {
  const config = DIFFICULTY_CONFIG[difficulty];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.className} ${className}`}>
      {config.label}
    </span>
  );
}
