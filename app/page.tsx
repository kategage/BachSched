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
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Tropical Header */}
        <div className="text-center mb-10">
          <div className="bg-gradient-to-r from-[#14B8A6] to-[#FB7185] rounded-2xl p-8 mb-8 shadow-lg">
            <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-3">
              Ayana's Bachelorette
            </h1>
            <p className="text-white/90 text-lg">
              Help us plan the perfect beach celebration! 🌴
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
          {/* Date Range Info */}
          <div className="mb-10 p-5 bg-gradient-to-r from-[#14B8A6]/10 to-[#FB7185]/10 rounded-xl border-2 border-[#14B8A6]/20">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-6 h-6 text-[#14B8A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="font-bold text-gray-900 text-lg">
                March 6-22, 2025
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="max-w-md mx-auto">
              <label
                htmlFor="name"
                className="block text-xl font-bold text-gray-900 mb-3"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-14 px-4 border-2 border-[#14B8A6] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#14B8A6]/30 text-gray-900 text-lg placeholder:text-gray-400 transition-all"
                placeholder="Enter your name"
                disabled={loading}
                style={{ minHeight: '56px', fontSize: '18px', padding: '16px' }}
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-300 text-red-700 px-5 py-4 rounded-xl text-sm font-medium max-w-md mx-auto">
                {error}
              </div>
            )}

            <div className="max-w-md mx-auto">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#14B8A6] text-white font-bold rounded-xl hover:bg-[#0D9488] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
                style={{ minHeight: '56px' }}
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
                  'Continue to Calendar'
                )}
              </button>
            </div>
          </form>

          {/* Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              ✨ You'll get a unique link to update your availability anytime
            </p>
          </div>
        </div>

        {/* Admin Link */}
        <div className="text-center mt-6">
          <a
            href="/admin"
            className="text-sm text-gray-600 hover:text-[#14B8A6] transition-colors font-medium"
          >
            Admin Dashboard →
          </a>
        </div>
      </div>
    </div>
  );
}
