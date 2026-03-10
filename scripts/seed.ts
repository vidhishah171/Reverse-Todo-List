/**
 * Reverse Todo — Seed Script
 * Populates comprehensive demo data: wins, streaks, categories, profiles,
 * achievements, goals, reflections, and challenge participation.
 *
 * Usage:
 *   1. Copy .env.local.example to .env.local and fill in Supabase credentials
 *   2. Add SEED_USER_EMAIL and SEED_USER_PASSWORD to .env.local
 *   3. Run all migrations (001–004) first
 *   4. Run: npm run seed
 */

import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { createClient } from "@supabase/supabase-js";
import { subDays, format } from "date-fns";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SEED_EMAIL = process.env.SEED_USER_EMAIL ?? "demo@reversetodo.com";
const SEED_PASSWORD = process.env.SEED_USER_PASSWORD ?? "demo123456";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "❌  Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Demo users for public profiles ─────────────────────────
const DEMO_USERS = [
  {
    email: "vidhi.shah@bacancy.com",
    password: "vidhi123",
    username: "vidhishah171",
    displayName: "Vidhi Shah",
    bio: "Celebrating wins daily!",
    isPublic: true,
  },
  {
    email: "zeel.bhavsar@bacancy.com",
    password: "zeel123",
    username: "zeel_wins",
    displayName: "Zeel Bhavsar",
    bio: "Product designer who ships daily.",
    isPublic: true,
  },
  {
    email: "khushbu.kosti@bacancy.com",
    password: "khushbu123",
    username: "khushbu_codes",
    displayName: "Khushbu Koshti",
    bio: "Full-stack dev, streak enthusiast.",
    isPublic: true,
  },
  {
    email: "devarsh.shah@bacancy.com",
    password: "devarsh123",
    username: "devarsh_creates",
    displayName: "Devarsh Shah",
    bio: "Writer & creator. Tracking my creative wins.",
    isPublic: true,
  },
  {
    email: "surbhi.shah@bacancy.com",
    password: "surbhi123",
    username: "surbhi_builds",
    displayName: "Surbhi Shah",
    bio: "Building something new every day.",
    isPublic: true,
  },
];

const CATEGORIES = [
  { name: "Work", color: "#8b5cf6" },
  { name: "Health", color: "#10b981" },
  { name: "Learning", color: "#3b82f6" },
  { name: "Personal", color: "#f59e0b" },
  { name: "Creative", color: "#ec4899" },
  { name: "Fitness", color: "#ef4444" },
];

const DIFFICULTIES = ["easy", "medium", "hard", "epic"] as const;
const MOODS = ["great", "good", "okay", "tough"] as const;

