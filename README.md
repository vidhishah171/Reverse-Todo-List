<p align="center">
  <img src="src/app/icon.svg" alt="Reverse Todo Logo" width="80" height="80" />
</p>

<h1 align="center">Reverse Todo</h1>

<p align="center">
  <strong>Track what you've done, not what you haven't.</strong><br/>
  A productivity app that flips the traditional to-do list — log wins, build streaks, earn achievements, and celebrate your progress.
</p>

<p align="center">
  <a href="https://reverse-todo-list.vercel.app/">Live Demo</a> ·
  <a href="#features">Features</a> ·
  <a href="#tech-stack">Tech Stack</a> ·
  <a href="#getting-started">Getting Started</a>
</p>

---

## The Problem

Traditional to-do lists focus on what's _undone_ — creating anxiety and guilt. **Reverse Todo** flips the script: instead of tracking tasks you haven't finished, you log accomplishments you _have_ achieved. The result? A positive feedback loop that motivates you to keep going.

## Features

### Core

- **Win Logging** — Record wins with title, description, category, difficulty, mood, and tags
- **Streak Tracking** — Current and longest streak calculated automatically
- **Analytics Dashboard** — 14-day bar chart, 3-month heatmap, breakdowns by category, difficulty, and day of week
- **Win History** — Grouped by date with search, filters, inline edit/delete/pin, and export (CSV & Markdown)

### Productivity

- **Achievement Badges** — 16 auto-unlocking achievements with toast notifications and confetti
- **Goal Tracking** — Create goals with targets, deadlines, and animated progress rings
- **Daily Reflections** — Per-day journaling with mood tracking
- **Productivity Score** — Real-time score card based on your activity
- **Weekly Summary** — Auto-generated overview of your week
- **Motivational Quotes** — Rotating quotes to keep you inspired

### Experience

- **Community Profiles** — Browse other users' public win stats
- **Challenges** — Join and track community challenges
- **AI Weekly Summary** — Smart insights on your productivity patterns
- **Command Palette** — Quick navigation with `⌘K` / `Ctrl+K`
- **Dark/Light/System Theme** — Full theme support with smooth toggling
- **Drag & Drop** — Reorder pinned wins
- **Confetti Celebrations** — Visual celebrations on milestones
- **Skeleton Loaders** — Polished loading states throughout
- **Fully Responsive** — Desktop sidebar + mobile bottom navigation

## Tech Stack

| Layer               | Technology               |
| ------------------- | ------------------------ |
| **Framework**       | Next.js 16 (App Router)  |
| **Language**        | TypeScript               |
| **Styling**         | Tailwind CSS + shadcn/ui |
| **Database & Auth** | Supabase                 |
| **Charts**          | Recharts                 |
| **Animations**      | Framer Motion            |
| **Icons**           | Lucide React             |
| **Command Palette** | cmdk                     |
| **Drag & Drop**     | dnd-kit                  |
| **Theme**           | next-themes              |
| **Deployment**      | Vercel                   |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### Installation

```bash
# Clone the repo
git clone https://github.com/vidhishah171/Reverse-Todo-List.git
cd Reverse-Todo-List

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

Add your Supabase credentials to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

Run the migrations in your Supabase SQL editor in order:

1. `supabase/migrations/001_initial.sql` — Wins, streaks, RPC
2. `supabase/migrations/002_phase1.sql` — Categories, win columns
3. `supabase/migrations/003_phase2.sql` — Achievements, goals, reflections

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Seed Demo Data

```bash
npm run seed
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Main dashboard
│   ├── wins/               # Win history
│   ├── analytics/          # Charts & stats
│   ├── community/          # Community profiles
│   ├── login/ & signup/    # Auth pages
│   └── layout.tsx          # Root layout + providers
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── layout/             # Sidebar, app shell, theme toggle
│   ├── dashboard/          # Dashboard widgets
│   ├── wins/               # Win-related components
│   ├── charts/             # Analytics charts
│   └── skeletons/          # Loading skeletons
├── hooks/                  # Custom React hooks
├── lib/                    # Supabase clients, utilities
├── types/                  # TypeScript types
└── middleware.ts           # Auth route protection
```

## Database Schema

| Table               | Purpose                              |
| ------------------- | ------------------------------------ |
| `wins`              | Logged accomplishments with metadata |
| `streaks`           | Current & longest streak per user    |
| `categories`        | User-defined win categories          |
| `achievements`      | Unlocked achievement badges          |
| `goals`             | Goals with targets and deadlines     |
| `daily_reflections` | Per-day journal entries              |

## Deployment

This app is deployed on **Vercel**. To deploy your own:

1. Push to GitHub
2. Import the repo on [vercel.com/new](https://vercel.com/new)
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables
4. In Supabase → Authentication → URL Configuration, add your Vercel URL to **Site URL** and **Redirect URLs**

## License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/vidhishah171">Vidhi Shah</a>
</p>
