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
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-party-pink">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-party-purple mb-2">
              💒 Bachelorette Party! 💒
            </h1>
            <p className="text-gray-600 text-lg">
              Help us find the perfect dates!
            </p>
            <div className="mt-4 p-4 bg-pink-50 rounded-lg">
              <p className="text-sm text-gray-700">
                📅 <strong>March 6-22, 2025</strong>
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Select your availability for each day
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-party-pink rounded-lg focus:outline-none focus:ring-2 focus:ring-party-purple focus:border-transparent text-gray-900"
                placeholder="Enter your name"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-party-pink to-party-purple text-white font-bold py-4 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-lg shadow-lg"
            >
              {loading ? 'Loading...' : 'Continue to Calendar 🎉'}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>You'll get a unique link to edit your availability anytime!</p>
          </div>
        </div>

        {/* Admin Link */}
        <div className="text-center mt-4">
          <a
            href="/admin"
            className="text-sm text-party-purple hover:text-party-pink transition-colors"
          >
            Admin Dashboard →
          </a>
        </div>
      </div>
    </div>
  );
}
