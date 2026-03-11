import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isYesterday, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMM d");
}

export function formatShortDate(dateStr: string): string {
  return format(parseISO(dateStr), "MMM d");
}

export function getTodayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function getMotivationMessage(winsCount: number): string {
  if (winsCount === 0)
    return "Add your first accomplishment of the day — every step counts!";
  if (winsCount === 1) return "Great start! One down. Keep the momentum going.";
  if (winsCount <= 3) return "You're on a roll! Keep adding more.";
  if (winsCount <= 6) return "Incredible day! You're absolutely crushing it.";
  return "Legendary. You are unstoppable today.";
}

export function getStreakEmoji(streak: number): string {
  if (streak === 0) return "🌱";
  if (streak < 3) return "🔥";
  if (streak < 7) return "⚡";
  if (streak < 14) return "💫";
  if (streak < 30) return "🚀";
  return "👑";
}
