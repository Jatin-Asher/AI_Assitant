"use client";

import React, { Suspense, useEffect, useMemo, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';
import { ThemeToggle } from '../../components/theme-toggle';
import {
  BrainCircuit, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  UserPlus, 
  LogIn, 
  ShieldQuestion,
  Lock,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  Camera,
  Upload
} from 'lucide-react';

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

function LoginPageContent() {
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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    const checked = type === 'checkbox' && 'checked' in e.target ? (e.target as HTMLInputElement).checked : false;

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
      if (data.user?.name) {
        localStorage.setItem('userName', data.user.name);
      }
      if (data.user?.email) {
        localStorage.setItem('userEmail', data.user.email);
      }
      router.replace('/dashboard');
    } catch (err: any) {
      if (typeof window !== 'undefined' && localStorage.getItem('token')) {
        router.replace('/dashboard');
      } else {
        setError(err.message || 'Network error. Please try again.');
      }
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

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('name', formData.name);
    formDataToSubmit.append('email', formData.email);
    formDataToSubmit.append('password', formData.password);
    formDataToSubmit.append('securityQuestions', JSON.stringify([
      {
        question: formData.securityQuestionOne,
        answer: formData.securityAnswerOne,
      },
      {
        question: formData.securityQuestionTwo,
        answer: formData.securityAnswerTwo,
      },
    ]));
    
    if (avatarFile) {
      formDataToSubmit.append('avatar', avatarFile);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        body: formDataToSubmit,
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

  const panelClass = 'w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600';
  const primaryButtonClass = 'w-full py-4 px-6 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-lg shadow-violet-200 dark:shadow-none transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 transition-colors duration-500">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-violet-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-5xl grid gap-10 lg:grid-cols-2 lg:gap-12 items-center">
        {/* Left: Brand Info */}
        <div className="hidden lg:block space-y-12 animate-in fade-in slide-in-from-left duration-700">
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm hover:text-violet-600 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="space-y-6">
            <div className="h-16 w-16 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-2xl shadow-violet-200 dark:shadow-none">
              <BrainCircuit size={36} />
            </div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.95]">
              Accelerate your<br/>
              <span className="text-violet-600 italic">Intellect.</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-bold max-w-md leading-relaxed">
              Experience the Socratic method powered by high-fidelity AI components. Secure access, cognitive mapping, and guided discovery.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <ShieldQuestion size={24} className="text-violet-600 mb-4" />
                <h3 className="font-black text-sm uppercase tracking-widest text-slate-400 mb-2">Secure Recovery</h3>
                <p className="text-xs font-bold text-slate-500">Advanced security questions for account protection.</p>
             </div>
             <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <CheckCircle2 size={24} className="text-emerald-500 mb-4" />
                <h3 className="font-black text-sm uppercase tracking-widest text-slate-400 mb-2">Verified Growth</h3>
                <p className="text-xs font-bold text-slate-500">Join 2,400+ students mastering disciplines daily.</p>
             </div>
          </div>
        </div>

        {/* Right: Auth Card */}
        <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-right duration-700">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Tabs */}
            {!showForgotPassword && (
              <div className="flex border-b border-slate-50 dark:border-slate-800/50">
                <button 
                  onClick={() => setIsLoginTab(true)}
                  className={`flex-1 py-6 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${isLoginTab ? 'text-violet-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                >
                  Log In
                  {isLoginTab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-violet-600 animate-in slide-in-from-bottom-full"></div>}
                </button>
                <button 
                  onClick={() => setIsLoginTab(false)}
                  className={`flex-1 py-6 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${!isLoginTab ? 'text-violet-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                >
                  Register
                  {!isLoginTab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-violet-600 animate-in slide-in-from-bottom-full"></div>}
                </button>
              </div>
            )}

            <div className="space-y-8 p-6 md:p-10">
              {/* Messages */}
              {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-950 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-4">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
              {info && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-4">
                  <CheckCircle2 size={16} />
                  {info}
                </div>
              )}

              {/* Login Form */}
              {!showForgotPassword && isLoginTab && (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`${panelClass} pl-12`}
                        placeholder="name@company.com"
                        type="email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                      <button 
                        type="button" 
                        onClick={() => setShowForgotPassword(true)}
                        className="text-[10px] font-black uppercase tracking-widest text-violet-600 hover:text-violet-700 transition-colors"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`${panelClass} pl-12 pr-12`}
                        placeholder="••••••••"
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                      />
                      <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                        {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button disabled={loading} type="submit" className={primaryButtonClass}>
                    {loading ? 'Authenticating...' : (
                      <>
                        Log In
                        <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Register Form */}
              {!showForgotPassword && !isLoginTab && (
                <form onSubmit={handleRegister} className="space-y-5">
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center gap-4 mb-6">
                    <div className="relative group">
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="h-24 w-24 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center cursor-pointer overflow-hidden transition-all group-hover:border-violet-400 group-hover:bg-violet-50/30 shadow-inner"
                      >
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center text-slate-400 group-hover:text-violet-500">
                            <Camera size={24} />
                            <span className="text-[10px] font-black mt-1">PHOTO</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Upload size={20} className="text-white" />
                        </div>
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*"
                      />
                    </div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Click to upload identity</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={panelClass}
                        placeholder="John Doe"
                        type="text"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={panelClass}
                        placeholder="name@email.com"
                        type="email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Create Password</label>
                    <div className="relative">
                      <input
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`${panelClass} pr-12`}
                        placeholder="Minimum 8 characters"
                        type={showRegisterPassword ? 'text' : 'password'}
                        required
                      />
                      <button type="button" onClick={() => setShowRegisterPassword(!showRegisterPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Password</label>
                    <div className="relative">
                      <input
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`${panelClass} pr-12 ${passwordMismatch ? 'border-red-500' : ''}`}
                        placeholder="Repeat password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-violet-600/80">Security Protocol</p>
                    <div className="grid grid-cols-1 gap-3">
                      <select name="securityQuestionOne" value={formData.securityQuestionOne} onChange={handleInputChange} className={panelClass}>
                        {SECURITY_QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                      </select>
                      <input
                        name="securityAnswerOne"
                        value={formData.securityAnswerOne}
                        onChange={handleInputChange}
                        className={panelClass}
                        placeholder="Answer for #1"
                        type="text"
                        required
                      />

                      <select name="securityQuestionTwo" value={formData.securityQuestionTwo} onChange={handleInputChange} className={panelClass}>
                        {availableQuestionTwoOptions.map(q => <option key={q} value={q}>{q}</option>)}
                      </select>
                      <input
                        name="securityAnswerTwo"
                        value={formData.securityAnswerTwo}
                        onChange={handleInputChange}
                        className={panelClass}
                        placeholder="Answer for #2"
                        type="text"
                        required
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-3 p-2 cursor-pointer group">
                    <input
                      name="terms"
                      checked={formData.terms}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 transition-all"
                      type="checkbox"
                      required
                    />
                    <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-700">I accept the Terms and Cognitive Privacy Policy</span>
                  </label>

                  <button disabled={loading || !formData.terms || passwordMismatch} type="submit" className={primaryButtonClass}>
                    {loading ? 'Creating Identity...' : (
                      <>
                        Create Account
                        <UserPlus size={20} className="group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Forgot Password Flow */}
              {showForgotPassword && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Identity Recovery</h3>
                    <button onClick={resetForgotPasswordState} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-violet-600 transition-colors">Cancel</button>
                  </div>

                  {forgotStep === 'email' && (
                    <form onSubmit={handleFetchSecurityQuestions} className="space-y-6">
                      <p className="text-xs font-bold text-slate-500 leading-relaxed italic">Enter your address to retrieve your cognitive security tokens.</p>
                      <input
                        name="email"
                        value={forgotData.email}
                        onChange={handleForgotInputChange}
                        className={panelClass}
                        placeholder="Registered Email"
                        type="email"
                        required
                      />
                      <button disabled={loading} type="submit" className={primaryButtonClass}>
                        {loading ? 'Fetching...' : 'Continue'}
                      </button>
                    </form>
                  )}

                  {forgotStep === 'answers' && (
                    <form onSubmit={handleVerifyAnswers} className="space-y-6">
                      <p className="text-xs font-bold text-slate-500 leading-relaxed italic">Verify your identity by answering your pre-set security metrics.</p>
                      {forgotData.questions.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{item.question}</label>
                          <input
                            value={forgotData.answers[index] || ''}
                            onChange={(e) => handleForgotAnswerChange(index, e.target.value)}
                            className={panelClass}
                            placeholder="Your Response"
                            type="text"
                            required
                          />
                        </div>
                      ))}
                      <button disabled={loading} type="submit" className={primaryButtonClass}>
                        {loading ? 'Verifying...' : 'Unlock Identity'}
                      </button>
                    </form>
                  )}

                  {forgotStep === 'reset' && (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                      <p className="text-xs font-bold text-slate-500 leading-relaxed italic">Create a new secure access key for your account.</p>
                      <div className="space-y-4">
                        <div className="relative">
                          <input
                            name="newPassword"
                            value={forgotData.newPassword}
                            onChange={handleForgotInputChange}
                            className={`${panelClass} pr-12`}
                            placeholder="New Password"
                            type={showResetPassword ? 'text' : 'password'}
                            required
                          />
                          <button type="button" onClick={() => setShowResetPassword(!showResetPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                             {showResetPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            name="confirmNewPassword"
                            value={forgotData.confirmNewPassword}
                            onChange={handleForgotInputChange}
                            className={`${panelClass} pr-12`}
                            placeholder="Confirm New Password"
                            type={showResetConfirmPassword ? 'text' : 'password'}
                            required
                          />
                          <button type="button" onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                             {showResetConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      <button disabled={loading} type="submit" className={primaryButtonClass}>
                        {loading ? 'Resetting...' : 'Save and Continue'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen grid place-items-center bg-slate-50 dark:bg-slate-950">
          <p className="text-lg text-slate-700 dark:text-slate-200">Loading login...</p>
        </main>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
