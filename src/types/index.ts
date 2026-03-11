// ============================================================
// Core Types
// ============================================================

export type WinDifficulty = "easy" | "medium" | "hard" | "epic";
export type WinMood = "lovely" | "great" | "good" | "okay" | "tough";

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string; // hex e.g. "#8b5cf6"
  created_at: string;
}

export interface Win {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  date: string; // ISO YYYY-MM-DD
  created_at: string;
  // Phase 1 additions
  category_id: string | null;
  tags: string[] | null;
  difficulty: WinDifficulty | null;
  mood: WinMood | null;
  pinned: boolean;
  sort_order: number;
  // Optional join
  category?: Category | null;
}

export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_logged_date: string | null;
  updated_at: string;
}

export interface User {
  id: string;
  email: string | undefined;
  created_at: string;
}

// ============================================================
// Form Data
// ============================================================

export interface WinFormData {
  title: string;
  description?: string;
  date?: string;
  category_id?: string | null;
  tags?: string[];
  difficulty?: WinDifficulty | null;
  mood?: WinMood | null;
}

export interface CategoryFormData {
  name: string;
  color: string;
}

// ============================================================
// Filter State
// ============================================================

export interface WinFilter {
  search: string;
  category_id: string | null;
  difficulty: WinDifficulty | null;
  mood: WinMood | null;
  dateFrom: string | null;
  dateTo: string | null;
  pinnedOnly: boolean;
}

export const DEFAULT_FILTER: WinFilter = {
  search: "",
  category_id: null,
  difficulty: null,
  mood: null,
  dateFrom: null,
  dateTo: null,
  pinnedOnly: false,
};

// ============================================================
// Analytics
// ============================================================

export interface AnalyticsData {
  winsToday: number;
  winsThisWeek: number;
  winsThisMonth: number;
  dailyCounts: DailyCount[];
  heatmapData: HeatmapDay[];
}

export interface DailyCount {
  date: string;
  count: number;
  label: string;
}

export interface HeatmapDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface WeeklySummary {
  totalWins: number;
  avgPerDay: number;
  bestDay: string | null;
  bestDayCount: number;
  topCategory: Category | null;
}

// ============================================================
// Achievements
// ============================================================

export interface Achievement {
  id: string;
  user_id: string;
  key: string;
  unlocked_at: string;
}

export interface AchievementDef {
  key: string;
  title: string;
  description: string;
  icon: string; // emoji
}

// ============================================================
// Goals
// ============================================================

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  target_count: number;
  current_count: number;
  deadline: string | null;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GoalFormData {
  title: string;
  target_count: number;
  deadline?: string | null;
}

// ============================================================
// Daily Reflections
// ============================================================

export interface DailyReflection {
  id: string;
  user_id: string;
  date: string;
  content: string;
  mood: WinMood | null;
  created_at: string;
  updated_at: string;
}

export interface ReflectionFormData {
  content: string;
  mood?: WinMood | null;
}

// ============================================================
// Public Profiles (Phase 3)
// ============================================================

export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileFormData {
  username: string;
  display_name: string;
  bio?: string;
  is_public: boolean;
}

// ============================================================
// Challenges & Leaderboard (Phase 3)
// ============================================================

export interface Challenge {
  id: string;
  title: string;
  description: string | null;
  challenge_type: string;
  target_count: number;
  start_date: string;
  end_date: string;
  created_by: string | null;
  is_active: boolean;
  created_at: string;
  participant_count?: number;
  my_progress?: number;
  joined?: boolean;
}

export interface ChallengeParticipant {
  id: string;
  challenge_id: string;
  user_id: string;
  progress: number;
  joined_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  username: string | null;
  total_wins: number;
  current_streak: number;
  longest_streak: number;
}

// ============================================================
// AI Summaries (Phase 3)
// ============================================================

export interface AISummary {
  id: string;
  user_id: string;
  summary_type: "daily" | "weekly";
  content: string;
  period_start: string;
  period_end: string;
  created_at: string;
}
