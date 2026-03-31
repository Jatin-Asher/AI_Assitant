"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';
import { ThemeToggle } from '../../../components/theme-toggle';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    email: '',
    questions: [],
    answers: ['', ''],
    resetToken: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordStep, setPasswordStep] = useState('email');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/login');
      return;
    }
    setLoading(false);
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage('');
    setError('');
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/username`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update username.');
      }

      setMessage(data.message || 'Username updated successfully.');
      if (data.user?.name) {
        localStorage.setItem('userName', data.user.name);
      }
      if (data.user?.email) {
        localStorage.setItem('userEmail', data.user.email);
      }
      setFormData((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      setError(err.message || 'Unable to update username.');
    } finally {
      setSaving(false);
    }
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

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-100 dark:bg-slate-950">
        <p className="text-lg text-slate-700 dark:text-slate-200">Loading settings...</p>
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
            <button
              onClick={() => router.push('/dashboard/progress')}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/40"
            >
              <span className="material-symbols-outlined text-violet-700/80 dark:text-violet-300/80">monitoring</span>
              <span className="font-medium">Learning Progress</span>
            </button>
            <button className="flex w-full items-center gap-3 rounded-2xl bg-violet-100 px-4 py-3 text-violet-900 dark:bg-violet-900/30 dark:text-violet-100">
              <span className="material-symbols-outlined text-violet-700 dark:text-violet-300">settings</span>
              <span className="font-medium">User Settings</span>
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-violet-700 dark:text-violet-300">Account</p>
                <h1 className="text-4xl font-bold mt-2">Settings</h1>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
              </div>
            </div>

            <div className="rounded-3xl border border-violet-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-2xl font-bold mb-2">Change Username</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Enter your correct email and password. Your username will only be changed if both credentials are valid.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="New username"
              className="w-full rounded-xl border border-violet-200 bg-violet-50/60 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              required
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              type="email"
              className="w-full rounded-xl border border-violet-200 bg-violet-50/60 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              required
            />
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              type="password"
              className="w-full rounded-xl border border-violet-200 bg-violet-50/60 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              required
            />

            {message && <p className="text-green-600 dark:text-green-400">{message}</p>}
            {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white hover:bg-violet-800 disabled:opacity-60 dark:bg-violet-800 dark:hover:bg-violet-900"
              >
                {saving ? 'Updating...' : 'Update Username'}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-red-100 px-5 py-3 font-semibold text-red-700 hover:bg-red-200 dark:bg-red-600/20 dark:text-red-300 dark:hover:bg-red-600/30"
              >
                Logout
              </button>
            </div>
          </form>
        </div>

            <div className="mt-8 rounded-3xl border border-violet-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-2xl font-bold mb-2">Change Password</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Verify your account with your saved security questions before setting a new password.
              </p>

          {passwordStep === 'email' && (
            <form onSubmit={handleFetchQuestions} className="space-y-5">
              <input
                name="email"
                value={passwordForm.email}
                onChange={handlePasswordChange}
                placeholder="Email"
                type="email"
                className="w-full rounded-xl border border-violet-200 bg-violet-50/60 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />

              {passwordMessage && <p className="text-green-600 dark:text-green-400">{passwordMessage}</p>}
              {passwordError && <p className="text-red-600 dark:text-red-400">{passwordError}</p>}

              <button
                type="submit"
                disabled={passwordSaving}
                className="rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white hover:bg-violet-800 disabled:opacity-60 dark:bg-violet-800 dark:hover:bg-violet-700"
              >
                {passwordSaving ? 'Loading...' : 'Fetch Security Questions'}
              </button>
            </form>
          )}

          {passwordStep === 'answers' && (
            <form onSubmit={handleVerifyQuestions} className="space-y-5">
              {passwordForm.questions.map((item, index) => (
                <div key={`${item.question}-${item.index}`} className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">{item.question}</label>
                  <input
                    value={passwordForm.answers[index] || ''}
                    onChange={(e) => handleSecurityAnswerChange(index, e.target.value)}
                    placeholder="Your answer"
                    className="w-full rounded-xl border border-violet-200 bg-violet-50/60 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    required
                  />
                </div>
              ))}

              {passwordMessage && <p className="text-green-600 dark:text-green-400">{passwordMessage}</p>}
              {passwordError && <p className="text-red-600 dark:text-red-400">{passwordError}</p>}

              <div className="flex flex-wrap gap-4">
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white hover:bg-violet-800 disabled:opacity-60 dark:bg-violet-800 dark:hover:bg-violet-700"
                >
                  {passwordSaving ? 'Verifying...' : 'Verify Answers'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPasswordStep('email');
                    setPasswordError('');
                    setPasswordMessage('');
                  }}
                  className="rounded-xl border border-violet-300 bg-white px-5 py-3 font-semibold text-violet-800 hover:bg-violet-50 dark:border-slate-700 dark:bg-slate-800 dark:text-violet-200 dark:hover:bg-slate-700"
                >
                  Back
                </button>
              </div>
            </form>
          )}

          {passwordStep === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <input
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="New password"
                type="password"
                className="w-full rounded-xl border border-violet-200 bg-violet-50/60 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
              <input
                name="confirmNewPassword"
                value={passwordForm.confirmNewPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                type="password"
                className="w-full rounded-xl border border-violet-200 bg-violet-50/60 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />

              {passwordMessage && <p className="text-green-600 dark:text-green-400">{passwordMessage}</p>}
              {passwordError && <p className="text-red-600 dark:text-red-400">{passwordError}</p>}

              <div className="flex flex-wrap gap-4">
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white hover:bg-violet-800 disabled:opacity-60 dark:bg-violet-800 dark:hover:bg-violet-700"
                >
                  {passwordSaving ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPasswordStep('answers');
                    setPasswordError('');
                    setPasswordMessage('');
                  }}
                  className="rounded-xl border border-violet-300 bg-white px-5 py-3 font-semibold text-violet-800 hover:bg-violet-50 dark:border-slate-700 dark:bg-slate-800 dark:text-violet-200 dark:hover:bg-slate-700"
                >
                  Back
                </button>
              </div>
            </form>
          )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
