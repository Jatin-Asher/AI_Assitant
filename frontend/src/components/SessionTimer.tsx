import { Timer } from "lucide-react";
import { formatSessionTime } from "../hooks/useSessionTimer";

type SessionTimerProps = {
  seconds: number;
};

export function SessionTimer({ seconds }: SessionTimerProps) {
  if (seconds <= 0) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm dark:border-violet-700/30 dark:bg-slate-900/85 dark:text-violet-100">
      <span className="h-2.5 w-2.5 rounded-full bg-violet-500 animate-pulse"></span>
      <Timer size={18} className="text-violet-700 dark:text-violet-300" />
      <span>{formatSessionTime(seconds)}</span>
    </div>
  );
}
