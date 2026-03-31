"use client";

import { Check, X } from 'lucide-react';

const SUBJECT_OPTIONS = ['Physics', 'Chemistry', 'Math', 'Biology'];

export default function SubjectMultiSelect({ selected = [], onChange, disabled }) {
  const toggleSubject = (subject) => {
    if (disabled) return;
    const nextSelected = selected.includes(subject)
      ? selected.filter((s) => s !== subject)
      : [...selected, subject];
    onChange(nextSelected);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
        Preferred Subjects
      </label>
      <div className="flex flex-wrap gap-2">
        {SUBJECT_OPTIONS.map((subject) => {
          const isSelected = selected.includes(subject);
          return (
            <button
              key={subject}
              type="button"
              disabled={disabled}
              onClick={() => toggleSubject(subject)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {subject}
              {isSelected ? (
                <X size={14} className="hover:text-slate-200" />
              ) : (
                <Check size={14} className="opacity-0 group-hover:opacity-100" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
