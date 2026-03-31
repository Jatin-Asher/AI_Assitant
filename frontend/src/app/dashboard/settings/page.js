"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';
import { ThemeToggle } from '../../../components/theme-toggle';
import ProfileForm from '../../../components/ProfileForm';
import ProfileAvatar from '../../../components/ProfileAvatar';
import DangerZone from '../../../components/DangerZone';
import {
  User, 
  Mail, 
  Shield, 
  Key, 
  LogOut, 
  Layout, 
  RotateCcw, 
  BarChart3, 
  BookOpen,
  ChevronRight,
  Zap,
  CheckCircle,
  Calendar
} from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [passwordForm, setPasswordForm] = useState({
    email: '',
    questions: [],
    answers: ['', ''],
    resetToken: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordStep, setPasswordStep] = useState('email');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
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

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            router.replace('/login');
            return;
          }
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        setError('Unable to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    void fetchUserData();
  }, [router]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordMessage('');
    setPasswordError('');
  };

  const handleSecurityAnswerChange = (index, value) => {
    setPasswordForm((prev) => {
      const nextAnswers = [...prev.answers];
      nextAnswers[index] = value;
      return {
        ...prev,
        answers: nextAnswers,
      };
    });
    setPasswordMessage('');
    setPasswordError('');
  };

  const handleFetchQuestions = async (e) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordMessage('');
    setPasswordError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: passwordForm.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to fetch security questions.');
      }

      setPasswordForm((prev) => ({
        ...prev,
        questions: data.questions,
        answers: ['', ''],
      }));
      setPasswordStep('answers');
      setPasswordMessage('Security questions loaded. Answer them correctly to continue.');
    } catch (err) {
      setPasswordError(err.message || 'Unable to fetch security questions.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleVerifyQuestions = async (e) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordMessage('');
    setPasswordError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: passwordForm.email,
          answers: passwordForm.questions.map((question, index) => ({
            index: question.index,
            answer: passwordForm.answers[index] || '',
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Security answers did not match.');
      }

      setPasswordForm((prev) => ({
        ...prev,
        resetToken: data.resetToken,
      }));
      setPasswordStep('reset');
      setPasswordMessage('Security answers verified. You can set a new password now.');
    } catch (err) {
      setPasswordError(err.message || 'Security answers did not match.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordSaving(true);
    setPasswordMessage('');
    setPasswordError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resetToken: passwordForm.resetToken,
          password: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update password.');
      }

      setPasswordMessage(data.message || 'Password updated successfully.');
      setPasswordStep('email');
      setPasswordForm({
        email: '',
        questions: [],
        answers: ['', ''],
        resetToken: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (err) {
      setPasswordError(err.message || 'Unable to update password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleAvatarUpload = (url) => {
    setUser(prev => ({ ...prev, avatarUrl: url }));
    setMessage('Profile photo updated successfully!');
  };

  const calculateProfileCompletion = () => {
    if (!user) return 0;
    let score = 0;
    if (user.name) score += 20;
    if (user.email) score += 20;
    if (user.avatarUrl) score += 20;
    if (user.bio) score += 20;
    if (user.preferredSubjects && user.preferredSubjects.length > 0) score += 20;
    return score;
  };

  const profileScore = calculateProfileCompletion();

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-100 dark:bg-slate-950">
        <p className="text-lg text-slate-700 dark:text-slate-200 font-medium animate-pulse">Loading settings...</p>
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
              className="flex w-full items-center gap-3 rounded-2xl bg-violet-600 px-4 py-3 text-white shadow-md shadow-violet-100 dark:shadow-none"
            >
              <BookOpen size={18} />
              <span className="font-semibold text-sm">Profile</span>
            </button>
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleLogout}
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
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-2 py-0.5 rounded-md w-fit mb-2">
                  Settings
                </p>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  User Profile
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <div className="h-10 w-10 rounded-full overflow-hidden bg-violet-600 flex items-center justify-center text-white font-bold shadow-lg shadow-violet-200 dark:shadow-none border-2 border-white dark:border-slate-800">
                  {user?.avatarUrl ? (
                    <img 
                      src={user.avatarUrl.startsWith('http') ? user.avatarUrl : `${API_BASE_URL}${user.avatarUrl}`} 
                      alt={user.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user?.name?.[0] || 'U'
                  )}
                </div>
              </div>
            </header>

            {/* Grid Layout (12 Columns) */}
            <div className="grid grid-cols-12 gap-6">
              
              {/* LEFT COLUMN (8 cols) */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                
                {/* Profile Form Card */}
                <section className="rounded-3xl border border-white bg-white/60 p-8 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                       <User size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Identity Details</h2>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">Manage how others see you on the platform.</p>
                    </div>
                  </div>

                  <ProfileForm 
                    user={user} 
                    onUpdate={(updatedUser) => {
                      setUser(updatedUser);
                      setMessage('Profile updated successfully!');
                    }} 
                  />
                </section>

                {/* Password Management Card */}
                <section className="rounded-3xl border border-white bg-white/60 p-8 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60">
                   <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                       <Shield size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Change Password</h2>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">Update your password using security questions.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {passwordStep === 'email' && (
                      <form onSubmit={handleFetchQuestions} className="space-y-4">
                        <div className="relative group">
                           <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                           <input
                            name="email"
                            value={passwordForm.email}
                            onChange={handlePasswordChange}
                            placeholder="Current account email"
                            type="email"
                            className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 pl-12 pr-4 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400/50 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white transition-all shadow-sm group-hover:bg-white dark:group-hover:bg-slate-900"
                            required
                          />
                        </div>

                        {passwordMessage && <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl">{passwordMessage}</p>}
                        {passwordError && <p className="text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl">{passwordError}</p>}

                        <button
                          type="submit"
                          disabled={passwordSaving}
                          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-violet-700 py-4 font-bold text-white transition-all hover:bg-violet-800 hover:shadow-lg hover:shadow-violet-200 disabled:opacity-60 dark:bg-violet-800 dark:hover:bg-violet-700 dark:shadow-none shadow-md shadow-violet-100"
                        >
                          {passwordSaving ? 'Synchronizing...' : (
                            <>
                              <Key size={20} />
                              Fetch Email ID
                            </>
                          )}
                        </button>
                      </form>
                    )}

                    {passwordStep === 'answers' && (
                      <form onSubmit={handleVerifyQuestions} className="space-y-5">
                        {passwordForm.questions.map((item, index) => (
                          <div key={`${item.question}-${item.index}`} className="space-y-2">
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">{item.question}</label>
                            <input
                              value={passwordForm.answers[index] || ''}
                              onChange={(e) => handleSecurityAnswerChange(index, e.target.value)}
                              placeholder="Your secret answer"
                              className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400/50 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white transition-all shadow-sm"
                              required
                            />
                          </div>
                        ))}

                        {passwordMessage && <p className="text-sm font-bold text-emerald-600">{passwordMessage}</p>}
                        {passwordError && <p className="text-sm font-bold text-red-600">{passwordError}</p>}

                        <div className="flex gap-4">
                          <button
                            type="submit"
                            disabled={passwordSaving}
                            className="flex-1 rounded-2xl bg-violet-700 py-4 font-bold text-white transition hover:bg-violet-800 disabled:opacity-60"
                          >
                            {passwordSaving ? 'Verifying...' : 'Validate Answers'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setPasswordStep('email')}
                            className="px-6 rounded-2xl border border-slate-200 bg-white font-bold text-slate-600 hover:bg-slate-50 transition"
                          >
                            Back
                          </button>
                        </div>
                      </form>
                    )}

                    {passwordStep === 'reset' && (
                      <form onSubmit={handleResetPassword} className="space-y-4">
                        <input
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="Create new password"
                          type="password"
                          className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-4 transition-all focus:ring-2 focus:ring-violet-400/50"
                          required
                        />
                        <input
                          name="confirmNewPassword"
                          value={passwordForm.confirmNewPassword}
                          onChange={handlePasswordChange}
                          placeholder="Confirm new password"
                          type="password"
                          className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-4 transition-all focus:ring-2 focus:ring-violet-400/50"
                          required
                        />
                        <button
                          type="submit"
                          disabled={passwordSaving}
                          className="w-full rounded-2xl bg-emerald-600 py-4 font-bold text-white transition hover:bg-emerald-700 shadow-md shadow-emerald-100"
                        >
                          {passwordSaving ? 'Updating...' : 'Set Final Password'}
                        </button>
                      </form>
                    )}
                  </div>
                </section>
                
                {/* Danger Zone Card */}
                <DangerZone />
              </div>

              {/* RIGHT COLUMN (4 cols) */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                
                {/* Identity Sidebar Card */}
                <section className="rounded-3xl border border-white bg-white/60 p-8 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60 text-center">
                  <div className="mb-6 flex justify-center">
                    <ProfileAvatar user={user} onUploadSuccess={handleAvatarUpload} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{user?.name}</h3>
                  <p className="text-slate-500 text-sm mt-1">{user?.email}</p>
                  
                  <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                     <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                           <Zap size={14} className="text-violet-600" />
                           Account Status
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Premium</span>
                     </div>
                     <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                           <Calendar size={14} className="text-violet-600" />
                           Joined
                        </div>
                        <span className="text-[10px] font-black tracking-tight text-slate-600">March 2026</span>
                     </div>
                  </div>
                </section>

                 {/* Profile Completion Card */}
                 <section className="rounded-3xl border border-white bg-violet-600 p-6 text-white shadow-xl shadow-violet-200 dark:shadow-none">
                   <div className="flex items-center gap-3 mb-4">
                     <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                        <CheckCircle size={16} />
                     </div>
                     <h4 className="font-black text-sm tracking-tight uppercase tracking-[0.1em]">Profile Score</h4>
                   </div>
                   <div className="space-y-4">
                     <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white transition-all duration-1000 ease-out rounded-full shadow-sm shadow-white/50" style={{ width: `${profileScore}%` }}></div>
                     </div>
                     <p className="text-xs font-medium text-white/80 leading-relaxed">
                       Your profile is {profileScore}% complete. {profileScore < 100 ? "Complete the remaining sections for better AI personalization." : "Excellent! Your profile is fully optimized for learning."}
                     </p>
                     <button 
                       onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                       className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all mt-2"
                     >
                       {profileScore < 100 ? "Complete Now" : "Manage Profile"} <ChevronRight size={12} />
                     </button>
                   </div>
                 </section>

                {/* Privacy Badge */}
                <div className="p-4 rounded-2xl bg-white/40 border border-white flex items-center gap-3 text-slate-500 dark:border-slate-800 dark:bg-slate-900/40">
                   <Shield size={16} className="text-emerald-500" />
                   <p className="text-[10px] font-bold leading-tight uppercase tracking-tight">Your data is encrypted and protected by enterprise security standards.</p>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
