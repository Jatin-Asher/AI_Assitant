"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ThemeToggle } from '../../components/theme-toggle';

const API_BASE_URL = 'http://localhost:5000';
const SECURITY_QUESTIONS = [
  'What was the name of your first school?',
  'What is your mother\'s maiden name?',
  'What was your childhood nickname?',
  'What is the name of your first best friend?',
  'What was your favorite subject in school?',
  'What is the name of the city where you were born?',
  'What is your favorite teacher\'s name?',
  'What was the name of your first pet?',
  'What is your favorite food?',
  'What is your dream job?',
];

export default function LoginPage() {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [forgotStep, setForgotStep] = useState<'email' | 'answers' | 'reset'>('email');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    terms: false,
    securityQuestionOne: SECURITY_QUESTIONS[0],
    securityAnswerOne: '',
    securityQuestionTwo: SECURITY_QUESTIONS[1],
    securityAnswerTwo: '',
  });
  const [forgotData, setForgotData] = useState({
    email: '',
    questions: [] as { index: number; question: string }[],
    answers: ['', ''],
    resetToken: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const availableQuestionTwoOptions = useMemo(
    () => SECURITY_QUESTIONS.filter((question) => question !== formData.securityQuestionOne),
    [formData.securityQuestionOne]
  );

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      router.replace('/dashboard');
      return;
    }

    const mode = searchParams.get('mode');
    if (mode === 'register') {
      setIsLoginTab(false);
    }
  }, [router, searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' && 'checked' in e.target ? e.target.checked : false;

    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };

      if (name === 'securityQuestionOne' && next.securityQuestionTwo === value) {
        next.securityQuestionTwo = SECURITY_QUESTIONS.find((question) => question !== value) || '';
      }

      return next;
    });

    if (name === 'confirmPassword') {
      setPasswordMismatch(value !== formData.password);
    }

    if (name === 'password') {
      setPasswordMismatch(Boolean(formData.confirmPassword) && value !== formData.confirmPassword);
    }

    if (error) setError('');
    if (info) setInfo('');
  };

  const handleForgotInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForgotData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError('');
    if (info) setInfo('');
  };

  const handleForgotAnswerChange = (index: number, value: string) => {
    setForgotData((prev) => {
      const nextAnswers = [...prev.answers];
      nextAnswers[index] = value;
      return {
        ...prev,
        answers: nextAnswers,
      };
    });

    if (error) setError('');
    if (info) setInfo('');
  };

  const resetForgotPasswordState = () => {
    setShowForgotPassword(false);
    setForgotStep('email');
    setForgotData({
      email: '',
      questions: [],
      answers: ['', ''],
      resetToken: '',
      newPassword: '',
      confirmNewPassword: '',
    });
    setError('');
    setInfo('');
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.token);
      router.replace('/dashboard');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setPasswordMismatch(true);
      return;
    }

    if (formData.securityQuestionOne === formData.securityQuestionTwo) {
      setError('Please select two different security questions.');
      return;
    }

    if (!formData.securityAnswerOne.trim() || !formData.securityAnswerTwo.trim()) {
      setError('Please answer both security questions.');
      return;
    }

    if (!formData.terms) {
      setError('Please accept the terms');
      return;
    }

    setLoading(true);
    setError('');
    setInfo('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          securityQuestions: [
            {
              question: formData.securityQuestionOne,
              answer: formData.securityAnswerOne,
            },
            {
              question: formData.securityQuestionTwo,
              answer: formData.securityAnswerTwo,
            },
          ],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed');
        return;
      }

      setInfo('Account created successfully. Please log in.');
      setIsLoginTab(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchSecurityQuestions = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Unable to fetch security questions.');
        return;
      }

      setForgotData((prev) => ({
        ...prev,
        questions: data.questions,
        answers: ['', ''],
      }));
      setForgotStep('answers');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAnswers = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotData.email,
          answers: forgotData.questions.map((question, index) => ({
            index: question.index,
            answer: forgotData.answers[index],
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Security answers did not match.');
        return;
      }

      setForgotData((prev) => ({
        ...prev,
        resetToken: data.resetToken,
      }));
      setForgotStep('reset');
      setInfo('Security answers verified. You can set a new password now.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (forgotData.newPassword !== forgotData.confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    setInfo('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resetToken: forgotData.resetToken,
          password: forgotData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Unable to reset password.');
        return;
      }

      setInfo('Password reset successfully. Please log in with your new password.');
      resetForgotPasswordState();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const panelClass = 'w-full border rounded-2xl px-4 py-3.5 transition-all font-medium bg-white border-violet-200 text-slate-900 focus:bg-violet-50/70 focus:border-violet-500 dark:bg-violet-950/35 dark:border-violet-500/10 dark:text-white dark:focus:bg-violet-950/55 dark:focus:border-violet-500/50';
  const primaryButtonClass = 'w-full rounded-2xl border border-violet-500/20 bg-violet-700 px-6 py-4 font-headline font-bold text-white transition-all duration-200 hover:bg-violet-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 dark:border-violet-400/20 dark:bg-violet-700 dark:hover:bg-violet-600';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white">
      <div className="absolute right-6 top-6 z-20">
        <ThemeToggle />
      </div>

      <main className="min-h-screen flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          <header className="text-center lg:text-left space-y-7 lg:sticky lg:top-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2 text-violet-700 hover:bg-violet-50 dark:border-violet-700 dark:bg-slate-900 dark:text-violet-200 dark:hover:bg-slate-800"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              <span>Back</span>
            </Link>

            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="rounded-3xl border border-violet-300/50 bg-white p-4 shadow-sm dark:border-violet-500/25 dark:bg-violet-950/50">
                <span className="material-symbols-outlined text-5xl lg:text-6xl text-violet-700 dark:text-violet-300" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
              </div>
              <h1 className="font-headline text-4xl lg:text-6xl font-extrabold tracking-tight italic">Socratic AI Tutor</h1>
            </div>

            <div className="space-y-4">
              <h2 className="font-headline text-2xl lg:text-4xl font-bold leading-tight">
                Secure study access with guided learning and secure account recovery.
              </h2>
              <p className="font-headline text-slate-600 dark:text-violet-100/70 text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Register with two security questions, recover your account when needed, and keep learning with guided AI tutoring.
              </p>
            </div>
          </header>

          <div className="w-full max-w-xl mx-auto">
            <div className="relative isolate overflow-hidden rounded-[2rem] border border-violet-200 bg-white shadow-sm dark:border-violet-500/15 dark:bg-[#120c22] dark:shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
              {!showForgotPassword && (
                <div className="tab-labels flex bg-violet-50/80 px-8 pt-6 border-b border-violet-200 dark:bg-black/20 dark:border-violet-500/10">
                  <button
                    onClick={() => setIsLoginTab(true)}
                    className={`px-8 py-4 font-headline font-bold text-xs tracking-widest transition-all duration-300 border-b-2 ${isLoginTab ? 'text-violet-800 border-violet-600 dark:text-violet-200 dark:border-violet-400' : 'border-transparent text-violet-400 hover:text-violet-700 dark:text-violet-200/45 dark:hover:text-violet-200/80'}`}
                  >
                    LOGIN
                  </button>
                  <button
                    onClick={() => setIsLoginTab(false)}
                    className={`px-8 py-4 font-headline font-bold text-xs tracking-widest transition-all duration-300 border-b-2 ${!isLoginTab ? 'text-violet-800 border-violet-600 dark:text-violet-200 dark:border-violet-400' : 'border-transparent text-violet-400 hover:text-violet-700 dark:text-violet-200/45 dark:hover:text-violet-200/80'}`}
                  >
                    REGISTER
                  </button>
                </div>
              )}

              <div className="p-8 lg:p-12">
                {error && <p className="mb-4 text-red-500 dark:text-red-300 text-sm">{error}</p>}
                {info && <p className="mb-4 text-green-600 dark:text-green-300 text-sm">{info}</p>}

                {!showForgotPassword && isLoginTab && (
                  <form onSubmit={handleLogin} className="space-y-6" id="login-form">
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={panelClass}
                      placeholder="Email Address"
                      type="email"
                      required
                    />

                    <div className="relative">
                      <input
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`${panelClass} pr-12`}
                        placeholder="Password"
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                      />
                      <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-400/80 hover:text-violet-700 dark:text-violet-200/40 dark:hover:text-violet-300">
                        <span className="material-symbols-outlined">{showLoginPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(true);
                          setForgotStep('email');
                          setError('');
                          setInfo('');
                        }}
                        className="font-semibold text-violet-700 hover:underline dark:text-violet-300"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <button
                      disabled={loading}
                      className={`${primaryButtonClass} flex items-center justify-center gap-3 py-5 shadow-sm dark:shadow-none`}
                      type="submit"
                    >
                      <span className="tracking-wide">{loading ? 'Loading...' : 'Log In'}</span>
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>

                    <p className="text-center text-sm text-slate-600 dark:text-violet-100/60">
                      Don&apos;t have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setIsLoginTab(false)}
                        className="font-semibold text-violet-700 hover:underline dark:text-violet-300"
                      >
                        Register here
                      </button>
                    </p>
                  </form>
                )}

                {!showForgotPassword && !isLoginTab && (
                  <form onSubmit={handleRegister} className="space-y-5" id="register-form">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={panelClass}
                        placeholder="Full Name"
                        type="text"
                        required
                      />
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={panelClass}
                        placeholder="Email"
                        type="email"
                        required
                      />
                    </div>

                    <div className="relative">
                      <input
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`${panelClass} pr-12`}
                        placeholder="Create Password"
                        type={showRegisterPassword ? 'text' : 'password'}
                        required
                      />
                      <button type="button" onClick={() => setShowRegisterPassword(!showRegisterPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-400/80 hover:text-violet-700 dark:text-violet-200/40 dark:hover:text-violet-300">
                        <span className="material-symbols-outlined">{showRegisterPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`${panelClass} pr-12 ${passwordMismatch ? 'border-red-400/60' : ''}`}
                        placeholder="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={`absolute right-4 top-1/2 -translate-y-1/2 ${passwordMismatch ? 'text-red-500 dark:text-red-300' : 'text-violet-400/80 hover:text-violet-700 dark:text-violet-200/40 dark:hover:text-violet-300'}`}>
                        <span className="material-symbols-outlined">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>

                    {passwordMismatch && <p className="text-[10px] text-red-500 dark:text-red-300 font-semibold">Passwords do not match</p>}

                    <div className="grid grid-cols-1 gap-4">
                      <select
                        name="securityQuestionOne"
                        value={formData.securityQuestionOne}
                        onChange={handleInputChange}
                        className={panelClass}
                      >
                        {SECURITY_QUESTIONS.map((question) => (
                          <option key={question} value={question}>
                            {question}
                          </option>
                        ))}
                      </select>
                      <input
                        name="securityAnswerOne"
                        value={formData.securityAnswerOne}
                        onChange={handleInputChange}
                        className={panelClass}
                        placeholder="Answer for security question 1"
                        type="text"
                        required
                      />

                      <select
                        name="securityQuestionTwo"
                        value={formData.securityQuestionTwo}
                        onChange={handleInputChange}
                        className={panelClass}
                      >
                        {availableQuestionTwoOptions.map((question) => (
                          <option key={question} value={question}>
                            {question}
                          </option>
                        ))}
                      </select>
                      <input
                        name="securityAnswerTwo"
                        value={formData.securityAnswerTwo}
                        onChange={handleInputChange}
                        className={panelClass}
                        placeholder="Answer for security question 2"
                        type="text"
                        required
                      />
                    </div>

                    <label className="flex items-start gap-3 py-2 text-[11px] text-slate-500 dark:text-violet-100/60">
                      <input
                        name="terms"
                        checked={formData.terms}
                        onChange={handleInputChange}
                        className="mt-1 rounded-sm border-violet-300 bg-white text-violet-600 focus:ring-violet-500 dark:border-violet-500/30 dark:bg-black/40 dark:text-violet-400"
                        type="checkbox"
                        required
                      />
                      <span>I agree to the <span className="text-violet-700 dark:text-violet-300 font-bold">Terms of Enlightenment</span>.</span>
                    </label>

                    <button
                      disabled={loading || !formData.terms || passwordMismatch}
                      className={`${primaryButtonClass} flex items-center justify-center gap-2 shadow-sm dark:shadow-none`}
                      type="submit"
                    >
                      <span>{loading ? 'Creating...' : 'Create My Account'}</span>
                      <span className="material-symbols-outlined text-lg">person_add</span>
                    </button>
                  </form>
                )}

                {showForgotPassword && forgotStep === 'email' && (
                  <form onSubmit={handleFetchSecurityQuestions} className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold">Forgot Password</h3>
                      <button type="button" onClick={resetForgotPasswordState} className="text-sm font-semibold text-violet-700 hover:underline dark:text-violet-300">
                        Cancel
                      </button>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-violet-100/70">
                      Step 1: Enter your email to fetch your saved security questions.
                    </p>
                    <input
                      name="email"
                      value={forgotData.email}
                      onChange={handleForgotInputChange}
                      className={panelClass}
                      placeholder="Email"
                      type="email"
                      required
                    />
                    <button
                      disabled={loading}
                      className={primaryButtonClass}
                      type="submit"
                    >
                      {loading ? 'Fetching...' : 'Fetch Security Questions'}
                    </button>
                  </form>
                )}

                {showForgotPassword && forgotStep === 'answers' && (
                  <form onSubmit={handleVerifyAnswers} className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold">Verify Security Answers</h3>
                      <button type="button" onClick={() => setForgotStep('email')} className="text-sm font-semibold text-violet-700 hover:underline dark:text-violet-300">
                        Back
                      </button>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-violet-100/70">
                      Step 2 and 3: Review your questions and submit the correct answers.
                    </p>
                    {forgotData.questions.map((item, index) => (
                      <div key={`${item.question}-${index}`} className="space-y-2">
                        <label className="block text-sm font-semibold">{item.question}</label>
                        <input
                          value={forgotData.answers[index] || ''}
                          onChange={(e) => handleForgotAnswerChange(index, e.target.value)}
                          className={panelClass}
                          placeholder="Your answer"
                          type="text"
                          required
                        />
                      </div>
                    ))}
                    <button
                      disabled={loading}
                      className={primaryButtonClass}
                      type="submit"
                    >
                      {loading ? 'Verifying...' : 'Verify Answers'}
                    </button>
                  </form>
                )}

                {showForgotPassword && forgotStep === 'reset' && (
                  <form onSubmit={handleResetPassword} className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold">Reset Password</h3>
                      <button type="button" onClick={() => setForgotStep('answers')} className="text-sm font-semibold text-violet-700 hover:underline dark:text-violet-300">
                        Back
                      </button>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-violet-100/70">
                      Step 5: Set your new password after successful security verification.
                    </p>
                    <div className="relative">
                      <input
                        name="newPassword"
                        value={forgotData.newPassword}
                        onChange={handleForgotInputChange}
                        className={`${panelClass} pr-12`}
                        placeholder="New password"
                        type={showResetPassword ? 'text' : 'password'}
                        required
                      />
                      <button type="button" onClick={() => setShowResetPassword(!showResetPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-400/80 hover:text-violet-700 dark:text-violet-200/40 dark:hover:text-violet-300">
                        <span className="material-symbols-outlined">{showResetPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        name="confirmNewPassword"
                        value={forgotData.confirmNewPassword}
                        onChange={handleForgotInputChange}
                        className={`${panelClass} pr-12`}
                        placeholder="Confirm new password"
                        type={showResetConfirmPassword ? 'text' : 'password'}
                        required
                      />
                      <button type="button" onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-400/80 hover:text-violet-700 dark:text-violet-200/40 dark:hover:text-violet-300">
                        <span className="material-symbols-outlined">{showResetConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                    <button
                      disabled={loading}
                      className={primaryButtonClass}
                      type="submit"
                    >
                      {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
