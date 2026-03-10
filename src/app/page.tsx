"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  TrendingUp,
  Zap,
  BarChart3,
  ArrowRight,
  Flame,
  Star,
  Trophy,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const FEATURES = [
  {
    icon: CheckCircle2,
    title: "Log Your Wins",
    description:
      "Capture every accomplishment — big or small — in seconds. Build a record of your daily progress.",
  },
  {
    icon: Flame,
    title: "Streak Tracking",
    description:
      "Build daily momentum with streak tracking. Celebrate consistency and push your personal best.",
  },
  {
    icon: BarChart3,
    title: "Visual Analytics",
    description:
      "See your productivity patterns with beautiful charts, heatmaps, and weekly summaries.",
  },
  {
    icon: Zap,
    title: "Instant Motivation",
    description:
      "Get personalized messages based on what you've logged. Feel great about what you've achieved.",
  },
  {
    icon: TrendingUp,
    title: "Progress Over Time",
    description:
      "Watch your wins compound week over week. See how far you've come, not just how far you have to go.",
  },
  {
    icon: Trophy,
    title: "Celebrate Everything",
    description:
      "No win is too small. Cooked dinner? Logged it. Finished a report? Logged it. Every action matters.",
  },
];

const SAMPLE_WINS = [
  { title: "Finished project documentation", time: "2 min ago" },
  { title: "Went to the gym", time: "3h ago" },
  { title: "Completed feature implementation", time: "5h ago" },
  { title: "Read 20 pages", time: "Yesterday" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Star className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-foreground tracking-tight">
            Reverse Todo
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-lg transition-colors"
          >
            Get started
          </Link>
        </motion.div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 pt-20">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-purple-700/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-8"
          >
            <Flame className="w-3 h-3" />
            Track what you&apos;ve done, not what you haven&apos;t
          </motion.div>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6"
          >
            Track Your Wins.
            <br />
            <span className="gradient-text">Feel Productive</span>
            <br />
            Instantly.
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Instead of worrying about unfinished tasks, log what you&apos;ve
            already accomplished and build unstoppable momentum — one win at a
            time.
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <Link
              href="/signup"
              className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all duration-200 glow-violet hover:scale-[1.02]"
            >
              Start logging wins
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] text-foreground font-medium text-sm transition-all duration-200"
            >
              Sign in
            </Link>
          </motion.div>

          {/* Floating win cards */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-16 relative"
          >
            <div className="glass-card max-w-sm mx-auto p-4 text-left">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-muted-foreground font-medium">
                  Today&apos;s Wins
                </span>
                <span className="ml-auto text-xs text-violet-400 font-semibold">
                  4 logged
                </span>
              </div>
              <div className="space-y-2">
                {SAMPLE_WINS.map((win, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                      <span className="text-sm text-foreground/80">
                        {win.title}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {win.time}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
              Everything you need to{" "}
              <span className="gradient-text">feel momentum</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              A focused set of tools designed around one idea: celebrating what
              you&apos;ve already done.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-card p-6 group"
              >
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="glass-card p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-purple-700/5 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
                Start building your win streak today
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Free to use. No credit card required. Start logging your wins in
                under 30 seconds.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all duration-200 glow-violet hover:scale-[1.02]"
              >
                Get started for free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Star className="w-3 h-3 text-white" />
          </div>
          <span className="font-semibold text-sm text-foreground">
            Reverse Todo
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Track what you&apos;ve done, not what you haven&apos;t.
        </p>
      </footer>
    </div>
  );
}
