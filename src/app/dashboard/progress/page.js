"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '../../../components/theme-toggle';

const API_BASE_URL = 'http://localhost:5000';

const formatRecentTime = (value) =>
  new Date(value).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  });

export default function ProgressPage() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Learner');
  const [goalInput, setGoalInput] = useState('17');
  const [goalSaving, setGoalSaving] = useState(false);
  const [goalPopup, setGoalPopup] = useState({ visible: false, message: '', isError: false });
  const [progress, setProgress] = useState({
    summary: {
      totalSessions: 0,
      weeklyGoal: '0/17h',
      weeklyGoalHours: 17,
      conceptsMastered: 0,
      focusStreak: '0 Days',
    },
    studyHours: [],
    subjectMastery: [],
    insight: '',
    recentSessions: [],
  });
  const router = useRouter();

  useEffect(() => {
    const loadProgress = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/login');
        return;
      }

      try {
        const [profileResponse, progressResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/api/session/progress`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const profileData = await profileResponse.json();
        const progressData = await progressResponse.json();

        if (!profileResponse.ok || !progressResponse.ok) {
          throw new Error(profileData.message || progressData.message || 'Unable to load progress.');
        }

        setUserName(profileData.user?.name || 'Learner');
        setProgress(progressData);
        setGoalInput(String(progressData.summary?.weeklyGoalHours || 17));
        setLoading(false);
      } catch {
        localStorage.removeItem('token');
        router.replace('/login');
      }
    };

    void loadProgress();
  }, [router]);

  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const parsedGoal = Number(goalInput);

    if (!token || Number.isNaN(parsedGoal) || parsedGoal <= 0) {
      setGoalPopup({ visible: true, message: 'Enter a valid weekly goal in hours.', isError: true });
      window.setTimeout(() => {
        setGoalPopup({ visible: false, message: '', isError: false });
      }, 5000);
      return;
    }

    setGoalSaving(true);
    setGoalPopup({ visible: false, message: '', isError: false });

    try {
      const response = await fetch(`${API_BASE_URL}/api/session/goal`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          weeklyGoalHours: parsedGoal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update weekly goal.');
      }

      setProgress((prev) => {
        const currentHours = Number(prev.summary.weeklyGoal.split('/')[0] || 0);
        return {
          ...prev,
          summary: {
            ...prev.summary,
            weeklyGoalHours: data.weeklyGoalHours,
            weeklyGoal: `${currentHours.toFixed(1)}/${data.weeklyGoalHours}h`,
          },
        };
      });
      setGoalPopup({ visible: true, message: 'Weekly goal updated successfully.', isError: false });
      window.setTimeout(() => {
        setGoalPopup({ visible: false, message: '', isError: false });
      }, 5000);
    } catch (error) {
      setGoalPopup({ visible: true, message: error.message || 'Unable to update weekly goal.', isError: true });
      window.setTimeout(() => {
        setGoalPopup({ visible: false, message: '', isError: false });
      }, 5000);
    } finally {
      setGoalSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-100 dark:bg-slate-950">
        <p className="text-lg text-slate-700 dark:text-slate-200">Loading progress...</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="flex min-h-screen">
        <aside className="w-72 border-r border-slate-200 bg-white px-6 py-6 dark:border-slate-800 dark:bg-slate-950">
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
          <nav className="space-y-2">
            <button
              onClick={() => router.push('/dashboard/overview')}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/40"
            >
              <span className="material-symbols-outlined text-violet-700/80 dark:text-violet-300/80">dashboard</span>
              <span className="font-medium">Tutor Dashboard</span>
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/40"
            >
              <span className="material-symbols-outlined text-violet-700/80 dark:text-violet-300/80">chat</span>
              <span className="font-medium">My Sessions</span>
            </button>
            <button className="flex w-full items-center gap-3 rounded-2xl bg-violet-100 px-4 py-3 text-violet-900 dark:bg-violet-900/30 dark:text-violet-100">
              <span className="material-symbols-outlined text-violet-700 dark:text-violet-300">monitoring</span>
              <span className="font-medium">Learning Progress</span>
            </button>
            <button
              onClick={() => router.push('/dashboard/settings')}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/40"
            >
              <span className="material-symbols-outlined text-violet-700/80 dark:text-violet-300/80">settings</span>
              <span className="font-medium">User Settings</span>
            </button>
          </nav>

          <div className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Recently Asked</p>
            <div className="mt-4 space-y-3">
              {progress.recentSessions.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No recent activity yet.</p>
              ) : (
                progress.recentSessions.map((session) => (
                  <div key={session._id || session.sessionId} className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-800">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-slate-800 dark:text-slate-100">{session.subject}</p>
                      <span className="text-xs text-slate-400">{formatRecentTime(session.updatedAt)}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{session.recentQuestion || session.preview}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-[radial-gradient(circle_at_top_left,_rgba(196,181,253,0.16),_transparent_20%),linear-gradient(180deg,_#faf5ff_0%,_#f8fafc_55%,_#ffffff_100%)] px-6 py-6 dark:bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.14),_transparent_20%),linear-gradient(180deg,_#090b17_0%,_#101426_55%,_#090d1b_100%)]">
          {goalPopup.visible && (
            <div className="fixed right-6 top-6 z-50">
              <div className={`rounded-2xl px-5 py-4 text-sm font-semibold shadow-[0_20px_60px_rgba(15,23,42,0.25)] backdrop-blur-xl ${goalPopup.isError ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                {goalPopup.message}
              </div>
            </div>
          )}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-violet-600 dark:text-violet-300">Learning Progress</p>
              <h1 className="mt-2 text-3xl font-bold">Welcome back, {userName}</h1>
            </div>
            <ThemeToggle />
          </div>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Total Sessions</p>
              <p className="mt-3 text-3xl font-bold">{progress.summary.totalSessions}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Weekly Goal</p>
              <p className="mt-3 text-3xl font-bold">{progress.summary.weeklyGoal}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Concepts Mastered</p>
              <p className="mt-3 text-3xl font-bold">{progress.summary.conceptsMastered}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Focus Streak</p>
              <p className="mt-3 text-3xl font-bold">{progress.summary.focusStreak}</p>
            </div>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-bold">Study Hours</h2>
              <div className="mt-8 grid grid-cols-7 gap-3">
                {progress.studyHours.map((entry) => (
                  <div key={entry.label} className="flex flex-col items-center gap-3">
                    <div className="flex h-48 w-full items-end rounded-3xl bg-slate-100 p-2 dark:bg-slate-800">
                      <div
                        className="w-full rounded-2xl bg-gradient-to-t from-violet-700 to-fuchsia-400 transition-all"
                        style={{ height: `${Math.max(12, entry.hours * 36)}px` }}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{entry.label}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">{entry.hours}h</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-bold">Subject Mastery</h2>
              <div className="mt-8 space-y-5">
                {progress.subjectMastery.map((entry) => (
                  <div key={entry.subject}>
                    <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                      <span>{entry.subject}</span>
                      <span>{entry.mastery}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-400"
                        style={{ width: `${entry.mastery}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-[2rem] bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2),_transparent_28%),linear-gradient(135deg,_#7c3aed_0%,_#c026d3_100%)] p-8 text-white shadow-[0_24px_80px_rgba(168,85,247,0.28)]">
            <p className="text-sm uppercase tracking-[0.25em] text-white/70">Socratic Insight</p>
            <h2 className="mt-3 text-3xl font-bold">You&apos;re building momentum.</h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/90">{progress.insight}</p>
            <form onSubmit={handleGoalSubmit} className="mt-6 flex flex-col gap-4 md:max-w-sm">
              <label className="text-sm font-semibold text-white/85">
                Set new study goal
              </label>
              <div className="flex items-center overflow-hidden rounded-2xl border border-white/25 bg-white/95 shadow-sm">
                <input
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Weekly goal in hours"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-violet-900 outline-none"
                />
                <button
                  type="submit"
                  disabled={goalSaving}
                  className="m-1 rounded-xl bg-violet-700 px-5 py-2.5 font-semibold text-white transition hover:bg-violet-800 disabled:opacity-60"
                >
                  {goalSaving ? 'Saving...' : 'Set Goal'}
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
