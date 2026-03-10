# Reverse Todo - Project Context

> Track what you've done, not what you haven't.

## What This Project Is

A production-ready SaaS app built with Next.js that flips the traditional to-do list. Users log and celebrate accomplishments ("wins") instead of tracking unfinished tasks.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Theme**: next-themes (light/dark/system)
- **Animations**: Framer Motion
- **Database & Auth**: Supabase (via @supabase/ssr)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Command Palette**: cmdk
- **Deployment**: Vercel

## Key Features

### Core
- Win logging (title + description + category + difficulty + mood + tags, Enter to submit)
- Streak tracking (current + longest, via Supabase RPC)
- Analytics dashboard (bar chart 14 days, heatmap 3 months, by-category, by-difficulty, by-day-of-week)
- Win history grouped by date with search, filters, export (CSV/Markdown), inline edit/delete/pin
- Email/password auth via Supabase, protected routes via middleware

### Phase 1 (implemented)
- Categories system (CRUD, colored badges)
- Win difficulty levels (easy/medium/hard/epic)
- Mood tracking per win (great/good/okay/tough)
- Tags system
- Pin/edit wins
- Search + advanced filters
- Export (CSV + Markdown)
- Command palette (⌘K)
- Productivity score card
- Weekly summary card
- Skeleton loaders
- Theme system (light/dark/system with toggle)

### Phase 2 (implemented)
- Achievement badge system (16 achievements, auto-unlock, toast notifications)
- Goal tracking (create goals, increment progress, deadlines, progress rings)
- Daily reflection notes (per-day journaling with mood)
- Motivational quote widget (20 rotating quotes, shuffle)
- Progress ring component (animated SVG circles)
- Error boundaries (global + per-route error.tsx)
- Loading states (loading.tsx for each route)
- 404 not-found page
- Accessibility (skip-nav, aria-labels, aria-live, landmarks)
- Light theme fix (richer contrast, violet tints, visible depth)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout + ThemeProvider + skip-nav
│   ├── page.tsx                   # Landing page
│   ├── globals.css                # Light/dark CSS variables
│   ├── error.tsx                  # Global error boundary
│   ├── not-found.tsx              # Custom 404
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx             # Auth guard + AppShell
│   │   ├── page.tsx               # Dashboard (wins, streak, goals, achievements, reflection, quotes)
│   │   ├── loading.tsx
│   │   └── error.tsx
│   ├── wins/
│   │   ├── layout.tsx + page.tsx  # Win history with search/filter/export
│   │   ├── loading.tsx + error.tsx
│   └── analytics/
│       ├── layout.tsx + page.tsx  # Charts + stats
│       ├── loading.tsx + error.tsx
├── components/
│   ├── ui/                        # Shadcn primitives
│   ├── layout/
│   │   ├── sidebar.tsx            # Desktop sidebar + mobile bottom nav
│   │   ├── app-shell.tsx          # Shell with ⌘K support
│   │   └── theme-toggle.tsx       # Light/dark/system cycle
│   ├── providers/theme-provider.tsx
│   ├── command/command-palette.tsx
│   ├── categories/category-manager.tsx
│   ├── dashboard/
│   │   ├── streak-card.tsx
│   │   ├── productivity-score-card.tsx
│   │   ├── weekly-summary-card.tsx
│   │   ├── reminder-banner.tsx
│   │   ├── motivational-quote.tsx
│   │   ├── progress-ring.tsx
│   │   ├── goal-tracker.tsx
│   │   ├── daily-reflection.tsx
│   │   └── achievement-badges.tsx
│   ├── wins/
│   │   ├── quick-add-win.tsx
│   │   ├── win-item.tsx
│   │   ├── win-form-fields.tsx
│   │   ├── edit-win-dialog.tsx
│   │   ├── wins-search.tsx
│   │   ├── wins-filter-bar.tsx
│   │   ├── wins-export.tsx
│   │   ├── category-badge.tsx
│   │   ├── difficulty-badge.tsx
│   │   ├── mood-indicator.tsx
│   │   └── tag-list.tsx
│   ├── charts/
│   │   ├── wins-bar-chart.tsx
│   │   ├── wins-heatmap.tsx
│   │   ├── wins-by-category-chart.tsx
│   │   ├── difficulty-distribution-chart.tsx
│   │   └── wins-by-day-of-week.tsx
│   └── skeletons/
│       ├── dashboard-skeleton.tsx
│       ├── wins-skeleton.tsx
│       └── analytics-skeleton.tsx
├── hooks/
│   ├── use-categories.ts
│   └── use-animated-counter.ts
├── lib/
│   ├── supabase/client.ts + server.ts
│   └── utils.ts
├── types/index.ts
└── middleware.ts
scripts/seed.ts
supabase/migrations/
├── 001_initial.sql          # wins, streaks, RPC
├── 002_phase1.sql           # categories, win columns
└── 003_phase2.sql           # achievements, goals, daily_reflections
```

## Database Schema

**`wins`**: id, user_id, title, description, date, created_at, category_id, tags, difficulty, mood, pinned
**`streaks`**: id, user_id, current_streak, longest_streak, last_logged_date, updated_at
**`categories`**: id, user_id, name, color, created_at
**`achievements`**: id, user_id, key, unlocked_at (unique user_id+key)
**`goals`**: id, user_id, title, target_count, current_count, deadline, completed, completed_at, created_at, updated_at
**`daily_reflections`**: id, user_id, date, content, mood, created_at, updated_at (unique user_id+date)
**RPC**: `update_streak(p_user_id uuid)` — recalculates streak after each win insert

## Local Dev

```bash
npm install
# set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
npm run dev        # http://localhost:3000
npm run seed       # populate 21 days of demo data
```

## Migrations to Run

Run in Supabase SQL editor in order:
1. `supabase/migrations/001_initial.sql`
2. `supabase/migrations/002_phase1.sql`
3. `supabase/migrations/003_phase2.sql`

## Session Notes

_Use this section to track progress, decisions, and what was last worked on._

- Session started: 2026-03-09
- Status: Phase 1 + Phase 2 complete, build passes
- Phase 1: Categories, tags, difficulty, mood, pin/edit, search/filter/export, command palette, theme system, productivity score, weekly summary, skeletons
- Phase 2: Achievements, goals, reflections, quotes, progress rings, error boundaries, loading.tsx, not-found, accessibility, light theme fix
- Next: Run 003_phase2.sql migration, test end-to-end, consider adding AI weekly summary, browser notifications, or more chart types
