"use client";

type FocusModeToggleProps = {
  isActive: boolean;
  onToggle: () => void;
};

export function FocusModeToggle({ isActive, onToggle }: FocusModeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title="Stay focused by hiding distractions"
      aria-pressed={isActive}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
        isActive
          ? "border-violet-700 bg-violet-700 text-white shadow-[0_12px_30px_rgba(109,40,217,0.22)]"
          : "border-violet-200 bg-white/90 text-violet-900 hover:bg-violet-50 dark:border-violet-700/30 dark:bg-slate-900/85 dark:text-violet-100 dark:hover:bg-slate-800"
      }`}
    >
      <span className="material-symbols-outlined text-[18px]">center_focus_strong</span>
      <span>Focus Mode</span>
    </button>
  );
}
