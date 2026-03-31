"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';
import { ThemeToggle } from '../../../components/theme-toggle';
import {
  BarChart3, 
  Play, 
  RotateCcw, 
  Trophy, 
  Flame, 
  Zap, 
  Clock, 
  Layout, 
  ChevronRight,
  BookOpen,
  AlertTriangle,
  PieChart,
  Target,
  FlaskConical,
  Atom,
  Calculator,
  Dna
} from 'lucide-react';

const STORAGE_KEY = 'socratic-session-history';
const ACTIVE_SESSION_KEY = 'socratic-active-session';

export default function TutorDashboardOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('Learner');
  const [userAvatar, setUserAvatar] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Physics');
  const [historyEntries, setHistoryEntries] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [stats, setStats] = useState({ totalSessions: 0, totalHours: 0, conceptsMastered: 0 });
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

        if (response.status === 401) {
          throw new Error('Unauthorized');
        }

        const data = await response.json();
        if (!response.ok) {
          setError(data.message || 'Unable to load your profile.');
          setLoading(false);
          return;
        }

        setUserName(data.user?.name || 'Learner');
        setUserAvatar(data.user?.avatarUrl || '');
        const progressResponse = await fetch(`${API_BASE_URL}/api/session/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!progressResponse.ok) {
          throw new Error('Unable to load session history.');
        }

        const progressData = await progressResponse.json();
        setHistoryEntries(progressData.sessions || []);
        if (progressData.stats) {
          setStats(progressData.stats);
        }
        setActiveSession(JSON.parse(localStorage.getItem(ACTIVE_SESSION_KEY) || 'null'));
        setLoading(false);
      } catch (err) {
        if (err.message === 'Unauthorized') {
          localStorage.removeItem('token');
          router.replace('/login');
        } else {
          setError('A network error occurred. Please check your connection and refresh.');
          setLoading(false);
        }
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

  const handleContinueSession = () => {
    if (activeSession) {
      const params = new URLSearchParams({
        subject: activeSession.subject,
        question: activeSession.question,
        session: activeSession.id,
      });
      router.push(`/dashboard/session?${params.toString()}`);
    }
  };

  if (error) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-100 dark:bg-slate-950">
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-3xl border border-violet-200 dark:border-violet-500/20 shadow-lg max-w-md">
          <AlertTriangle className="text-red-500 w-12 h-12 mb-4 mx-auto" />
          <p className="text-lg text-slate-700 dark:text-slate-200 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-violet-700 hover:bg-violet-800 text-white font-bold rounded-xl transition"
          >
            Retry Connection
          </button>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-100 dark:bg-slate-950">
        <p className="text-lg text-slate-700 dark:text-slate-200 font-medium animate-pulse">Loading tutor dashboard...</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-slate-50 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white transition-all">
      <div className="flex min-h-screen">
        {/* Fixed Width Sidebar (w-64) */}
        <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-slate-200 bg-white/80 backdrop-blur-md px-6 py-6 dark:border-slate-800 dark:bg-slate-950/80 z-20 hidden lg:flex flex-col">
          <button 
             onClick={() => router.push('/dashboard/overview')}
             className="mb-10 flex items-center gap-3 hover:opacity-80 transition cursor-pointer text-left"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-700 text-sm font-bold text-white shadow-lg shadow-violet-200 dark:bg-violet-800 dark:shadow-none">
              AI
            </div>
            <div>
              <p className="font-bold tracking-wide">Socratic</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">AI Tutor</p>
            </div>
          </button>

          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 opacity-70">Main Menu</p>
          <nav className="space-y-1.5 flex-1">
            <button
              onClick={() => router.push('/dashboard/overview')}
              className="flex w-full items-center gap-3 rounded-2xl bg-violet-600 px-4 py-3 text-white shadow-md shadow-violet-100 dark:shadow-none"
            >
              <Layout size={18} />
              <span className="font-semibold text-sm">Dashboard</span>
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-slate-500 transition hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-slate-800/40"
            >
              <RotateCcw size={18} />
              <span className="font-medium text-sm">Sessions</span>
            </button>
            <button
              onClick={() => router.push('/dashboard/progress')}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-slate-500 transition hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-slate-800/40"
            >
              <BarChart3 size={18} />
              <span className="font-medium text-sm">Analytics</span>
            </button>
            <button
              onClick={() => router.push('/dashboard/settings')}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-slate-500 transition hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-slate-800/40"
            >
              <BookOpen size={18} />
              <span className="font-medium text-sm">Profile</span>
            </button>
          </nav>

          <div className="mt-auto border-t border-slate-100 pt-6 dark:border-slate-800">
             <div className="rounded-2xl bg-violet-50 p-4 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-900/20">
               <div className="flex items-center gap-2 text-violet-700 dark:text-violet-400 mb-1">
                 <Flame size={16} className="fill-current" />
                 <span className="text-xs font-bold uppercase tracking-wider text-[10px]">Learning Streak</span>
               </div>
               <p className="text-xl font-black text-slate-900 dark:text-white">3 Days 🔥</p>
               <div className="mt-2 h-1.5 w-full bg-violet-200 dark:bg-violet-900/30 rounded-full overflow-hidden">
                 <div className="h-full w-3/5 bg-violet-600 rounded-full" />
               </div>
             </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 p-4 md:p-8 transition-all">
          <div className="max-w-[1400px] mx-auto space-y-8">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-2 py-0.5 rounded-md">
                    Student Space
                  </p>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Welcome back, {userName.split(' ')[0]}!
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <div className="h-10 w-10 rounded-full overflow-hidden bg-violet-600 flex items-center justify-center text-white font-bold shadow-lg shadow-violet-200 dark:shadow-none border-2 border-white dark:border-slate-800">
                  {userAvatar ? (
                    <img 
                      src={userAvatar.startsWith('http') ? userAvatar : `${API_BASE_URL}${userAvatar}`} 
                      alt={userName} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    userName[0]
                  )}
                </div>
              </div>
            </header>

            {/* Grid Layout (12 Columns) */}
            <div className="grid grid-cols-12 gap-6">
              
              {/* LEFT COLUMN (col-span-8) */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                
                {/* Session Setup Card */}
                <section className="group relative overflow-hidden rounded-3xl border border-white bg-white/60 p-8 shadow-sm backdrop-blur-xl transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60">
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Session Setup</h2>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
                        Choose your focus subject and launch a guided session to master new concepts.
                      </p>
                    </div>
                    <button
                      onClick={handleStartSession}
                      className="flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-violet-700 px-8 py-4 font-bold text-white transition hover:bg-violet-800 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-violet-200 dark:shadow-none"
                    >
                      <Play size={18} fill="currentColor" />
                      Start Learning
                    </button>
                  </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {['Physics', 'Chemistry', 'Mathematics', 'Biology'].map((subject) => {
              const icons = {
                Physics: <Atom size={24} className={selectedSubject === 'Physics' ? "text-violet-600" : "text-slate-400"} />,
                Chemistry: <FlaskConical size={24} className={selectedSubject === 'Chemistry' ? "text-violet-600" : "text-slate-400"} />,
                Mathematics: <Calculator size={24} className={selectedSubject === 'Mathematics' ? "text-violet-600" : "text-slate-400"} />,
                Biology: <Dna size={24} className={selectedSubject === 'Biology' ? "text-violet-600" : "text-slate-400"} />
              };
              
              return (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`group flex flex-col items-center gap-4 rounded-[2rem] border p-6 transition-all duration-300 ${
                    selectedSubject === subject
                      ? 'border-violet-600 bg-violet-50/80 shadow-lg shadow-violet-100 dark:bg-violet-900/30 dark:shadow-none translate-y-[-4px]'
                      : 'border-slate-100 bg-white/80 hover:border-violet-200 hover:bg-violet-50/30 dark:border-slate-800 dark:bg-slate-800/40'
                  }`}
                >
                  <div className={`p-4 rounded-2xl transition-all duration-300 ${
                    selectedSubject === subject 
                      ? 'bg-white shadow-sm dark:bg-slate-800 scale-110' 
                      : 'bg-slate-50 dark:bg-slate-900 group-hover:bg-white'
                  }`}>
                    {icons[subject]}
                  </div>
                  <span className={`font-bold text-sm tracking-tight ${
                    selectedSubject === subject ? 'text-violet-700 dark:text-violet-400' : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {subject}
                  </span>
                  {selectedSubject === subject && (
                    <div className="h-1.5 w-6 rounded-full bg-violet-600 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
                </section>

                {/* Recent Chat Section */}
                <section className="rounded-3xl border border-white bg-white/40 p-1 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/30 overflow-hidden">
                  <div className="p-6 pb-2">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <RotateCcw size={18} className="text-violet-600" />
                      Recent Context
                    </h3>
                  </div>
                  <div className="m-4 rounded-2xl border border-violet-100 bg-white/70 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/60 backdrop-blur-md">
                    <div className="flex items-start gap-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400">
                        <Zap size={24} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-sm">Last Message Preview</h4>
                          <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-2 py-0.5 rounded uppercase">
                            {selectedSubject}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm italic leading-relaxed pt-1">
                          "{recentQuestionForSubject}"
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN (col-span-4) */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                
                {/* Quick Actions Card */}
                <section className="rounded-3xl border border-white bg-white/60 p-6 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                    <Zap size={20} className="text-amber-500 fill-amber-500" />
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button 
                      onClick={handleStartSession}
                      className="group flex w-full items-center justify-between rounded-2xl bg-slate-50 p-4 transition-all hover:bg-violet-50 dark:bg-slate-800/40 dark:hover:bg-violet-900/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-white p-2 shadow-sm dark:bg-slate-800 group-hover:text-violet-600">
                          <Play size={16} />
                        </div>
                        <span className="font-bold text-sm text-slate-700 dark:text-slate-300">Start New Session</span>
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-violet-600" />
                    </button>

                    {activeSession && (
                      <button 
                        onClick={handleContinueSession}
                        className="group flex w-full items-center justify-between rounded-2xl bg-violet-600 p-4 text-white shadow-lg shadow-violet-200 dark:shadow-none transition-transform hover:scale-[1.02]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-white/20 p-2">
                            <RotateCcw size={16} />
                          </div>
                          <span className="font-bold text-sm">Continue Session</span>
                        </div>
                        <ChevronRight size={16} className="text-white/70" />
                      </button>
                    )}

                    <button className="group flex w-full items-center justify-between rounded-2xl bg-slate-50 p-4 transition-all hover:bg-violet-50 dark:bg-slate-800/40 dark:hover:bg-violet-900/20 opacity-60">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-white p-2 shadow-sm dark:bg-slate-800">
                          <Trophy size={16} />
                        </div>
                        <span className="font-bold text-sm text-slate-700 dark:text-slate-300">Practice Mode</span>
                      </div>
                      <span className="text-[10px] font-black uppercase text-slate-400">Coming Soon</span>
                    </button>
                  </div>
                </section>

                {/* Mini Analytics Card */}
                <section className="rounded-3xl border border-white bg-white/60 p-6 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                    <BarChart3 size={20} className="text-violet-600" />
                    Insights
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/40">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Completed</p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalSessions}</p>
                      <p className="text-[10px] text-slate-500 font-medium">Sessions</p>
                    </div>
                    <div className="space-y-1 rounded-2xl bg-amber-50 p-4 dark:bg-amber-900/10">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Mastery</p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.conceptsMastered}</p>
                      <p className="text-[10px] text-slate-500 font-medium">Concepts</p>
                    </div>
                    <div className="col-span-2 flex items-center justify-between rounded-2xl bg-violet-600 p-4 text-white">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-white/20 p-2">
                           <Clock size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">Total Time</p>
                          <p className="text-lg font-black">{stats.totalHours}h Studied</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Learning Tips Card */}
                <section className="rounded-3xl border border-slate-200/50 bg-white/40 p-6 dark:border-slate-800 dark:bg-slate-950/30">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-amber-100 p-2 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">Study Tip of the Day</h4>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Space your sessions out! Studying for 20 minutes daily is more effective than a 3-hour marathon.
                      </p>
                    </div>
                  </div>
                </section>

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
