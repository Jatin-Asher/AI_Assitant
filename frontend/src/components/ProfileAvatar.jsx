"use client";

import { useState, useRef } from 'react';
import { Camera, UploadCloud } from 'lucide-react';
import { API_BASE_URL } from '../lib/api';
import { uploadAvatar } from '../lib/upload';

export default function ProfileAvatar({ user, onUploadSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(user?.avatarUrl ? `${API_BASE_URL}${user.avatarUrl}` : '');
  const fileInputRef = useRef(null);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please use JPG, PNG, or WEBP.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('File too large. Max size is 2MB.');
      return;
    }

    setError('');
    setLoading(true);

    // Instant Preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      const data = await uploadAvatar(file);
      if (onUploadSuccess) {
        onUploadSuccess(data.url);
      }
    } catch (err) {
      setError(err.message || 'Upload failed.');
      // Revert preview on failure
      setPreviewUrl(user?.avatarUrl ? `${API_BASE_URL}${user.avatarUrl}` : '');
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 bg-white/70 backdrop-blur-md border border-slate-200 rounded-3xl p-6 dark:bg-slate-900/50 dark:border-slate-800 transition-all">
      <div className="relative group cursor-pointer" onClick={triggerFileInput}>
        {/* Avatar Circle */}
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center dark:border-slate-800">
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt={user?.name} 
              className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}
            />
          ) : (
            <span className="text-white text-3xl font-bold tracking-wider">
              {getInitials(user?.name)}
            </span>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <Camera className="text-white" size={32} />
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-violet-700 border-t-transparent"></div>
          </div>
        )}
      </div>

      <div className="text-center md:text-left flex-1">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 justify-center md:justify-start">
          {user?.name || 'Loading...'}
          <span className="bg-violet-100 text-violet-700 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full dark:bg-violet-900/50 dark:text-violet-300">
            Premium Student
          </span>
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mt-1 mb-4">{user?.email}</p>
        
        <button 
          onClick={triggerFileInput}
          disabled={loading}
          className="text-violet-700 font-semibold hover:underline text-sm flex items-center gap-2 transition-all dark:text-violet-400 disabled:opacity-50"
        >
          <UploadCloud size={16} />
          {loading ? 'Uploading...' : 'Change profile photo'}
        </button>

        {error && (
          <p className="mt-3 text-sm text-red-500 font-medium bg-red-50 px-3 py-2 rounded-xl dark:bg-red-500/10 inline-block">
            {error}
          </p>
        )}
      </div>

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
}
