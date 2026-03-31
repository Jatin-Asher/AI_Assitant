"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Layout, 
  Menu,
  MessageSquare, 
  Activity, 
  User, 
  MoreVertical, 
  Trash2, 
  Brain,
  History,
  Trophy,
  Clock
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';
import { FocusModeToggle } from '../../../components/FocusModeToggle';
import { SessionTimer } from '../../../components/SessionTimer';
import { VoiceInput } from '../../../components/VoiceInput';
import { useFocusMode } from '../../../context/FocusModeContext';
import { useSessionTimer } from '../../../hooks/useSessionTimer';

const STORAGE_KEY = 'socratic-session-history';
const ACTIVE_SESSION_KEY = 'socratic-active-session';

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs.toString().padStart(2, '0')}s`;
};

const formatTimestamp = (value) =>
  new Date(value).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

const makeSessionEntry = ({ existingHistory, subject, sessionId, preview, recentQuestion, timeSpent, messages }) => [
  {
    id: sessionId,
    subject,
    preview: preview.slice(0, 70),
    recentQuestion,
    updatedAt: Date.now(),
    timeSpent,
    messages: messages.slice(-4),
  },
  ...existingHistory.filter((entry) => entry.id !== sessionId),
].slice(0, 12);

function SessionPageContent() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [historyEntries, setHistoryEntries] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [stats, setStats] = useState({ totalSessions: 0, totalHours: 0, conceptsMastered: 0 });
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoStartedRef = useRef(false);
  const currentSessionIdRef = useRef(searchParams.get('session') || `session-${Date.now()}`);
  const { isFocusMode, toggleFocusMode } = useFocusMode();

  const subject = searchParams.get('subject') || 'Physics';
  const startingQuestion = searchParams.get('question') || `Help me study ${subject}.`;
  const sessionId = currentSessionIdRef.current;
  const { elapsedSeconds, resetTimer } = useSessionTimer(sessionId, !loading);

  const filteredHistory = useMemo(
    () => historyEntries.filter((entry) => entry.subject === subject).slice(0, 4),
    [historyEntries, subject]
  );

  useEffect(() => {
    const initializeSession = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        router.replace('/login');
        return;
      }

      // Fetch user profile for avatar/name
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data.user);
        }
      } catch (err) {
        console.warn('Failed to fetch user profile:', err);
      }

      const progressResponse = await fetch(`${API_BASE_URL}/api/session/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (progressResponse.ok) {
        const progressData = await progressResponse.json();
        const serverHistory = progressData.sessions || [];
        setHistoryEntries(serverHistory);
        if (progressData.stats) {
          setStats(progressData.stats);
        }
        
        const existingSession = serverHistory.find((entry) => entry.id === sessionId);
        if (existingSession?.messages?.length) {
          setMessages(existingSession.messages);
        }
      } else {
        // Fallback to local if server fails
        const storedHistory = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        setHistoryEntries(storedHistory);
        const existingSession = storedHistory.find((entry) => entry.id === sessionId);
        if (existingSession?.messages?.length) {
          setMessages(existingSession.messages);
        }
      }

      try {
        localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({
          id: sessionId,
          subject,
          question: startingQuestion,
          updatedAt: Date.now(),
        }));
      } catch (e) {
        if (e.name === 'QuotaExceededError') {
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      setLoading(false);
    };

    void initializeSession();
  }, [router, sessionId, subject, startingQuestion]);

  const persistHistory = (nextMessages, latestAssistantReply = '') => {
    const previewSource = latestAssistantReply || nextMessages[nextMessages.length - 1]?.content || startingQuestion;
    const existingHistory = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const recentUserQuestion = [...nextMessages].reverse().find((message) => message.role === 'user')?.content || startingQuestion;

    const nextHistory = makeSessionEntry({
      existingHistory,
      subject,
      sessionId,
      preview: previewSource,
      recentQuestion: recentUserQuestion,
      timeSpent: elapsedSeconds,
      messages: nextMessages,
    });

    setHistoryEntries(nextHistory);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistory));
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  const sendMessage = async (messageText, action = 'guide') => {
    const cleanMessage = messageText.trim();
    if (!cleanMessage || isSending) {
      return;
    }

    const userMessage = {
      role: 'user',
      content: cleanMessage,
      timestamp: Date.now(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setIsSending(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/tutor/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          action,
          message: cleanMessage,
          history: nextMessages.slice(-8).map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to get tutor guidance right now.');
      }

      const assistantMessage = {
        role: 'assistant',
        content: data.reply,
        timestamp: Date.now(),
      };

      setMessages((prev) => {
        const updatedMessages = [...prev, assistantMessage];
        persistHistory(updatedMessages, data.reply);
        return updatedMessages;
      });
    } catch (error) {
      const fallbackMessage = {
        role: 'assistant',
        content: error.message || 'Something went wrong while contacting the tutor.',
        timestamp: Date.now(),
        error: true,
      };

      setMessages((prev) => {
        const updatedMessages = [...prev, fallbackMessage];
        persistHistory(updatedMessages, fallbackMessage.content);
        return updatedMessages;
      });
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (loading || autoStartedRef.current || messages.length > 0) {
      return;
    }

    autoStartedRef.current = true;
    void sendMessage(startingQuestion, 'guide');
  }, [loading, startingQuestion, messages.length]);

  // Periodic Session Sync (Autosave)
  useEffect(() => {
    if (loading) return;

    const syncInterval = setInterval(async () => {
      const token = localStorage.getItem('token');
      if (!token || messages.length === 0) return;

      const recentUserQuestion = [...messages].reverse().find((m) => m.role === 'user')?.content || startingQuestion;
      const lastPreview = [...messages].reverse().find((m) => m.role === 'assistant')?.content || recentUserQuestion;

      try {
        await fetch(`${API_BASE_URL}/api/session/end`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sessionId,
            timeSpent: elapsedSeconds,
            subject,
            recentQuestion: recentUserQuestion,
            preview: lastPreview,
          }),
        });
      } catch (err) {
        console.warn('[AUTOSAVE ERROR]', err);
      }
    }, 60000); // Sync every 60 seconds

    return () => clearInterval(syncInterval);
  }, [loading, messages, elapsedSeconds, sessionId, subject, startingQuestion]);

  const handleEndSession = async () => {
    const existingHistory = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const recentUserQuestion = [...messages].reverse().find((message) => message.role === 'user')?.content || startingQuestion;
    const preview = [...messages].reverse().find((message) => message.role === 'assistant')?.content || recentUserQuestion;
    const token = localStorage.getItem('token');

    const nextHistory = makeSessionEntry({
      existingHistory,
      subject,
      sessionId,
      preview,
      recentQuestion: recentUserQuestion,
      timeSpent: elapsedSeconds,
      messages,
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistory));
    try {
      await fetch(`${API_BASE_URL}/api/session/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          sessionId,
          timeSpent: elapsedSeconds,
          subject,
          recentQuestion: recentUserQuestion,
          preview,
        }),
      });
    } catch {
      // Best-effort sync; local history is already persisted above.
    }
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    resetTimer();
    router.push('/dashboard');
  };

  const openHistorySession = (entry) => {
    const params = new URLSearchParams({
      subject: entry.subject,
      question: entry.recentQuestion || entry.preview,
      session: entry.id,
    });
    setIsSidebarOpen(false);
    router.push(`/dashboard/session?${params.toString()}`);
  };

  const handleDeleteConversation = (entryId) => {
    const nextHistory = historyEntries.filter((entry) => entry.id !== entryId);
    setHistoryEntries(nextHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistory));
    setMenuOpenId(null);

    if (entryId === sessionId) {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
      resetTimer();
      setMessages([]);
      router.replace('/dashboard');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-100 dark:bg-slate-950">
        <p className="text-lg text-slate-700 dark:text-slate-200">Loading your session...</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(196,181,253,0.35),_transparent_22%),linear-gradient(135deg,_#faf5ff_0%,_#f8fafc_50%,_#eef2ff_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.18),_transparent_22%),linear-gradient(135deg,_#090b17_0%,_#101426_45%,_#090d1b_100%)] dark:text-white">
      <div className="flex min-h-screen">
        {isSidebarOpen && (
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm lg:hidden"
            aria-label="Close session sidebar"
          />
        )}

        <aside className={`fixed inset-y-0 left-0 z-40 overflow-y-auto border-r border-slate-200 bg-white px-5 py-6 transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 lg:static lg:z-auto lg:translate-x-0 lg:px-6 ${isFocusMode ? 'pointer-events-none lg:w-0 lg:-translate-x-8 lg:px-0 lg:opacity-0' : ''} ${isSidebarOpen ? 'w-[88vw] max-w-sm translate-x-0 opacity-100' : 'w-[88vw] max-w-sm -translate-x-full opacity-0 lg:w-72 lg:opacity-100'}`}>
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">Session Menu</p>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Close session menu"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
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
              <Layout size={18} className="text-violet-700/80 dark:text-violet-300/80" />
              <span className="font-medium">Tutor Dashboard</span>
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/40"
            >
              <MessageSquare size={18} className="text-violet-700/80 dark:text-violet-300/80" />
              <span className="font-medium">My Sessions</span>
            </button>
            <button
              onClick={() => router.push('/dashboard/progress')}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/40"
            >
              <Activity size={18} className="text-violet-700/80 dark:text-violet-300/80" />
              <span className="font-medium">Learning Progress</span>
            </button>
            <button
              onClick={() => router.push('/dashboard/settings')}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/40"
            >
              <User size={18} className="text-violet-700/80 dark:text-violet-300/80" />
              <span className="font-medium">Profile</span>
            </button>
          </nav>

          <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-violet-700/80 dark:text-violet-200/70">Current Subject</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{subject}</h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Spent: {formatDuration(elapsedSeconds)}</p>
          </div>

          {/* Global Progress Section */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-amber-50/50 p-3 border border-amber-100/50 dark:bg-amber-900/10 dark:border-amber-900/20">
               <div className="flex items-center gap-1.5 text-amber-600 mb-1">
                 <Trophy size={12} />
                 <span className="text-[9px] font-black uppercase tracking-wider">Mastery</span>
               </div>
               <p className="text-lg font-black text-slate-900 dark:text-white leading-none">{stats.conceptsMastered}</p>
            </div>
            <div className="rounded-2xl bg-violet-50/50 p-3 border border-violet-100/50 dark:bg-violet-900/10 dark:border-violet-900/20">
               <div className="flex items-center gap-1.5 text-violet-600 mb-1">
                 <Clock size={12} />
                 <span className="text-[9px] font-black uppercase tracking-wider">Total</span>
               </div>
               <p className="text-lg font-black text-slate-900 dark:text-white leading-none">{stats.totalHours}h</p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Chat History</h3>
            <History size={20} className="text-slate-400" />
          </div>

          <div className="mt-4 space-y-3 overflow-y-auto pr-1">
            {filteredHistory.length === 0 ? (
              <div className="rounded-2xl border border-violet-200 bg-violet-50/60 p-4 text-sm text-slate-600 dark:border-white/8 dark:bg-white/5 dark:text-slate-300">
                No {subject} sessions yet. Start chatting and your history will appear here.
              </div>
            ) : (
              filteredHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="relative rounded-2xl border border-violet-200 bg-white p-4 dark:border-violet-700/20 dark:bg-gradient-to-r dark:from-violet-900/35 dark:to-slate-800/90"
                >
                  <button
                    onClick={() => openHistorySession(entry)}
                    className="w-full text-left pr-10 rounded-xl transition hover:bg-violet-50 dark:hover:from-violet-900/50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-slate-900 dark:text-white">{entry.subject}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{formatTimestamp(entry.updatedAt)}</p>
                    </div>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{entry.recentQuestion || entry.preview}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{entry.preview}</p>
                    <p className="mt-2 text-xs text-violet-700/80 dark:text-violet-200/80">Time spent: {formatDuration(entry.timeSpent || 0)}</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMenuOpenId((current) => (current === entry.id ? null : entry.id))}
                    className="absolute right-3 top-3 rounded-full p-1 text-slate-500 transition hover:bg-violet-100 hover:text-violet-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-violet-200"
                    aria-label="Open conversation actions"
                  >
                    <MoreVertical size={16} />
                  </button>
                  {menuOpenId === entry.id && (
                    <div className="absolute right-3 top-11 z-10 rounded-xl border border-violet-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                      <button
                        type="button"
                        onClick={() => handleDeleteConversation(entry.id)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </aside>

        <main className={`flex-1 px-3 py-4 transition-all duration-300 sm:px-4 md:p-6 ${isFocusMode ? 'md:p-4' : ''}`}>
          <section className={`mx-auto flex min-h-[calc(100vh-1.5rem)] flex-col rounded-[2rem] border border-violet-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,243,255,0.92))] p-3 text-slate-900 shadow-[0_24px_80px_rgba(148,163,184,0.2)] transition-all duration-300 md:min-h-[calc(100vh-2rem)] md:p-6 dark:border-white/12 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,243,255,0.95))] dark:shadow-[0_24px_80px_rgba(2,6,23,0.45)] ${isFocusMode ? 'max-w-[1400px]' : 'max-w-[1080px]'}`}>
            <header className="mb-4 flex flex-col gap-4 rounded-[1.6rem] border border-violet-200 bg-white/80 px-5 py-5 shadow-sm md:flex-row md:items-center md:justify-between dark:border-slate-200/80">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-violet-700">Active Tutor Session</p>
                <h1 className="mt-2 text-3xl font-bold md:text-4xl">{subject}</h1>
              </div>
              <div className="flex flex-wrap items-center justify-start gap-3 md:justify-end">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-violet-300 bg-white px-4 py-2 font-medium text-violet-900 transition hover:bg-violet-50 lg:hidden"
                >
                  <Menu size={18} />
                  Session Menu
                </button>
                <SessionTimer seconds={elapsedSeconds} />
                <FocusModeToggle isActive={isFocusMode} onToggle={toggleFocusMode} />
                <div className="flex items-center gap-2 rounded-2xl bg-emerald-100 px-4 py-2 text-emerald-800 shadow-sm">
                  <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                  <span className="font-medium">Session Active</span>
                </div>
                <button
                  onClick={handleEndSession}
                  className="rounded-2xl border border-violet-300 bg-violet-100 px-4 py-2 font-medium text-violet-900 transition hover:bg-violet-200"
                >
                  End Session
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto rounded-[1.6rem] border border-violet-200 bg-white/80 p-4 md:p-6 dark:border-slate-200/90">
              <div className="space-y-5">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${message.timestamp}-${index}`}
                    className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-800 text-white shadow-[0_10px_25px_rgba(76,29,149,0.35)]">
                        <Brain size={24} />
                      </div>
                    )}

                    <div
                    className={`max-w-[88%] rounded-[1.4rem] px-4 py-4 shadow-sm sm:max-w-[80%] sm:px-5 ${
                        message.role === 'user'
                          ? 'bg-violet-700 text-white'
                          : message.error
                            ? 'border border-red-200 bg-red-50 text-red-900'
                            : 'border border-violet-300 bg-[linear-gradient(180deg,rgba(245,243,255,1),rgba(237,233,254,0.96))] text-slate-900'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-[1rem] leading-relaxed md:text-[1.06rem]">{message.content}</p>
                      <p className={`mt-2 text-xs ${message.role === 'user' ? 'text-violet-100' : 'text-slate-500'}`}>
                        {formatTimestamp(message.timestamp)}
                      </p>
                    </div>

                    {message.role === 'user' && (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md border-2 border-white dark:border-slate-800">
                        {userProfile?.avatarUrl ? (
                          <img 
                            src={userProfile.avatarUrl.startsWith('http') ? userProfile.avatarUrl : `${API_BASE_URL}${userProfile.avatarUrl}`} 
                            alt={userProfile.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="font-bold text-sm">
                            {userProfile?.name ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {isSending && (
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-800 text-white">
                      <Brain size={24} />
                    </div>
                    <div className="rounded-[1.4rem] border border-violet-300 bg-violet-100 px-5 py-4 text-slate-700">
                      Thinking through the next guiding step...
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-[1.6rem] border border-violet-200 bg-white/75 px-3 py-4 shadow-sm sm:px-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        void sendMessage(input, 'guide');
                      }
                    }}
                    placeholder={`Ask your ${subject} question...`}
                    className="min-h-[3.8rem] w-full rounded-[1.2rem] border-2 border-violet-700 bg-white px-4 pr-28 text-base text-slate-900 outline-none transition focus:border-violet-800 focus:ring-4 focus:ring-violet-200 sm:pr-36 sm:text-lg"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <VoiceInput
                      disabled={isSending}
                      onTranscript={(transcript) => setInput(transcript)}
                    />
                  </div>
                </div>
                <button
                  onClick={() => void sendMessage(input, 'guide')}
                  disabled={isSending || !input.trim()}
                  className="w-full rounded-[1rem] bg-gradient-to-r from-violet-800 to-violet-600 px-6 py-4 text-base font-semibold text-white shadow-[0_14px_30px_rgba(76,29,149,0.32)] transition hover:from-violet-900 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-60 dark:from-violet-900 dark:to-violet-700 lg:w-auto lg:text-lg"
                >
                  Submit Insight
                </button>
              </div>

              {!isFocusMode && (
                <div className="mt-4 grid grid-cols-1 gap-3 transition-opacity duration-300 sm:grid-cols-3">
                  <button
                    onClick={() => void sendMessage(input || 'Give me a hint for this problem.', 'hint')}
                    disabled={isSending}
                    className="rounded-2xl border border-violet-300 bg-violet-100 px-5 py-3 text-sm font-medium text-violet-950 transition hover:bg-violet-200 disabled:opacity-60 sm:text-base"
                  >
                    Give Hint
                  </button>
                  <button
                    onClick={() => void sendMessage(input || 'I am stuck. Please help me with the next small step.', 'stuck')}
                    disabled={isSending}
                    className="rounded-2xl border border-violet-300 bg-violet-100 px-5 py-3 text-sm font-medium text-violet-950 transition hover:bg-violet-200 disabled:opacity-60 sm:text-base"
                  >
                    Stuck? Get Hint
                  </button>
                  <button
                    onClick={() => void sendMessage(input || 'Ask me a guiding question about this problem.', 'question')}
                    disabled={isSending}
                    className="rounded-2xl border border-violet-300 bg-violet-100 px-5 py-3 text-sm font-medium text-violet-950 transition hover:bg-violet-200 disabled:opacity-60 sm:text-base"
                  >
                    Ask Question
                  </button>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default function SessionPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen grid place-items-center bg-slate-100 dark:bg-slate-950">
          <p className="text-lg text-slate-700 dark:text-slate-200">Preparing your session...</p>
        </main>
      }
    >
      <SessionPageContent />
    </Suspense>
  );
}
