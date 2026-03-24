"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SessionPage() {
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('Physics');
  const [topicInput, setTopicInput] = useState('');
  const [currentFocus, setCurrentFocus] = useState({
    subject: 'Physics',
    title: 'Forces in Equilibrium',
    question: 'Is Normal Force Always Equal to Gravity?'
  });
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/login');
      return;
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleStartSession = () => {
    // Route to actual chat/tutor session
    router.push('/chat');
  };

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-900">
        <p className="text-lg text-slate-200">Loading...</p>
      </main>
    );
  }

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      {/* Sidebar */}
      <aside className="w-48 bg-slate-950 border-r border-slate-800 p-6 flex flex-col">
        <div className="mb-8 flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <span className="text-xl">AI</span>
          </div>
          <span className="font-bold text-sm">Tutor</span>
        </div>

        <nav className="space-y-4 flex-1">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/50 text-slate-300">
            <span className="text-lg">📋</span>
            <span className="text-sm font-medium">My Sessions</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800/30 transition text-slate-400">
            <span className="text-lg">📚</span>
            <span className="text-sm font-medium">Topic Library</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800/30 transition text-slate-400">
            <span className="text-lg">📊</span>
            <span className="text-sm font-medium">Tutor Dashboard</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800/30 transition text-slate-400">
            <span className="text-lg">⚙️</span>
            <span className="text-sm font-medium">Settings</span>
          </div>
        </nav>

        {/* Chat History */}
        <div className="border-t border-slate-800 pt-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">Chat History</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <div className="p-2 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition cursor-pointer">
              <p className="text-xs font-medium text-slate-300">Physics</p>
              <p className="text-xs text-slate-500">15:30</p>
              <p className="text-xs text-slate-400 truncate">Forces in Equilibrium ...</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition cursor-pointer">
              <p className="text-xs font-medium text-slate-300">Math</p>
              <p className="text-xs text-slate-500">14:55</p>
              <p className="text-xs text-slate-400 truncate">Quadratic Formula</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition cursor-pointer">
              <p className="text-xs font-medium text-slate-300">Biology</p>
              <p className="text-xs text-slate-500">Yesterday</p>
              <p className="text-xs text-slate-400 truncate">Cellular Respiration</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition cursor-pointer">
              <p className="text-xs font-medium text-slate-300">Socratic</p>
              <p className="text-xs text-slate-500">Yesterday</p>
              <p className="text-xs text-slate-400 truncate">Kinematics Insight</p>
            </div>
          </div>
        </div>

        {/* User Badge */}
        <div className="border-t border-slate-800 pt-4 mt-4">
          <p className="text-xs text-slate-500 mb-2">v1.4 • Premium Subscription Active</p>
          <button
            onClick={handleLogout}
            className="w-full py-2 text-xs font-medium bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b border-slate-800 p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Start Session</h1>
          <button className="text-slate-400 hover:text-slate-300">⋮</button>
        </div>

        {/* Content */}
        <div className="p-8 max-w-2xl">
          <h2 className="text-3xl font-bold mb-2">Welcome to Socratic AI Tutor</h2>
          <p className="text-slate-400 mb-8">Start a New Learning Session</p>

          {/* Session Setup Card */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 mb-8">
            <div className="flex justify-between items-start mb-8">
              <h3 className="text-xl font-bold">Session Setup & Selection</h3>
              <button
                onClick={handleStartSession}
                className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg transition"
              >
                Start Session Now
              </button>
            </div>

            {/* Subject and Topic Selection */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Subject Dropdown */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-violet-500 appearance-none cursor-pointer"
                >
                  <option value="Physics">Physics</option>
                  <option value="Math">Math</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>

              {/* Topic Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Topic or Problem Link (Optional)</label>
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="e.g., forces on an inclined plane or problem #4"
                  className="w-full px-4 py-2 bg-slate-700 text-white placeholder-slate-500 rounded-lg border border-slate-600 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            {/* Your Current Focus */}
            <div className="mb-8">
              <h4 className="text-lg font-bold mb-4">Your Current Focus</h4>
              <div className="bg-slate-900/50 border border-slate-600 rounded-xl p-6 flex items-start gap-4 hover:border-slate-500 transition cursor-pointer">
                <div className="w-12 h-12 bg-violet-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⚛️</span>
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-white">{currentFocus.title}</h5>
                  <p className="text-slate-400">{currentFocus.question}</p>
                </div>
                <span className="text-slate-500 text-xl">›</span>
              </div>
            </div>

            {/* Session Status */}
            <div className="pt-6 border-t border-slate-700">
              <p className="text-sm font-medium text-slate-400">Session Status: <span className="text-violet-400">Setup</span></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
