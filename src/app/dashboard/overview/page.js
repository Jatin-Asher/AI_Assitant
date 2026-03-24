"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '../../../components/theme-toggle';

export default function TutorDashboardOverviewPage() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white">
      <main className="max-w-5xl mx-auto p-6 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-violet-700 dark:text-violet-300">Project Summary</p>
            <h1 className="text-4xl font-bold mt-2">Tutor Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => router.push('/dashboard')}
              className="rounded-xl border border-violet-300 bg-white px-4 py-2 text-violet-800 hover:bg-violet-50 dark:border-violet-700 dark:bg-slate-900 dark:text-violet-200 dark:hover:bg-slate-800"
            >
              Back
            </button>
          </div>
        </div>

        <div className="grid gap-6">
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
              <p>2. Go to the main dashboard and select a subject.</p>
              <p>3. Start a session and ask your learning question.</p>
              <p>4. Use hint and follow-up actions to keep exploring the problem.</p>
              <p>5. Reopen recent sessions from history and continue learning where you left off.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