const WIN_POOL: {
  title: string;
  description?: string;
  categoryHint: string;
  difficulty?: (typeof DIFFICULTIES)[number];
  tags?: string[];
}[] = [
  {
    title: "Finished Project Documentation",
    description: "Completed all API docs and updated the README.",
    categoryHint: "Work",
    difficulty: "hard",
    tags: ["docs", "dev"],
  },
  {
    title: "Went to the Gym",
    description: "45-minute strength training session.",
    categoryHint: "Fitness",
    difficulty: "medium",
    tags: ["workout"],
  },
  {
    title: "Completed Feature Implementation",
    description: "Shipped the new dashboard redesign to production.",
    categoryHint: "Work",
    difficulty: "epic",
    tags: ["shipping", "dev"],
  },
  {
    title: "Cooked a Healthy Dinner",
    description: "Made salmon with roasted vegetables.",
    categoryHint: "Health",
    difficulty: "easy",
    tags: ["cooking", "nutrition"],
  },
  {
    title: "Read 20 Pages of a Book",
    description: "Making progress on Atomic Habits.",
    categoryHint: "Learning",
    difficulty: "easy",
    tags: ["reading"],
  },
  {
    title: "Reviewed and Merged 3 PRs",
    description: "Thorough code reviews with helpful feedback.",
    categoryHint: "Work",
    difficulty: "medium",
    tags: ["code-review"],
  },
  {
    title: "Called a Friend",
    description: "Reconnected with an old college friend.",
    categoryHint: "Personal",
    difficulty: "easy",
    tags: ["social"],
  },
  {
    title: "Cleaned and Organized Workspace",
    description: "Decluttered desk and organized cables.",
    categoryHint: "Personal",
    difficulty: "easy",
    tags: ["organization"],
  },
  {
    title: "Completed Daily Meditation",
    description: "10 minutes of mindfulness meditation.",
    categoryHint: "Health",
    difficulty: "easy",
    tags: ["mindfulness"],
  },
  {
    title: "Drafted Weekly Goals",
    description: "Clear priorities set for the week ahead.",
    categoryHint: "Work",
    difficulty: "medium",
    tags: ["planning"],
  },
  {
    title: "Fixed a Tricky Bug",
    description: "Tracked down a race condition in the auth flow.",
    categoryHint: "Work",
    difficulty: "epic",
    tags: ["debugging", "dev"],
  },
  {
    title: "Wrote 500 Words for Blog Post",
    description: "Draft on TypeScript generics is coming together.",
    categoryHint: "Creative",
    difficulty: "medium",
    tags: ["writing", "blog"],
  },
  {
    title: "Took a 30-Minute Walk",
    description: "Fresh air and sunshine — perfect reset.",
    categoryHint: "Health",
    difficulty: "easy",
    tags: ["exercise"],
  },
  {
    title: "Prepared Weekly Team Update",
    description: "Summarized sprint progress and blockers.",
    categoryHint: "Work",
    difficulty: "medium",
    tags: ["communication"],
  },
  {
    title: "Learned Async Generators",
    description: "Deep dive into TypeScript async generators.",
    categoryHint: "Learning",
    difficulty: "hard",
    tags: ["typescript", "learning"],
  },
  {
    title: "Responded to All Backlogged Emails",
    description: "Inbox zero achieved!",
    categoryHint: "Work",
    difficulty: "medium",
    tags: ["email", "productivity"],
  },
  {
    title: "Completed Online Course Module",
    description: "Finished React Server Components module.",
    categoryHint: "Learning",
    difficulty: "hard",
    tags: ["course", "react"],
  },
  {
    title: "Organized Digital Files",
    description: "Cleaned up Downloads and organized projects.",
    categoryHint: "Personal",
    difficulty: "easy",
    tags: ["organization"],
  },
  {
    title: "Stretched and Did Mobility Work",
    description: "20 minutes of yoga and stretching.",
    categoryHint: "Fitness",
    difficulty: "easy",
    tags: ["yoga", "flexibility"],
  },
  {
    title: "Published a Blog Post",
    description: "Finally hit publish on the CSS Grid article.",
    categoryHint: "Creative",
    difficulty: "epic",
    tags: ["writing", "publishing"],
  },
  {
    title: "Ran 5K",
    description: "Personal best time — 24 minutes.",
    categoryHint: "Fitness",
    difficulty: "hard",
    tags: ["running", "cardio"],
  },
  {
    title: "Designed New Landing Page",
    description: "Wireframes and high-fidelity mockups done.",
    categoryHint: "Creative",
    difficulty: "hard",
    tags: ["design", "ui"],
  },
  {
    title: "Mentored a Junior Dev",
    description: "Pair programmed on their first feature.",
    categoryHint: "Work",
    difficulty: "medium",
    tags: ["mentoring"],
  },
  {
    title: "Set Up CI/CD Pipeline",
    description: "GitHub Actions for automated testing and deployment.",
    categoryHint: "Work",
    difficulty: "epic",
    tags: ["devops", "automation"],
  },
  {
    title: "Practiced Guitar for 30 Minutes",
    description: "Learning fingerpicking patterns.",
    categoryHint: "Creative",
    difficulty: "medium",
    tags: ["music", "practice"],
  },
  {
    title: "Meal Prepped for the Week",
    description: "5 lunches ready to go.",
    categoryHint: "Health",
    difficulty: "medium",
    tags: ["meal-prep", "nutrition"],
  },
  {
    title: "Had a Productive 1-on-1",
    description: "Great feedback session with manager.",
    categoryHint: "Work",
    difficulty: "easy",
    tags: ["career"],
  },
  {
    title: "Contributed to Open Source",
    description: "Submitted a PR to fix a documentation issue.",
    categoryHint: "Learning",
    difficulty: "medium",
    tags: ["open-source", "dev"],
  },
  {
    title: "Journaled About Gratitude",
    description: "Wrote about 3 things I'm grateful for.",
    categoryHint: "Personal",
    difficulty: "easy",
    tags: ["journaling"],
  },
  {
    title: "Deployed to Production",
    description: "Zero-downtime deployment with new features.",
    categoryHint: "Work",
    difficulty: "epic",
    tags: ["shipping", "devops"],
  },
];

