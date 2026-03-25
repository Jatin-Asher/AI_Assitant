"use client";

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Edit2, Save, X, User, Mail, BookOpen } from 'lucide-react';
import SubjectMultiSelect from './SubjectMultiSelect';

const API_BASE_URL = 'http://localhost:5001';

const profileSchema = z.object({
  name: z.string().min(1, 'Display name is required'),
  bio: z.string().max(200, 'Bio must be less than 200 characters').optional().or(z.literal('')),
  preferredSubjects: z.array(z.string()).default([]),
});

export default function ProfileForm({ user, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
      preferredSubjects: user?.preferredSubjects || [],
    },
  });

  // Sync form values when user data changes (e.g. initial load)
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        bio: user.bio || '',
        preferredSubjects: user.preferredSubjects || [],
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage('');
    setError('');

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update profile');
      }

      setMessage('Profile updated successfully!');
      setIsEditing(false);
      if (onUpdate) onUpdate(result.user);
      
      // Update local storage for immediate sidebar update
      localStorage.setItem('userName', result.user.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
    setError('');
    setMessage('');
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-md p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 transition-all">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Information</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage your personal information and learning preferences.
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 rounded-xl bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-100 dark:bg-violet-900/30 dark:text-violet-300 dark:hover:bg-violet-900/50"
          >
            <Edit2 size={16} />
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Display Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <User size={16} className="text-violet-600" />
              Full Name
            </label>
            <input
              {...register('name')}
              disabled={!isEditing}
              className={`w-full rounded-xl border px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400 dark:bg-slate-800 dark:text-white transition-all ${
                !isEditing ? 'bg-slate-50 border-slate-100 cursor-not-allowed dark:border-slate-800/50' : 'border-violet-200 bg-white dark:border-slate-700'
              }`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          {/* Email (Always Read-only) */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <Mail size={16} className="text-violet-600" />
              Email Address
            </label>
            <input
              value={user?.email || ''}
              disabled
              className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-slate-500 cursor-not-allowed dark:border-slate-800/50 dark:bg-slate-800/50 dark:text-slate-500"
            />
            <p className="text-[10px] text-slate-400 italic">Email cannot be changed.</p>
          </div>


          {/* Preferred Subjects */}
          <div className="md:col-span-2">
             <Controller
              name="preferredSubjects"
              control={control}
              render={({ field }) => (
                <SubjectMultiSelect
                  disabled={!isEditing}
                  selected={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          {/* Bio */}
          <div className="md:col-span-2 space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <BookOpen size={16} className="text-violet-600" />
              Bio
            </label>
            <textarea
              {...register('bio')}
              disabled={!isEditing}
              rows={3}
              placeholder="Tell us about yourself..."
              className={`w-full rounded-xl border px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400 dark:bg-slate-800 dark:text-white transition-all resize-none ${
                !isEditing ? 'bg-slate-50 border-slate-100 cursor-not-allowed dark:border-slate-800/50' : 'border-violet-200 bg-white dark:border-slate-700'
              }`}
            />
            {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>}
          </div>
        </div>

        {isEditing && (
          <div className="pt-4 flex items-center gap-4">
            <button
              type="submit"
              disabled={loading || !isDirty}
              className="flex items-center gap-2 rounded-xl bg-violet-700 px-6 py-3 font-semibold text-white transition hover:bg-violet-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-200 dark:shadow-none"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <Save size={18} />
              )}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            {!isDirty && (
              <p className="text-xs text-slate-400 italic">No changes detected.</p>
            )}
          </div>
        )}

        {(message || error) && (
          <div className={`p-4 rounded-xl mt-4 ${message ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'}`}>
            {message || error}
          </div>
        )}
      </form>
    </div>
  );
}
