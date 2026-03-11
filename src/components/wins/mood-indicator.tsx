import { type WinMood } from "@/types";

interface MoodIndicatorProps {
  mood: WinMood;
  className?: string;
}

const MOOD_CONFIG: Record<WinMood, { emoji: string; label: string }> = {
  lovely: { emoji: "❤", label: "Lovely" },
  great: { emoji: "✨", label: "Great" },
  good: { emoji: "😊", label: "Good" },
  okay: { emoji: "😐", label: "Okay" },
  tough: { emoji: "💪", label: "Tough" },
};

export function MoodIndicator({ mood, className = "" }: MoodIndicatorProps) {
  const config = MOOD_CONFIG[mood];
  return (
    <span className={`inline-flex items-center gap-1 text-sm text-muted-foreground ${className}`} title={`Mood: ${config.label}`}>
      <span>{config.emoji}</span>
    </span>
  );
}
