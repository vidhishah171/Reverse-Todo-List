"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, RefreshCw } from "lucide-react";

const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "Progress, not perfection.", author: "Unknown" },
  { text: "What you do every day matters more than what you do once in a while.", author: "Gretchen Rubin" },
  { text: "A year from now you will wish you had started today.", author: "Karen Lamb" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Celebrate what you've accomplished, but raise the bar a little higher each time.", author: "Mia Hamm" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
  { text: "Every accomplishment starts with the decision to try.", author: "John F. Kennedy" },
  { text: "What we achieve inwardly will change outer reality.", author: "Plutarch" },
];

function getQuoteOfDay() {
  const today = new Date();
  const dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % QUOTES.length;
  return QUOTES[dayIndex];
}

export function MotivationalQuote() {
  const [quote, setQuote] = useState(getQuoteOfDay());
  const [key, setKey] = useState(0);

  useEffect(() => {
    setQuote(getQuoteOfDay());
  }, []);

  const shuffle = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    setQuote(QUOTES[randomIndex]);
    setKey((prev) => prev + 1);
  }, []);

  return (
    <div className="glass-card p-5 relative overflow-hidden group">
      <div className="absolute top-3 right-3">
        <button
          onClick={shuffle}
          className="p-1.5 rounded-lg text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/50 transition-all opacity-0 group-hover:opacity-100"
          aria-label="Show another quote"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex gap-3">
        <div className="shrink-0 mt-0.5">
          <Quote className="w-4 h-4 text-violet-500 dark:text-violet-400" />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-foreground/80 italic leading-relaxed">
              &ldquo;{quote.text}&rdquo;
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              — {quote.author}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
