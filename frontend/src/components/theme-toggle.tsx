"use client";

import { useTheme } from "next-themes";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-violet-300/70 bg-white/80 text-violet-900 shadow-sm transition hover:bg-violet-50 dark:border-violet-700/60 dark:bg-slate-900/80 dark:text-violet-200 dark:hover:bg-slate-800 ${className}`}
      type="button"
      aria-label="Toggle theme"
    >
      <span className="material-symbols-outlined">
        {resolvedTheme === "dark" ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}