const REFLECTIONS = [
  {
    content:
      "Today was incredibly productive. I managed to ship the feature I've been working on all week. Feeling accomplished!",
    mood: "great",
  },
  {
    content:
      "Solid day overall. Got most of my tasks done and had a good workout. Nothing extraordinary but consistent.",
    mood: "good",
  },
  {
    content:
      "A bit of a tough day. Debugging took longer than expected, but I learned a lot about the codebase.",
    mood: "okay",
  },
  {
    content:
      "Really challenging day. Multiple blockers and a production issue. But I pushed through and resolved everything.",
    mood: "tough",
  },
  {
    content:
      "Amazing day! Hit a new personal best on my run and then shipped a major feature. On fire!",
    mood: "great",
  },
  {
    content:
      "Good steady progress. Read a great article on system design and applied some ideas to our architecture.",
    mood: "good",
  },
  {
    content:
      "Decent day. Had some creative blocks with writing but the gym session cleared my head.",
    mood: "okay",
  },
];

const ACHIEVEMENT_KEYS = [
  "first_win",
  "wins_10",
  "wins_50",
  "streak_3",
  "streak_7",
  "streak_14",
  "epic_win",
  "five_in_day",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function pickWeighted<T>(arr: readonly T[], weights?: number[]): T {
  if (!weights) return pick([...arr]);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < arr.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return arr[i]!;
  }
  return arr[arr.length - 1]!;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function signInOrCreate(
  email: string,
  password: string,
): Promise<string> {
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (!signInError && signInData?.user?.id) {
    return signInData.user.id;
  }

  console.warn(`⚠️  Could not sign in ${email}: ${signInError?.message}`);
  return "";
}

async function seedUserData(
  userId: string,
  userConfig: (typeof DEMO_USERS)[number],
  categoryMap: Map<string, string>,
  daysOfData: number,
  winsPerDayRange: [number, number],
) {
  // Clean existing data
  await supabase.from("wins").delete().eq("user_id", userId);
  await supabase.from("streaks").delete().eq("user_id", userId);
  await supabase.from("daily_reflections").delete().eq("user_id", userId);
  await supabase.from("achievements").delete().eq("user_id", userId);
  await supabase.from("goals").delete().eq("user_id", userId);

  // Create profile
  await supabase.from("profiles").upsert({
    id: userId,
    username: userConfig.username,
    display_name: userConfig.displayName,
    bio: userConfig.bio,
    is_public: userConfig.isPublic,
  });

  // Generate wins
  const shuffledWins = shuffle(WIN_POOL);
  let winIdx = 0;
  const winRows: {
    user_id: string;
    title: string;
    description: string | null;
    date: string;
    category_id: string | null;
    difficulty: string | null;
    mood: string | null;
    tags: string[];
    pinned: boolean;
    sort_order: number;
  }[] = [];

  for (let daysAgo = daysOfData; daysAgo >= 0; daysAgo--) {
    // Skip some random days (15% chance) but never skip today
    if (daysAgo > 0 && Math.random() < 0.12) continue;

    const date = format(subDays(new Date(), daysAgo), "yyyy-MM-dd");
    const winsForDay =
      Math.floor(
        Math.random() * (winsPerDayRange[1] - winsPerDayRange[0] + 1),
      ) + winsPerDayRange[0];

    for (let i = 0; i < winsForDay; i++) {
      const win = shuffledWins[winIdx % shuffledWins.length]!;
      winIdx++;
      const catId = categoryMap.get(win.categoryHint) ?? null;

      winRows.push({
        user_id: userId,
        title: win.title,
        description: win.description ?? null,
        date,
        category_id: catId,
        difficulty: win.difficulty ?? pickWeighted(DIFFICULTIES, [3, 4, 2, 1]),
        mood: pickWeighted(MOODS, [3, 4, 2, 1]),
        tags: win.tags ?? [],
        pinned: Math.random() < 0.08, // ~8% pinned
        sort_order: i,
      });
    }
  }

  const { error: insertError } = await supabase.from("wins").insert(winRows);
  if (insertError) {
    console.error(
      `❌  Inserting wins for ${userConfig.email}:`,
      insertError.message,
    );
    return;
  }

  // Recalculate streak
  const { error: streakError } = await supabase.rpc("update_streak", {
    p_user_id: userId,
  });
  if (streakError)
    console.warn(
      `⚠️  Streak RPC for ${userConfig.email}:`,
      streakError.message,
    );

  // Seed achievements
  const totalWins = winRows.length;
  const achievementsToUnlock: string[] = [];
  if (totalWins >= 1) achievementsToUnlock.push("first_win");
  if (totalWins >= 10) achievementsToUnlock.push("wins_10");
  if (totalWins >= 50) achievementsToUnlock.push("wins_50");
  if (winRows.some((w) => w.difficulty === "epic"))
    achievementsToUnlock.push("epic_win");

  // Add some random streak/other achievements
  const extraAchievements = shuffle(
    ACHIEVEMENT_KEYS.filter((k) => !achievementsToUnlock.includes(k)),
  );
  achievementsToUnlock.push(
    ...extraAchievements.slice(0, Math.floor(Math.random() * 3) + 1),
  );

  if (achievementsToUnlock.length > 0) {
    await supabase.from("achievements").upsert(
      achievementsToUnlock.map((key) => ({
        user_id: userId,
        key,
        unlocked_at: new Date(
          Date.now() - Math.random() * 7 * 86400000,
        ).toISOString(),
      })),
      { onConflict: "user_id,key" },
    );
  }

  // Seed goals
  await supabase.from("goals").insert([
    {
      user_id: userId,
      title: "Log 50 Wins This Month",
      target_count: 50,
      current_count: Math.min(totalWins, 50),
      deadline: format(
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        "yyyy-MM-dd",
      ),
      completed: totalWins >= 50,
    },
    {
      user_id: userId,
      title: "Complete 5 Epic Wins",
      target_count: 5,
      current_count: Math.min(
        winRows.filter((w) => w.difficulty === "epic").length,
        5,
      ),
      deadline: null,
      completed: winRows.filter((w) => w.difficulty === "epic").length >= 5,
    },
    {
      user_id: userId,
      title: "Read 10 Books This Year",
      target_count: 10,
      current_count: Math.floor(Math.random() * 6) + 2,
      deadline: format(
        new Date(new Date().getFullYear(), 11, 31),
        "yyyy-MM-dd",
      ),
      completed: false,
    },
  ]);

  // Seed daily reflections (last 7 days)
  const reflectionRows = [];
  for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
    if (Math.random() < 0.3) continue; // skip some days
    const ref = pick(REFLECTIONS);
    reflectionRows.push({
      user_id: userId,
      date: format(subDays(new Date(), daysAgo), "yyyy-MM-dd"),
      content: ref.content,
      mood: ref.mood,
    });
  }
  if (reflectionRows.length > 0) {
    await supabase
      .from("daily_reflections")
      .upsert(reflectionRows, { onConflict: "user_id,date" });
  }

  console.log(
    `   ✅ ${userConfig.displayName}: ${winRows.length} wins, ${achievementsToUnlock.length} achievements, ${reflectionRows.length} reflections`,
  );
}

