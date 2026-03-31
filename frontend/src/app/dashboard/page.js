"use client";
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';
import { ThemeToggle } from '../../components/theme-toggle';
import { 
  Play, 
  RotateCcw, 
  Zap, 
  Clock, 
  Layout, 
  ChevronRight,
  BarChart3,
  BookOpen,
  History,
  Activity,
  AlertTriangle,
  MoreVertical,
  Trash2,
  Trophy
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5001';
const STORAGE_KEY = 'socratic-session-history';
const ACTIVE_SESSION_KEY = 'socratic-active-session';

const formatTimestamp = (value) =>
  new Date(value).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('Physics');
  const [historyEntries, setHistoryEntries] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [userName, setUserName] = useState('Learner');
  const [userAvatar, setUserAvatar] = useState('');
  const [activeSession, setActiveSession] = useState(null);
  const [stats, setStats] = useState({ totalSessions: 0, totalHours: 0, conceptsMastered: 0 });
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

        if (response.status === 401) {
          throw new Error('Unauthorized');
        }

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Unable to load your profile.');
          setLoading(false);
          return;
        }

        if (data.user?.name) {
          setUserName(data.user.name);
        }
        if (data.user?.avatarUrl) {
          setUserAvatar(data.user.avatarUrl);
        }

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
          localStorage.removeItem('userName');
          localStorage.removeItem('userEmail');
          router.replace('/login');
        } else {
          setError('A network error occurred. Please check your connection and refresh.');
          setLoading(false);
        }
      }
    };

    void initializeDashboard();
  }, [router]);

  const recentQuestionForSubject = useMemo(() => {
    return historyEntries.find((entry) => entry.subject === selectedSubject)?.recentQuestion
      || `Ask a new ${selectedSubject} question to start your next guided session.`;
  }, [historyEntries, selectedSubject]);

  const openActiveSession = () => {
    if (!activeSession) return;
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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistory));
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setMenuOpenId(null);
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
        <p className="text-lg text-slate-700 dark:text-slate-200 font-medium animate-pulse">Loading sessions...</p>
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
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-700 text-sm font-bold text-white shadow-lg shadow-violet-200 dark:bg-violet-800">
              AI
            </div>
            <div>
              <p className="font-bold tracking-wide text-sm">Socratic</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">AI Tutor</p>
            </div>
          </button>

          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 opacity-70">Main Menu</p>
          <nav className="space-y-1.5 flex-1">
            <button
              onClick={() => router.push('/dashboard/overview')}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-slate-500 transition hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-slate-800/40"
            >
              <Layout size={18} />
              <span className="font-medium text-sm">Dashboard</span>
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex w-full items-center gap-3 rounded-2xl bg-violet-600 px-4 py-3 text-white shadow-md shadow-violet-100 dark:shadow-none"
            >
              <RotateCcw size={18} />
              <span className="font-semibold text-sm">Sessions</span>
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
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 p-4 md:p-8">
          <div className="max-w-[1400px] mx-auto space-y-8">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-2 py-0.5 rounded-md w-fit mb-2">
                  My Learning
                </p>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Study Sessions
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <div className="h-10 w-10 rounded-full overflow-hidden bg-violet-600 flex items-center justify-center text-white font-bold shadow-lg shadow-violet-200 dark:shadow-none border-2 border-white dark:border-slate-800 transition-all">
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
              
              {/* LEFT COLUMN (8 cols) */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                
                {/* Active Session Status */}
                <section className="group relative overflow-hidden rounded-3xl border border-white bg-white/60 p-8 shadow-sm backdrop-blur-xl transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Active Context</h2>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Pick up exactly where you left off.</p>
                    </div>
                    {activeSession && (
                      <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 shadow-sm animate-pulse">
                        <Activity size={12} />
                        Live Session
                      </span>
                    )}
                  </div>

                  {activeSession ? (
                    <div className="space-y-6">
                      <button
                        onClick={openActiveSession}
                        className="w-full group/card relative rounded-2xl border border-violet-100 bg-violet-50/50 p-6 text-left transition-all hover:border-violet-300 hover:bg-violet-50 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-violet-500/40"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-violet-600 dark:text-violet-400">
                              {activeSession.subject}
                            </span>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover/card:text-violet-700 dark:group-hover/card:text-violet-400 transition-colors">
                              {activeSession.question || recentQuestionForSubject}
                            </h4>
                          </div>
                          <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-slate-800 group-hover/card:scale-110 transition-transform">
                            <Play size={20} fill="currentColor" className="text-violet-600" />
                          </div>
                        </div>
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/30 p-12 text-center dark:border-slate-800 dark:bg-slate-950/20">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm dark:bg-slate-900 mb-4">
                         <History size={32} strokeWidth={1.5} />
                      </div>
                      <p className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">No active sessions found</p>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                        Your live sessions will appear here once you start exploring topics.
                      </p>
                      <button
                        onClick={() => router.push('/dashboard/overview')}
                        className="mt-6 flex items-center justify-center gap-2 mx-auto rounded-xl bg-violet-700 px-6 py-3 font-bold text-white transition hover:bg-violet-800 shadow-lg shadow-violet-200 dark:shadow-none"
                      >
                        Launch New Explorer
                      </button>
                    </div>
                  )}
                </section>

                {/* History Gallery */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                     <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                       <History size={18} className="text-violet-600" />
                       Recent History
                     </h3>
                     <span className="text-xs font-bold text-slate-400">{historyEntries.length} Conversations</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {historyEntries.length === 0 ? (
                      <div className="col-span-full py-12 text-center bg-white/40 backdrop-blur-sm rounded-3xl border border-white dark:border-slate-900/40">
                         <p className="text-slate-500 text-sm">No session history yet.</p>
                      </div>
                    ) : (
                      historyEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="group relative rounded-2xl border border-white bg-white/70 p-5 shadow-sm backdrop-blur-md transition-all hover:shadow-md hover:border-violet-100 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-violet-900/40"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <span className="rounded-lg bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
                              {entry.subject}
                            </span>
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setMenuOpenId(menuOpenId === entry.id ? null : entry.id)}
                                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                              >
                                <MoreVertical size={16} />
                              </button>
                              {menuOpenId === entry.id && (
                                <div className="absolute right-0 top-8 z-30 w-32 rounded-xl bg-white p-1 shadow-xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                                  <button
                                    onClick={() => handleDeleteConversation(entry.id)}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20"
                                  >
                                    <Trash2 size={14} />
                                    Remove
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => openHistorySession(entry)}
                            className="w-full text-left"
                          >
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-relaxed mb-4 min-h-[2.5rem]">
                              {entry.recentQuestion || entry.preview}
                            </h4>
                            <div className="flex items-center justify-between border-t border-slate-50 pt-3 dark:border-slate-800">
                              <div className="flex items-center gap-1.5 text-slate-400">
                                <Clock size={12} />
                                <span className="text-[10px] font-medium">{formatTimestamp(entry.updatedAt)}</span>
                              </div>
                              <ChevronRight size={14} className="text-slate-300 group-hover:text-violet-600 transform group-hover:translate-x-1 transition-all" />
                            </div>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN (4 cols) */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                
                {/* Session Stats */}
                <section className="rounded-3xl border border-white bg-white/60 p-6 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2 tracking-tight">
                    <BarChart3 size={20} className="text-violet-600" />
                    Explorer Stats
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50/50 p-4 border border-white/50 dark:bg-slate-800/40 dark:border-slate-700/30">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Sessions</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalSessions}</p>
                      </div>
                      <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-violet-600 dark:bg-slate-800">
                        <Zap size={20} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-amber-50/50 p-4 border border-white/50 dark:bg-slate-800/40 dark:border-slate-700/30">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Concepts Mastered</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.conceptsMastered}</p>
                      </div>
                      <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-amber-600 dark:bg-slate-800">
                        <Trophy size={20} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-violet-600 p-5 text-white shadow-lg shadow-violet-200 dark:shadow-none">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Focus Time</p>
                        <p className="text-2xl font-black">{stats.totalHours}h</p>
                      </div>
                      <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                        <Clock size={24} />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Popular Topics Mini-List */}
                <section className="rounded-3xl border border-white bg-white/60 p-6 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 tracking-tight">Active Subjects</h3>
                  <div className="space-y-2">
                    {['Physics', 'Mathematics', 'Chemistry', 'Biology'].map((sub) => (
                      <div key={sub} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-white/40 dark:border-slate-700/20">
                         <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{sub}</span>
                         <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-2 py-0.5 rounded">
                              {historyEntries.filter(e => e.subject === sub || (sub === 'Mathematics' && e.subject === 'Math')).length} chats
                            </span>
                            <ChevronRight size={14} className="text-slate-300" />
                         </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Tips Card */}
                <section className="rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 p-6 text-white shadow-xl shadow-violet-200 dark:shadow-none">
                   <div className="flex items-start gap-4">
                     <div className="rounded-full bg-white/20 p-2">
                       <Zap size={20} className="fill-current" />
                     </div>
                     <div>
                       <h4 className="font-bold text-sm tracking-tight">Deep Focus Pro-Tip</h4>
                       <p className="mt-2 text-xs text-white/80 leading-relaxed font-medium">
                         Always review your last session's guiding questions before starting a new one to bridge your learning gap.
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
