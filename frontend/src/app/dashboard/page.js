"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';
import { ThemeToggle } from '../../components/theme-toggle';

const STORAGE_KEY = 'socratic-session-history';
const ACTIVE_SESSION_KEY = 'socratic-active-session';

const formatTimestamp = (value) =>
  new Date(value).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('Physics');
  const [historyEntries, setHistoryEntries] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [userName, setUserName] = useState('Learner');
  const [activeSession, setActiveSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const initializeDashboard = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        router.replace('/login');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load your profile.');
        }

        if (data.user?.name) {
          setUserName(data.user.name);
        }

        const storedHistory = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const storedActiveSession = JSON.parse(localStorage.getItem(ACTIVE_SESSION_KEY) || 'null');
        setHistoryEntries(storedHistory);
        setActiveSession(storedActiveSession);
        setLoading(false);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        router.replace('/login');
      }
    };

    void initializeDashboard();

    const handleProtectedBackNavigation = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      router.replace('/login');
    };

    window.history.pushState({ dashboardGuard: true }, '', window.location.href);
    window.addEventListener('popstate', handleProtectedBackNavigation);

    return () => {
      window.removeEventListener('popstate', handleProtectedBackNavigation);
    };
  }, [router]);

  const recentQuestionForSubject = useMemo(() => {
    return historyEntries.find((entry) => entry.subject === selectedSubject)?.recentQuestion
      || `Ask a new ${selectedSubject} question to start your next guided session.`;
  }, [historyEntries, selectedSubject]);

  const openActiveSession = () => {
    if (!activeSession) {
      return;
    }

    const params = new URLSearchParams({
      subject: activeSession.subject,
      question: activeSession.question,
      session: activeSession.id,
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

  const handleDeleteConversation = (entryId) => {
    const nextHistory = historyEntries.filter((entry) => entry.id !== entryId);
    setHistoryEntries(nextHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistory));
    setMenuOpenId(null);
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
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-700 text-sm font-bold text-white dark:bg-violet-800">
            AI
          </div>
          <div>
            <p className="font-bold tracking-wide">Socratic</p>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">AI Tutor</p>
          </div>
        </div>

        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">Main Menu</p>
        <nav className="space-y-3 flex-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-violet-100 text-violet-900 cursor-pointer dark:bg-slate-800/50 dark:text-slate-200">
            <span className="material-symbols-outlined text-violet-700 dark:text-violet-300">chat</span>
            <span className="text-sm font-medium">My Sessions</span>
          </button>
          <button
            onClick={() => router.push('/dashboard/overview')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition text-slate-500 cursor-pointer dark:hover:bg-slate-800/30 dark:text-slate-400"
          >
            <span className="material-symbols-outlined text-violet-700/80 dark:text-violet-300/80">dashboard</span>
            <span className="text-sm font-medium">Tutor Dashboard</span>
          </button>
          <button
            onClick={() => router.push('/dashboard/progress')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition text-slate-500 cursor-pointer dark:hover:bg-slate-800/30 dark:text-slate-400"
          >
            <span className="material-symbols-outlined text-violet-700/80 dark:text-violet-300/80">monitoring</span>
            <span className="text-sm font-medium">Learning Progress</span>
          </button>
          <button
            onClick={() => router.push('/dashboard/settings')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition text-slate-500 cursor-pointer dark:hover:bg-slate-800/30 dark:text-slate-400"
          >
            <span className="material-symbols-outlined text-violet-700/80 dark:text-violet-300/80">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </button>
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
                <div
                  key={entry.id}
                  className="relative rounded-lg bg-slate-100 p-2.5 transition dark:bg-slate-800/40"
                >
                  <button
                    onClick={() => openHistorySession(entry)}
                    className="w-full text-left hover:bg-violet-100 dark:hover:bg-slate-800/70 rounded-md transition pr-9"
                  >
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{entry.subject}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">{formatTimestamp(entry.updatedAt)}</p>
                    <p className="text-xs text-slate-500 truncate dark:text-slate-400">{entry.recentQuestion || entry.preview}</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMenuOpenId((current) => (current === entry.id ? null : entry.id))}
                    className="absolute right-2 top-2 rounded-full p-1 text-slate-500 transition hover:bg-violet-100 hover:text-violet-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-violet-200"
                    aria-label="Open conversation actions"
                  >
                    <span className="material-symbols-outlined text-base">more_vert</span>
                  </button>
                  {menuOpenId === entry.id && (
                    <div className="absolute right-2 top-10 z-10 rounded-xl border border-violet-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                      <button
                        type="button"
                        onClick={() => handleDeleteConversation(entry.id)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
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

        <div className="flex-1 p-8">
          <div className="w-full max-w-3xl">
            <div className="mb-2">
              <h2 className="text-4xl font-bold mb-1">Welcome {userName}</h2>
              <p className="text-slate-500 text-lg dark:text-slate-400">Review and continue your active study sessions.</p>
            </div>

            <div className="bg-white/80 border border-violet-200 rounded-2xl p-8 mt-8 shadow-sm dark:bg-slate-800/60 dark:border-slate-700">
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-xl font-bold">Active Sessions</h3>
              </div>

              {activeSession ? (
                <div className="space-y-6">
                  <div
                    onClick={openActiveSession}
                    className="cursor-pointer rounded-2xl border border-violet-200 bg-violet-50 p-6 transition hover:border-violet-300 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-violet-500/40"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.25em] text-violet-700 dark:text-violet-300">Current Session</p>
                        <h4 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{activeSession.subject}</h4>
                        <p className="mt-3 text-slate-600 dark:text-slate-400">{activeSession.question || recentQuestionForSubject}</p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                        Active
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={openActiveSession}
                    className="px-6 py-3 bg-violet-700 hover:bg-violet-800 dark:bg-violet-800 dark:hover:bg-violet-900 text-white font-semibold rounded-lg transition"
                  >
                    Continue Active Session
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-violet-300 bg-violet-50/70 p-8 text-center dark:border-violet-700/40 dark:bg-slate-900/40">
                  <p className="text-xl font-bold text-slate-900 dark:text-white">No active session right now</p>
                  <p className="mt-3 text-slate-600 dark:text-slate-400">
                    Start a new guided study session from Tutor Dashboard and it will appear here.
                  </p>
                  <button
                    onClick={() => router.push('/dashboard/overview')}
                    className="mt-6 rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white transition hover:bg-violet-800 dark:bg-violet-800 dark:hover:bg-violet-900"
                  >
                    Click here to create a session
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
