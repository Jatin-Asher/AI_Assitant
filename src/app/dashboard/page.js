"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '../../components/theme-toggle';

const STORAGE_KEY = 'socratic-session-history';

const formatTimestamp = (value) =>
  new Date(value).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('Physics');
  const [historyEntries, setHistoryEntries] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/login');
      return;
    }

    const storedHistory = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    setHistoryEntries(storedHistory);
    setLoading(false);
  }, [router]);

  const recentQuestionForSubject = useMemo(() => {
    return historyEntries.find((entry) => entry.subject === selectedSubject)?.recentQuestion
      || `Ask a new ${selectedSubject} question to start your next guided session.`;
  }, [historyEntries, selectedSubject]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleStartSession = () => {
    const params = new URLSearchParams({
      subject: selectedSubject,
      question: recentQuestionForSubject,
    });
    router.push(`/dashboard/session?${params.toString()}`);
  };

  const openHistorySession = (entry) => {
    const params = new URLSearchParams({
      subject: entry.subject,
      question: entry.recentQuestion || entry.preview,
      session: entry.id,
    });
    router.push(`/dashboard/session?${params.toString()}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-100 dark:bg-slate-950">
        <p className="text-lg text-slate-700 dark:text-slate-200">Loading...</p>
      </main>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white transition-colors">
      <aside className="w-64 border-r border-slate-200 bg-white p-6 flex flex-col overflow-y-auto dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-8 flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-700 dark:bg-violet-800 rounded-lg flex items-center justify-center text-sm font-bold text-white">
            AI
          </div>
          <span className="font-bold text-xs uppercase tracking-wider">Tutor</span>
        </div>

        <nav className="space-y-3 flex-1">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-violet-100 text-violet-900 cursor-pointer dark:bg-slate-800/50 dark:text-slate-200">
            <span className="material-symbols-outlined text-violet-700 dark:text-violet-300">chat</span>
            <span className="text-sm font-medium">My Sessions</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition text-slate-500 cursor-pointer dark:hover:bg-slate-800/30 dark:text-slate-400">
            <span className="material-symbols-outlined text-violet-700/80 dark:text-violet-300/80">menu_book</span>
            <span className="text-sm font-medium">Topic Library</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition text-slate-500 cursor-pointer dark:hover:bg-slate-800/30 dark:text-slate-400">
            <span className="material-symbols-outlined text-violet-700/80 dark:text-violet-300/80">dashboard</span>
            <span className="text-sm font-medium">Tutor Dashboard</span>
          </div>
        </nav>

        <div className="border-t border-slate-200 pt-4 mt-4 dark:border-slate-800">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-3 px-1">Recently Asked Questions</p>
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {historyEntries.length === 0 ? (
              <div className="p-3 rounded-lg bg-slate-100 text-xs text-slate-500 dark:bg-slate-800/30 dark:text-slate-400">
                No recent chats yet.
              </div>
            ) : (
              historyEntries.slice(0, 4).map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => openHistorySession(entry)}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-100 hover:bg-violet-100 transition dark:bg-slate-800/40 dark:hover:bg-slate-800/70"
                >
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{entry.subject}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">{formatTimestamp(entry.updatedAt)}</p>
                  <p className="text-xs text-slate-500 truncate dark:text-slate-400">{entry.recentQuestion || entry.preview}</p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4 mt-4 dark:border-slate-800">
          <p className="text-xs text-slate-500 mb-3">v1.4 • Premium Subscription Active</p>
          <button
            onClick={handleLogout}
            className="w-full py-2 text-xs font-medium bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition dark:bg-red-600/20 dark:hover:bg-red-600/30 dark:text-red-400"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-gradient-to-br from-violet-50 via-white to-slate-100 flex flex-col dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors">
        <div className="border-b border-slate-200 p-6 flex justify-between items-center bg-white/70 dark:border-slate-800 dark:bg-slate-950/40">
          <h1 className="text-2xl font-bold">Start Session</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button className="text-slate-500 hover:text-slate-700 transition dark:text-slate-400 dark:hover:text-slate-300">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-3xl">
            <div className="mb-2">
              <h2 className="text-4xl font-bold mb-1">Welcome to Socratic AI Tutor</h2>
              <p className="text-slate-500 text-lg dark:text-slate-400">Start a New Learning Session</p>
            </div>

            <div className="bg-white/80 border border-violet-200 rounded-2xl p-8 mt-8 shadow-sm dark:bg-slate-800/60 dark:border-slate-700">
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-xl font-bold">Session Setup & Selection</h3>
                <button
                  onClick={handleStartSession}
                  className="px-6 py-2 bg-violet-700 hover:bg-violet-800 dark:bg-violet-800 dark:hover:bg-violet-900 text-white font-semibold rounded-lg transition"
                >
                  Start Session Now
                </button>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-2 bg-violet-700 text-white rounded-lg border border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:border-violet-300 appearance-none cursor-pointer font-medium transition dark:bg-violet-800 dark:border-violet-700/80 dark:focus:ring-violet-500/60"
                >
                  <option value="Physics">Physics</option>
                  <option value="Math">Math</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>

              <div className="mb-8">
                <h4 className="text-base font-bold mb-4 text-slate-800 dark:text-slate-200">Recent Chat Question</h4>
                <div className="bg-violet-50 border border-violet-200 rounded-xl p-6 flex items-start gap-4 hover:border-violet-300 transition cursor-pointer dark:bg-slate-900/40 dark:border-slate-600 dark:hover:border-slate-500">
                  <div className="w-14 h-14 bg-violet-200 rounded-lg flex items-center justify-center flex-shrink-0 dark:bg-violet-900/60">
                    <span className="material-symbols-outlined text-2xl text-violet-800 dark:text-violet-200">help</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-slate-900 dark:text-white text-lg">Recent Chat Question</h5>
                    <p className="text-slate-600 dark:text-slate-400">{recentQuestionForSubject}</p>
                  </div>
                  <span className="text-slate-500 text-xs uppercase tracking-[0.25em]">{selectedSubject}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
