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
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white shadow-2xl p-12 max-w-3xl w-full border-t-8 rounded-lg" style={{ borderTopColor: '#05324F' }}>

        {/* Logo/Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🌊</div>
          <h1 className="font-serif text-2xl tracking-widest uppercase text-gray-600 mb-3">
            COASTAL CELEBRATION EXPEDITION
          </h1>
          <div className="w-24 h-1 mx-auto mb-5" style={{ backgroundColor: '#B7E3E0' }}></div>
          <h2 className="font-serif text-5xl font-bold mb-4" style={{ color: '#05324F' }}>
            Dr. Ayana Elizabeth Johnson
          </h2>
          <p className="text-lg text-gray-600 font-light">
            Beach Research Site • March 6–22, 2026
          </p>
        </div>

        {/* Expedition details box */}
        <div className="border-l-4 p-6 mb-10 rounded-r-lg" style={{ backgroundColor: '#F3E9D2', borderLeftColor: '#B7E3E0' }}>
          <h3 className="font-semibold mb-3 uppercase text-sm tracking-wider" style={{ color: '#05324F' }}>EXPEDITION DETAILS</h3>
          <p className="text-gray-700 leading-relaxed">
            Join Dr. Johnson for a coastal celebration combining ocean views,
            scientific inquiry, and fellowship. We're assembling a crew of 15
            expedition members for a multi-day field study.
          </p>
        </div>

        {/* Application form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <label htmlFor="name" className="block text-sm font-semibold tracking-wider uppercase mb-3" style={{ color: '#05324F' }}>
              Expedition Member Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-14 px-4 text-lg border-2 border-gray-300 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{
                borderColor: name ? '#05324F' : '#D1D5DB',
                focusRingColor: '#B7E3E0'
              }}
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-600 text-red-700 px-4 py-3 mb-6 rounded-r">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 text-white text-lg font-semibold tracking-wide transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed rounded-md shadow-lg hover:shadow-xl"
            style={{
              backgroundColor: '#05324F'
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#03243A')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#05324F')}
          >
            {loading ? 'Loading...' : 'Begin Availability Assessment →'}
          </button>
        </form>

        <div className="text-center mt-10 text-sm text-gray-500 italic">
          <p>🌊 Sustainable celebration planning • Ocean-friendly gathering</p>
        </div>

        {/* Admin link */}
        <div className="mt-6 text-center">
          <a
            href="/admin"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Admin Dashboard
          </a>
        </div>

      </div>
    </div>
  );
}
