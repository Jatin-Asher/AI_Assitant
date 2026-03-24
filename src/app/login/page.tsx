"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '../../components/theme-toggle';

export default function LoginPage() {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    terms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'confirmPassword') {
      setPasswordMismatch(value !== formData.password);
    }

    if (name === 'password') {
      setPasswordMismatch(Boolean(formData.confirmPassword) && value !== formData.confirmPassword);
    }

    if (error) {
      setError('');
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
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

    if (!formData.terms) {
      setError('Please accept the terms');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const panelClass = 'w-full border rounded-2xl px-4 py-3.5 transition-all font-medium';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(196,181,253,0.35),_transparent_26%),linear-gradient(140deg,_#faf5ff_0%,_#f5f3ff_42%,_#eef2ff_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(88,28,135,0.55),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(76,29,149,0.35),_transparent_24%),linear-gradient(145deg,_#03040a_0%,_#0a0814_40%,_#130d24_100%)] dark:text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-violet-300/35 blur-3xl dark:bg-violet-950/50"></div>
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-fuchsia-200/40 blur-3xl dark:bg-fuchsia-950/30"></div>
      </div>

      <div className="absolute right-6 top-6 z-20">
        <ThemeToggle />
      </div>

      <main className="relative z-10 min-h-screen flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <header className="text-center lg:text-left space-y-7">
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="rounded-3xl border border-violet-300/50 bg-white/70 p-4 shadow-[0_0_40px_rgba(167,139,250,0.22)] dark:border-violet-500/25 dark:bg-violet-950/50 dark:shadow-[0_0_40px_rgba(109,40,217,0.22)]">
                <span className="material-symbols-outlined text-5xl lg:text-6xl text-violet-700 dark:text-violet-300" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
              </div>
              <h1 className="font-headline text-4xl lg:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white italic">Socratic AI Tutor</h1>
            </div>

            <div className="space-y-4">
              <h2 className="font-headline text-2xl lg:text-4xl font-bold leading-tight text-slate-900 dark:text-white">
                Learn in a clean light space, switch to <span className="text-violet-700 dark:text-violet-300">black-purple focus mode</span>.
              </h2>
              <p className="font-headline text-slate-600 dark:text-violet-100/70 text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Ask questions, explore ideas, and build intuition through guided reasoning instead of copied solutions.
              </p>
            </div>
          </header>

          <div className="w-full max-w-xl mx-auto">
            <div className="overflow-hidden rounded-[2rem] border border-violet-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(245,243,255,0.9))] shadow-[0_24px_70px_rgba(148,163,184,0.2)] backdrop-blur-xl dark:border-violet-500/15 dark:bg-[linear-gradient(180deg,rgba(12,10,25,0.96),rgba(19,15,38,0.92))] dark:shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
              <div className="tab-labels flex bg-violet-50/80 px-8 pt-6 border-b border-violet-200 dark:bg-black/20 dark:border-violet-500/10">
                <button
                  onClick={() => setIsLoginTab(true)}
                  className={`px-8 py-4 font-headline font-bold text-xs tracking-widest cursor-pointer transition-all duration-300 border-b-2 ${isLoginTab ? 'text-violet-800 border-violet-600 dark:text-violet-200 dark:border-violet-400' : 'border-transparent text-violet-400 hover:text-violet-700 dark:text-violet-200/45 dark:hover:text-violet-200/80'}`}
                >
                  LOGIN
                </button>
                <button
                  onClick={() => setIsLoginTab(false)}
                  className={`px-8 py-4 font-headline font-bold text-xs tracking-widest cursor-pointer transition-all duration-300 border-b-2 ${!isLoginTab ? 'text-violet-800 border-violet-600 dark:text-violet-200 dark:border-violet-400' : 'border-transparent text-violet-400 hover:text-violet-700 dark:text-violet-200/45 dark:hover:text-violet-200/80'}`}
                >
                  REGISTER
                </button>
              </div>

              <div className="p-8 lg:p-12">
                {isLoginTab ? (
                  <form onSubmit={handleLogin} className="space-y-6" id="login-form">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1 dark:text-violet-100/60">Email Address</label>
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`${panelClass} bg-white border-violet-200 text-slate-900 placeholder:text-violet-300/80 focus:bg-violet-50/70 focus:border-violet-500 dark:bg-violet-950/35 dark:border-violet-500/10 dark:text-white dark:placeholder:text-violet-100/30 dark:focus:bg-violet-950/55 dark:focus:border-violet-500/50`}
                        placeholder="scholar@atheneum.edu"
                        type="email"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center ml-1">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-violet-100/60">Password</label>
                        <a className="text-[10px] font-bold text-violet-700 hover:underline transition-colors uppercase tracking-widest dark:text-violet-300" href="#">Forgot?</a>
                      </div>
                      <div className="relative">
                        <input
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`${panelClass} pr-12 bg-white border-violet-200 text-slate-900 placeholder:text-violet-300/80 focus:bg-violet-50/70 focus:border-violet-500 dark:bg-violet-950/35 dark:border-violet-500/10 dark:text-white dark:placeholder:text-violet-100/30 dark:focus:bg-violet-950/55 dark:focus:border-violet-500/50`}
                          placeholder="********"
                          type={showLoginPassword ? 'text' : 'password'}
                          required
                        />
                        <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-400/80 hover:text-violet-700 dark:text-violet-200/40 dark:hover:text-violet-300">
                          <span className="material-symbols-outlined">{showLoginPassword ? 'visibility_off' : 'visibility'}</span>
                        </button>
                      </div>
                    </div>

                    {error && <p className="text-red-500 dark:text-red-300 text-sm">{error}</p>}

                    <button
                      disabled={loading}
                      className="w-full py-5 px-6 bg-gradient-to-r from-violet-800 to-violet-600 text-white font-headline font-bold rounded-DEFAULT shadow-[0_18px_40px_rgba(109,40,217,0.24)] hover:shadow-[0_22px_50px_rgba(109,40,217,0.3)] dark:from-violet-950 dark:via-violet-800 dark:to-violet-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                      type="submit"
                    >
                      <span className="tracking-wide">{loading ? 'Loading...' : 'Enter the Session'}</span>
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-5" id="register-form">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`${panelClass} bg-white border-violet-200 text-slate-900 focus:bg-violet-50/70 focus:border-violet-500 dark:bg-violet-950/35 dark:border-violet-500/10 dark:text-white dark:focus:bg-violet-950/55 dark:focus:border-violet-500/50`}
                        placeholder="Full Name"
                        type="text"
                        required
                      />
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`${panelClass} bg-white border-violet-200 text-slate-900 focus:bg-violet-50/70 focus:border-violet-500 dark:bg-violet-950/35 dark:border-violet-500/10 dark:text-white dark:focus:bg-violet-950/55 dark:focus:border-violet-500/50`}
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
                        className={`${panelClass} pr-12 bg-white border-violet-200 text-slate-900 focus:bg-violet-50/70 focus:border-violet-500 dark:bg-violet-950/35 dark:border-violet-500/10 dark:text-white dark:focus:bg-violet-950/55 dark:focus:border-violet-500/50`}
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
                        className={`${panelClass} pr-12 ${passwordMismatch ? 'border-red-400/60 text-slate-900 dark:text-white' : 'border-violet-200 text-slate-900 dark:border-violet-500/10 dark:text-white'} bg-white focus:bg-violet-50/70 focus:border-violet-500 dark:bg-violet-950/35 dark:focus:bg-violet-950/55 dark:focus:border-violet-500/50`}
                        placeholder="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={`absolute right-4 top-1/2 -translate-y-1/2 ${passwordMismatch ? 'text-red-500 dark:text-red-300' : 'text-violet-400/80 hover:text-violet-700 dark:text-violet-200/40 dark:hover:text-violet-300'}`}>
                        <span className="material-symbols-outlined">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>

                    {passwordMismatch && <p className="text-[10px] text-red-500 dark:text-red-300 font-semibold">Passwords do not match</p>}

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

                    {error && <p className="text-red-500 dark:text-red-300 text-sm">{error}</p>}

                    <button
                      disabled={loading || !formData.terms || passwordMismatch}
                      className="w-full py-4 px-6 bg-gradient-to-r from-violet-800 to-violet-600 text-white font-headline font-bold rounded-DEFAULT shadow-[0_18px_40px_rgba(109,40,217,0.24)] hover:shadow-[0_22px_50px_rgba(109,40,217,0.3)] dark:from-violet-950 dark:via-violet-800 dark:to-violet-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      type="submit"
                    >
                      <span>{loading ? 'Creating...' : 'Create My Account'}</span>
                      <span className="material-symbols-outlined text-lg">person_add</span>
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
