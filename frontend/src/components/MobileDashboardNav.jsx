"use client";

import {
  BarChart3,
  BookOpen,
  Layout,
  MessageSquare,
} from "lucide-react";

const ITEMS = [
  { id: "overview", label: "Dashboard", icon: Layout, href: "/dashboard/overview" },
  { id: "sessions", label: "Sessions", icon: MessageSquare, href: "/dashboard" },
  { id: "progress", label: "Analytics", icon: BarChart3, href: "/dashboard/progress" },
  { id: "settings", label: "Profile", icon: BookOpen, href: "/dashboard/settings" },
];

export default function MobileDashboardNav({ active, router }) {
  return (
    <div className="mb-6 rounded-[1.75rem] border border-white/70 bg-white/80 p-2 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 lg:hidden">
      <div className="grid grid-cols-2 gap-2">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => router.push(item.href)}
              className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-bold transition ${
                isActive
                  ? "bg-violet-600 text-white shadow-md shadow-violet-200 dark:shadow-none"
                  : "bg-slate-50 text-slate-600 hover:bg-violet-50 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
