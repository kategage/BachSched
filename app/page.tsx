'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);

    try {
      // Generate unique ID
      const uniqueId = uuidv4();

      // Create participant
      const { data, error: supabaseError } = await supabase
        .from('participants')
        .insert([
          {
            name: name.trim(),
            unique_id: uniqueId,
          },
        ])
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      // Redirect to schedule page with unique ID
      router.push(`/schedule?id=${uniqueId}`);
    } catch (err) {
      console.error('Error creating participant:', err);
      setError('Failed to create your profile. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="portal-card animate-fade-in text-center">
        {/* Palm tree emoji at top */}
        <div className="text-5xl mb-6">🌴</div>

        {/* Main heading */}
        <h1 className="text-sm tracking-widest text-gray-500 mb-2">
          WELCOME TO
        </h1>
        <h2 className="font-display font-bold text-3xl md:text-4xl mb-4" style={{ color: '#14B8A6' }}>
          AYANA'S BACHELORETTE
        </h2>

        {/* Subheading */}
        <p className="text-base font-semibold mb-8" style={{ color: '#FB923C' }}>
          Beach Getaway • March 6-22, 2025
        </p>

        {/* Wave divider */}
        <div className="text-3xl mb-8">🌊</div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label
              htmlFor="name"
              className="block text-base font-semibold text-gray-700 mb-2"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-14 px-4 border-2 rounded-lg focus:outline-none focus:ring-4 text-gray-900 text-base placeholder:text-gray-400 transition-all"
              style={{
                borderColor: '#14B8A6',
                minHeight: '56px'
              }}
              placeholder="Enter your name"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 text-white font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-base"
            style={{
              backgroundColor: '#14B8A6',
              minHeight: '56px'
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              "Let's Go! →"
            )}
          </button>
        </form>

        {/* Sun emoji at bottom */}
        <div className="text-3xl mt-8">☀️</div>

        {/* Admin link */}
        <div className="mt-6">
          <a
            href="/admin"
            className="text-xs text-gray-400 hover:text-teal-500 transition-colors"
          >
            Admin Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
