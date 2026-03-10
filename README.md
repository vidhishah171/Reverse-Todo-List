# Reverse Todo

> **Track what you've done, not what you haven't.**

Reverse Todo is a production-ready SaaS app that flips the traditional to-do list on its head. Instead of tracking unfinished tasks, users log and celebrate what they've **already accomplished** — building momentum, motivation, and healthy productivity habits.

---

## Features

- **Win Logging** — Quickly log accomplishments with a title and optional note. Press `Enter` to submit.
- **Streak Tracking** — See your current and longest consecutive-day streaks. Streaks auto-update via a Supabase RPC function.
- **Analytics Dashboard** — Bar charts (last 14 days), activity heatmap (last 3 months), and quick stats.
- **Win History** — All wins grouped by date, with inline delete.
- **Authentication** — Email + password auth via Supabase Auth with protected routes.
- **Dark Mode** — Forced dark mode with a violet/purple accent palette.
- **Framer Motion Animations** — Page transitions, card hover effects, list entry animations.
- **Mobile Responsive** — Bottom navigation on mobile, persistent sidebar on desktop.
- **Seed Script** — Populate 21 days of realistic demo data in one command.

---

## Tech Stack

| Layer           | Technology               |
| --------------- | ------------------------ |
| Framework       | Next.js 15 (App Router)  |
| Language        | TypeScript               |
| Styling         | Tailwind CSS + shadcn/ui |
| Animations      | Framer Motion            |
| Database & Auth | Supabase                 |
| Charts          | Recharts                 |
| Icons           | Lucide React             |
| Deployment      | Vercel                   |

---

## Local Setup

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)

### 1. Clone and install

```bash
git clone https://github.com/your-username/reverse-todo.git
cd reverse-todo
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these in your Supabase project: **Settings → API**.

### 3. Set up the database

1. Open your Supabase project → **SQL Editor**
2. Paste the contents of `supabase/migrations/001_initial.sql`
3. Click **Run**

This creates the `wins`, `streaks` tables, RLS policies, and the `update_streak` RPC function.

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Seed Demo Data (Optional)

To populate the app with realistic data for testing:

1. Add to `.env.local`:

```env
SEED_USER_EMAIL=demo@reversetodo.com
SEED_USER_PASSWORD=demo123456
```

2. Run:

```bash
npm run seed
```

This creates a demo user and seeds 21 days of wins. Sign in at `/login` with the credentials above.

---

## Supabase Setup Details

### Tables

**`wins`**
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | FK to auth.users |
| title | text | Win title |
| description | text | Optional note |
| date | date | Date of win |
| created_at | timestamptz | Auto-set |

**`streaks`**
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | FK to auth.users (unique) |
| current_streak | integer | Current consecutive days |
| longest_streak | integer | All-time best |
| last_logged_date | date | Last day a win was logged |
| updated_at | timestamptz | Auto-updated |

### RPC Functions

**`update_streak(p_user_id uuid)`** — Called after each win insert to recalculate the user's streak. Handles first-time creation, consecutive day increments, and resets.

---

## Deployment to Vercel

1. Push your code to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

No additional configuration needed.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Global styles + CSS variables
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx      # Auth-protected layout
│   │   └── page.tsx        # Main dashboard
│   ├── wins/
│   │   ├── layout.tsx
│   │   └── page.tsx        # Win history
│   └── analytics/
│       ├── layout.tsx
│       └── page.tsx        # Analytics + charts
├── components/
│   ├── ui/                 # Shadcn-style primitives
│   ├── layout/
│   │   └── sidebar.tsx     # Desktop + mobile nav
│   ├── dashboard/
│   │   └── streak-card.tsx
│   ├── wins/
│   │   ├── quick-add-win.tsx
│   │   └── win-item.tsx
│   └── charts/
│       ├── wins-bar-chart.tsx
│       └── wins-heatmap.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Browser client
│   │   └── server.ts       # Server component client
│   └── utils.ts            # cn(), formatDate(), etc.
├── types/index.ts          # Shared TypeScript types
├── middleware.ts            # Route protection
scripts/
└── seed.ts                 # Demo data seeder
supabase/
└── migrations/
    └── 001_initial.sql     # Full DB schema
```

---

## License

MIT
