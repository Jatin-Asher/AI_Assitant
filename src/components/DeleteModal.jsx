"use client";

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteModal({ isOpen, onClose, onConfirm, loading }) {
  const [confirmText, setConfirmText] = useState('');
  const isConfirmed = confirmText === 'DELETE';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-8 shadow-2xl transition-all dark:bg-slate-900 border border-red-100 dark:border-red-900/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 text-red-600">
            <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/30">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold">Are you absolutely sure?</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            This action is <span className="font-bold text-red-600">permanent</span> and cannot be undone. 
            All your profile data, sessions, and learning history will be deleted forever.
          </p>

          <div className="rounded-xl bg-amber-50 p-4 border border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/30">
             <p className="text-xs text-amber-800 dark:text-amber-200 font-medium">
               To confirm, please type <span className="font-bold">DELETE</span> in the box below.
             </p>
          </div>

          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE to confirm"
            className="w-full rounded-xl border border-red-100 bg-red-50/30 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400 dark:border-red-900/30 dark:bg-red-900/10 dark:text-white transition-all font-mono text-center uppercase tracking-widest"
          />

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!isConfirmed || loading}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-200 dark:shadow-none"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : null}
              {loading ? 'Deleting...' : 'Permanently Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
