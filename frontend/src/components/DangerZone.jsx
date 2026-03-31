"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../lib/api';
import DeleteModal from './DeleteModal';

export default function DangerZone() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to delete account');
      }

      // Success! Clear storage and redirect
      localStorage.clear();
      router.push('/');
      
      // Force a page reload to clear any remaining state
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 rounded-3xl border border-red-200 bg-red-50/30 p-8 shadow-sm dark:border-red-900/30 dark:bg-red-900/5 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertCircle size={20} />
            <h2 className="text-xl font-bold">Danger Zone</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Thinking about leaving Socratic AI? Deleting your account is <span className="font-semibold text-red-600 underline">permanent</span>. 
            All your progress, sessions, and customized settings will be wiped from our servers immediately.
          </p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-4 text-sm font-bold text-white transition hover:bg-red-700 shadow-lg shadow-red-100 dark:shadow-none whitespace-nowrap"
        >
          <Trash2 size={18} />
          Delete My Account
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-xl bg-red-100 text-red-700 text-sm font-medium border border-red-200">
          Error: {error}
        </div>
      )}

      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteAccount}
        loading={loading}
      />
    </div>
  );
}