async function main() {
  console.log("🌱  Reverse Todo — Comprehensive Seed Script\n");

  // 1. Create categories for primary user
  console.log("📁  Setting up categories...");
  const primaryUserId = await signInOrCreate(SEED_EMAIL, SEED_PASSWORD);
  console.log(`✅  Primary user: ${SEED_EMAIL} (${primaryUserId})\n`);

  // Clean old categories for primary user
  await supabase.from("categories").delete().eq("user_id", primaryUserId);

  const { data: catData } = await supabase
    .from("categories")
    .insert(
      CATEGORIES.map((c) => ({
        user_id: primaryUserId,
        name: c.name,
        color: c.color,
      })),
    )
    .select();

  const categoryMap = new Map<string, string>();
  (catData ?? []).forEach((c: { name: string; id: string }) =>
    categoryMap.set(c.name, c.id),
  );
  console.log(`   Created ${categoryMap.size} categories\n`);

  // 2. Seed primary user with lots of data
  console.log("👤  Seeding primary user...");
  await seedUserData(primaryUserId, DEMO_USERS[0]!, categoryMap, 25, [2, 5]);

  // 3. Seed additional demo users for leaderboard
  console.log("\n👥  Seeding community users for leaderboard...");
  for (let i = 1; i < DEMO_USERS.length; i++) {
    const user = DEMO_USERS[i]!;
    console.log(`   Creating ${user.displayName}...`);
    const userId = await signInOrCreate(user.email, user.password);
    if (!userId) {
      console.log(`   ⏭️  Skipping ${user.displayName} (no user ID)`);
      continue;
    }

    // Create categories for each user, reuse same category names
    await supabase.from("categories").delete().eq("user_id", userId);
    const { data: userCats } = await supabase
      .from("categories")
      .insert(
        CATEGORIES.slice(0, 3 + Math.floor(Math.random() * 3)).map((c) => ({
          user_id: userId,
          name: c.name,
          color: c.color,
        })),
      )
      .select();

    const userCatMap = new Map<string, string>();
    (userCats ?? []).forEach((c: { name: string; id: string }) =>
      userCatMap.set(c.name, c.id),
    );

    // Each user gets varying amounts of data
    const daysOfData = 10 + Math.floor(Math.random() * 15);
    const winsRange: [number, number] = [1, 3 + Math.floor(Math.random() * 2)];
    await seedUserData(userId, user, userCatMap, daysOfData, winsRange);
  }

  // 4. Seed challenge participation
  console.log("\n🏆  Seeding challenge participation...");
  const { data: challenges } = await supabase
    .from("challenges")
    .select("id, target_count")
    .eq("is_active", true);

  if (challenges && challenges.length > 0) {
    // Sign back in as primary user
    await supabase.auth.signInWithPassword({
      email: SEED_EMAIL,
      password: SEED_PASSWORD,
    });

    for (const user of DEMO_USERS) {
      const userId = (
        await supabase.auth.signInWithPassword({
          email: user.email,
          password: user.password,
        })
      ).data?.user?.id;
      if (!userId) continue;

      // Each user joins 1-3 random challenges
      const userChallenges = shuffle(challenges).slice(
        0,
        Math.floor(Math.random() * 3) + 1,
      );
      for (const challenge of userChallenges) {
        const progress = Math.floor(
          Math.random() * (challenge.target_count + 2),
        );
        await supabase.from("challenge_participants").upsert(
          {
            challenge_id: challenge.id,
            user_id: userId,
            progress: Math.min(progress, challenge.target_count),
          },
          { onConflict: "challenge_id,user_id" },
        );
      }
      console.log(
        `   ${user.displayName} joined ${userChallenges.length} challenges`,
      );
    }
  }

  console.log("\n✨  Seed complete!");
  console.log(`   Primary user: ${SEED_EMAIL} / ${SEED_PASSWORD}`);
  console.log("   Open http://localhost:3000/login to sign in.");
  console.log("\n   Community users (all public profiles):");
  for (const user of DEMO_USERS.slice(1)) {
    console.log(
      `   - ${user.displayName} (@${user.username}): ${user.email} / ${user.password}`,
    );
  }
}

main().catch(console.error);
