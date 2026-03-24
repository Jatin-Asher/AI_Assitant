"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '../../../components/theme-toggle';

const API_BASE_URL = 'http://localhost:5000';
const STORAGE_KEY = 'socratic-session-history';

export default function TutorDashboardOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Learner');
  const [selectedSubject, setSelectedSubject] = useState('Physics');
  const [historyEntries, setHistoryEntries] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const initializePage = async () => {
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

        setUserName(data.user?.name || 'Learner');
        setHistoryEntries(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
        setLoading(false);
      } catch {
        localStorage.removeItem('token');
        router.replace('/login');
      }
    };

    void initializePage();
  }, [router]);

  const recentQuestionForSubject = useMemo(() => {
    return historyEntries.find((entry) => entry.subject === selectedSubject)?.recentQuestion
      || `Ask a new ${selectedSubject} question to start your next guided session.`;
  }, [historyEntries, selectedSubject]);

  const handleStartSession = () => {
    const params = new URLSearchParams({
      subject: selectedSubject,
      question: recentQuestionForSubject,
    });
    router.push(`/dashboard/session?${params.toString()}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-100 dark:bg-slate-950">
        <p className="text-lg text-slate-700 dark:text-slate-200">Loading tutor dashboard...</p>
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
              className="flex w-full items-center gap-3 rounded-2xl bg-violet-100 px-4 py-3 text-violet-900 dark:bg-violet-900/30 dark:text-violet-100"
            >
              <span className="material-symbols-outlined text-violet-700 dark:text-violet-300">dashboard</span>
              <span className="font-medium">Tutor Dashboard</span>
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/40"
            >
              <span className="material-symbols-outlined text-violet-700/80 dark:text-violet-300/80">chat</span>
              <span className="font-medium">My Sessions</span>
            </button>
            <button
              onClick={() => router.push('/dashboard/progress')}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/40"
            >
              <span className="material-symbols-outlined text-violet-700/80 dark:text-violet-300/80">monitoring</span>
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
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Welcome</p>
            <p className="mt-3 text-xl font-bold text-slate-900 dark:text-white">{userName}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Choose a subject here and launch a new guided learning session.
            </p>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-10">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-violet-700 dark:text-violet-300">Tutor Dashboard</p>
              <h1 className="text-4xl font-bold mt-2">Welcome {userName}</h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </div>

          <div className="grid gap-6 max-w-5xl">
            <section className="rounded-3xl border border-violet-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-3">Session Setup & Selection</h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Choose a subject, review the latest question, and launch a new guided learning session.
                  </p>
                </div>
                <button
                  onClick={handleStartSession}
                  className="whitespace-nowrap rounded-xl bg-violet-700 px-6 py-1 font-semibold text-white transition hover:bg-violet-800 dark:bg-violet-800 dark:hover:bg-violet-900"
                >
                  Start Session
                </button>
              </div>
              <div className="mt-8">
                <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">Subject</label>
                <div className="relative">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-4 pr-14 py-3 bg-violet-700 text-white rounded-lg border border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:border-violet-300 appearance-none cursor-pointer font-medium transition dark:bg-violet-800 dark:border-violet-700/80 dark:focus:ring-violet-500/60"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Math">Math</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex flex-col items-center justify-center text-violet-100/90">
                    <span className="material-symbols-outlined -mb-1 text-[18px]">keyboard_arrow_up</span>
                    <span className="material-symbols-outlined -mt-1 text-[18px]">keyboard_arrow_down</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-base font-bold mb-4 text-slate-800 dark:text-slate-200">Recent Chat Question</h3>
                <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6 dark:border-slate-700 dark:bg-slate-800/60">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-violet-200 rounded-lg flex items-center justify-center flex-shrink-0 dark:bg-violet-900/60">
                      <span className="material-symbols-outlined text-2xl text-violet-800 dark:text-violet-200">help</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg">Recent Chat Question</h4>
                      <p className="text-slate-600 dark:text-slate-400 mt-2">{recentQuestionForSubject}</p>
                    </div>
                    <span className="text-slate-500 text-xs uppercase tracking-[0.25em]">{selectedSubject}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-violet-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-2xl font-bold mb-3">What This Project Does</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Socratic AI Tutor is a chat-based learning platform where students choose a subject such as Physics, Chemistry, Math, or Biology and then ask a question. Instead of giving direct final answers, the AI responds with guiding questions, hints, and structured next steps to help students think through the problem on their own.
              </p>
            </section>

            <section className="rounded-3xl border border-violet-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-2xl font-bold mb-3">Why It Is Important</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Many AI tools solve problems too quickly, which can stop real learning. This project is important because it encourages reasoning, builds confidence, and supports deeper understanding. It is designed to act more like a thoughtful tutor than an answer machine.
              </p>
            </section>

            <section className="rounded-3xl border border-violet-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-2xl font-bold mb-3">How We Can Use It</h2>
              <div className="space-y-3 text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>1. Log in or register an account.</p>
                <p>2. Open Tutor Dashboard and select a subject.</p>
                <p>3. Start a session and ask your learning question.</p>
                <p>4. Use hint and follow-up actions to keep exploring the problem.</p>
                <p>5. Reopen recent sessions from history and continue learning where you left off.</p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
