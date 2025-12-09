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
      <div className="max-w-lg w-full animate-fade-in">
        {/* Tropical Hero Header */}
        <div className="bg-gradient-to-r from-tropical-turquoise via-tropical-aqua to-tropical-coral rounded-3xl shadow-2xl p-8 mb-6 wave-divider text-center">
          <div className="text-6xl mb-3">🌴</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            WELCOME TO AYANA'S
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            BACHELORETTE 🌊
          </h2>
          <p className="text-white/90 text-lg font-medium">
            Help us plan Ayana's beach bachelorette!
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-tropical-turquoise/20">
          {/* Info Card */}
          <div className="mb-8 p-5 bg-gradient-to-br from-tropical-sky to-tropical-cream rounded-2xl border-2 border-tropical-turquoise/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">📅</span>
              <p className="text-lg font-bold text-tropical-navy">
                March 6-22, 2025
              </p>
            </div>
            <p className="text-sm text-tropical-teal text-center font-medium">
              Select your availability for Ayana's celebration! 🍹
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-tropical-navy mb-2"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-4 border-2 border-tropical-turquoise/40 rounded-xl focus:outline-none focus:ring-4 focus:ring-tropical-turquoise/30 focus:border-tropical-turquoise text-tropical-navy font-medium transition-all placeholder:text-gray-400"
                placeholder="Enter your name"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-tropical-coral/10 border-2 border-tropical-coral text-tropical-coral px-5 py-4 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-tropical-turquoise to-tropical-aqua text-white font-bold py-5 px-6 rounded-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg"
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
                'Continue to Calendar 🌺'
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-tropical-teal font-medium">
              ✨ You'll get a unique link to edit your availability anytime!
            </p>
          </div>
        </div>

        {/* Admin Link */}
        <div className="text-center mt-6">
          <a
            href="/admin"
            className="text-sm text-tropical-teal hover:text-tropical-turquoise transition-colors font-medium inline-flex items-center gap-1"
          >
            Admin Dashboard →
          </a>
        </div>
      </div>
    </div>
  );
}
