"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '../../../components/theme-toggle';
import { 
  Layout, 
  RotateCcw, 
  BarChart3, 
  BookOpen, 
  LogOut,
  Target,
  Trophy,
  Zap,
  Clock,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Shield
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5001';

const formatRecentTime = (value) =>
  new Date(value).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  });

export default function ProgressPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('Learner');
  const [userAvatar, setUserAvatar] = useState('');
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

        if (profileResponse.status === 401 || progressResponse.status === 401) {
          throw new Error('Unauthorized');
        }

        const profileData = await profileResponse.json();
        const progressData = await progressResponse.json();

        if (!profileResponse.ok || !progressResponse.ok) {
          setError(profileData.message || progressData.message || 'Unable to load progress.');
          setLoading(false);
          return;
        }

        setUserName(profileData.user?.name || 'Learner');
        setUserAvatar(profileData.user?.avatarUrl || '');
        setProgress(progressData);
        setGoalInput(String(progressData.summary?.weeklyGoalHours || 17));
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

  if (error) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-100 dark:bg-slate-950">
        <div className="text-center p-10 bg-white/80 backdrop-blur-xl dark:bg-slate-900/80 rounded-[2.5rem] border border-red-100 dark:border-red-900/20 shadow-2xl max-w-md animate-in fade-in zoom-in duration-300">
          <div className="h-20 w-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 mx-auto mb-6">
             <AlertCircle size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Access Denied</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-violet-700 hover:bg-violet-800 text-white font-bold rounded-2xl transition shadow-lg shadow-violet-200"
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
        <div className="text-center space-y-4">
           <div className="h-12 w-12 border-4 border-violet-200 border-t-violet-700 rounded-full animate-spin mx-auto opacity-80"></div>
           <p className="text-lg text-slate-500 dark:text-slate-400 font-bold tracking-tight animate-pulse">Analyzing Performance...</p>
        </div>
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
             className="mb-10 flex items-center gap-3 hover:opacity-80 transition cursor-pointer text-left focus:outline-none"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-700 text-sm font-bold text-white shadow-lg shadow-violet-200 dark:bg-violet-800 dark:shadow-none">
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
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-slate-500 transition hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-slate-800/40"
            >
              <RotateCcw size={18} />
              <span className="font-medium text-sm">Sessions</span>
            </button>
            <button
              onClick={() => router.push('/dashboard/progress')}
              className="flex w-full items-center gap-3 rounded-2xl bg-violet-600 px-4 py-3 text-white shadow-md shadow-violet-100 dark:shadow-none transition-all scale-[1.02]"
            >
              <BarChart3 size={18} />
              <span className="font-semibold text-sm">Analytics</span>
            </button>
            <button
              onClick={() => router.push('/dashboard/settings')}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-slate-500 transition hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-slate-800/40"
            >
              <BookOpen size={18} />
              <span className="font-medium text-sm">Profile</span>
            </button>
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                   localStorage.removeItem('token');
                   router.push('/login');
                }}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-red-500 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <LogOut size={18} />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 p-4 md:p-8">
          <div className="max-w-[1400px] mx-auto space-y-8">
            
            {goalPopup.visible && (
              <div className="fixed right-6 top-6 z-50 animate-in slide-in-from-right duration-300">
                <div className={`rounded-2xl px-5 py-4 text-sm font-bold shadow-2xl backdrop-blur-xl flex items-center gap-3 ${goalPopup.isError ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                  {goalPopup.isError ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                  {goalPopup.message}
                </div>
              </div>
            )}

            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 animate-in fade-in slide-in-from-top duration-500">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-2 py-0.5 rounded-md w-fit mb-2">
                  Learning Insights
                </p>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Learning Progress
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium italic text-sm">
                   "The peak of knowledge is when you realize you have much more to learn."
                </p>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <div className="h-12 w-12 rounded-2xl overflow-hidden bg-violet-600 flex items-center justify-center text-white font-black shadow-lg shadow-violet-200 dark:shadow-none border-2 border-white dark:border-slate-800 transition-all">
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

            {/* Quick Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom duration-700 delay-100">
              {[
                { label: 'Total Sessions', value: progress.summary.totalSessions, icon: BrainCircuit, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Weekly Hours', value: progress.summary.weeklyGoal, icon: Clock, color: 'text-violet-600', bg: 'bg-violet-50' },
                { label: 'Concepts Mastered', value: progress.summary.conceptsMastered, icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Focus Streak', value: progress.summary.focusStreak, icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              ].map((stat, i) => (
                <div key={i} className="group rounded-[2rem] border border-white bg-white/70 p-6 shadow-sm backdrop-blur-xl transition hover:shadow-xl hover:shadow-violet-100 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:shadow-none">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} dark:bg-slate-800/50 transition-transform group-hover:scale-110`}>
                      <stat.icon size={22} />
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
                </div>
              ))}
            </section>

            {/* Main Content Grid (12 Columns) */}
            <div className="grid grid-cols-12 gap-6 pb-8">
              
              {/* LEFT: Charts & Recent activity (8 cols) */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                
                {/* Study Hours Card */}
                <section className="rounded-[2.5rem] border border-white bg-white/60 p-8 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60 animate-in fade-in duration-1000">
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                         <Clock size={22} className="text-violet-600" />
                         Weekly Study Patterns
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Tracking your active learning distribution.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-4 items-end h-64 mt-4">
                    {progress.studyHours.map((entry, i) => (
                      <div key={entry.label} className="flex flex-col items-center gap-4 group">
                        <div className="relative w-full flex justify-center">
                           {/* Bar Tooltip */}
                           <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-900 text-white text-[10px] px-2 py-1 rounded-lg font-bold z-10">
                              {entry.hours} Hours
                           </div>
                           <div className="w-full max-w-[40px] rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 h-52 flex items-end overflow-hidden group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors">
                            <div
                              className="w-full bg-gradient-to-t from-violet-600 via-fuchsia-500 to-pink-400 transition-all duration-1000 ease-out shadow-[0_-4px_12px_rgba(139,92,246,0.2)] rounded-t-2xl"
                              style={{ 
                                height: `${Math.max(8, entry.hours * 25)}px`,
                                transitionDelay: `${i * 100}ms`
                              }}
                            />
                          </div>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-violet-600 transition-colors">{entry.label}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Recent Activity Card */}
                <section className="rounded-[2.5rem] border border-white bg-white/60 p-8 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                         <Layout size={22} className="text-blue-500" />
                         Refined Recent Activity
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Your most recent Socratic interactions.</p>
                    </div>
                    <button 
                      onClick={() => router.push('/dashboard')}
                      className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 transition flex items-center gap-2"
                    >
                       Full History <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {progress.recentSessions.length === 0 ? (
                      <div className="py-12 text-center">
                         <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                             <RotateCcw size={32} />
                         </div>
                         <p className="font-bold text-slate-400 text-sm">No recent activity detected.</p>
                      </div>
                    ) : (
                      progress.recentSessions.slice(0, 4).map((session) => (
                        <div 
                          key={session._id || session.sessionId} 
                          className="group flex items-center gap-4 p-4 rounded-3xl border border-transparent hover:border-violet-100 hover:bg-white transition-all dark:hover:bg-slate-900/80 dark:hover:border-slate-800"
                        >
                          <div className="h-12 w-12 rounded-2xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center text-violet-600 font-bold shrink-0 transition-transform group-hover:scale-105">
                             {session.subject[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="flex items-center justify-between gap-2 mb-1">
                               <h3 className="font-black text-sm tracking-tight text-slate-900 dark:text-white truncate">{session.subject}</h3>
                               <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                                  <Calendar size={10} />
                                  {formatRecentTime(session.updatedAt)}
                               </span>
                             </div>
                             <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 italic font-medium">
                               "{session.recentQuestion || session.preview}"
                             </p>
                          </div>
                          <ChevronRight size={16} className="text-slate-300 group-hover:text-violet-400 transition-colors" />
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>

              {/* RIGHT: Mastery & Insight (4 cols) */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                
                {/* Mastery Progress Card */}
                <section className="rounded-[2.5rem] border border-white bg-white/60 p-8 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60 transition hover:shadow-lg">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-8">Concept Mastery</h2>
                  <div className="space-y-6">
                    {progress.subjectMastery.map((entry) => (
                      <div key={entry.subject} className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">{entry.subject}</span>
                          <span className="text-[11px] font-black bg-violet-600 text-white px-2 py-0.5 rounded-lg shadow-sm">{entry.mastery}%</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-50 dark:border-slate-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-400 shadow-[2px_0_12px_rgba(139,92,246,0.3)] transition-all duration-1000"
                            style={{ width: `${entry.mastery}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    {progress.subjectMastery.length === 0 && (
                       <p className="text-xs text-slate-400 font-bold italic text-center py-4">No data available yet.</p>
                    )}
                  </div>
                </section>

                {/* Socratic Insight Premium Card */}
                <section className="rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl shadow-indigo-200 dark:shadow-none relative">
                   {/* Background Elements */}
                   <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/20 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>
                   <div className="absolute bottom-0 left-0 w-24 h-24 bg-fuchsia-600/20 blur-3xl rounded-full -translate-x-12 translate-y-12"></div>
                   
                   <div className="relative p-8 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-violet-900/50">
                           <BrainCircuit size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400">AI Insight</p>
                          <h2 className="text-xl font-black text-white tracking-tight">Socratic Wisdom</h2>
                        </div>
                      </div>

                      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-5 rounded-[2rem]">
                         <p className="text-sm font-medium leading-relaxed text-indigo-100 italic">
                            "{progress.insight}"
                         </p>
                      </div>

                      {/* Goal Form */}
                      <form onSubmit={handleGoalSubmit} className="space-y-4 pt-2">
                        <div className="flex flex-col gap-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Update Weekly Goal (Hours)</label>
                           <div className="flex items-center gap-2">
                              <div className="relative flex-1 group">
                                <Target size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
                                <input
                                  value={goalInput}
                                  onChange={(e) => setGoalInput(e.target.value)}
                                  type="number"
                                  min="1"
                                  className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 pl-10 pr-4 text-white font-black text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                                />
                              </div>
                              <button
                                type="submit"
                                disabled={goalSaving}
                                className="h-12 px-6 bg-violet-600 hover:bg-violet-700 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl transition disabled:opacity-50 shadow-lg shadow-violet-900/40 shrink-0"
                              >
                                {goalSaving ? '...' : <Target size={18} />}
                              </button>
                           </div>
                        </div>
                      </form>
                   </div>
                </section>

                {/* Account Tier Badge */}
                <div className="p-5 rounded-[2rem] bg-indigo-50/50 border border-indigo-100 dark:bg-slate-900/60 dark:border-slate-800 flex items-center gap-4 group transition hover:bg-white dark:hover:bg-slate-900">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-200 dark:shadow-none transition-transform group-hover:rotate-12">
                       <Shield size={22} />
                    </div>
                    <div>
                       <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Enterprise Tier</h4>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Analytics Active</p>
                    </div>
                </div>

              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
