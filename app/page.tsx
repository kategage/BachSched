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
      <div className="bg-white shadow-2xl p-12 max-w-2xl w-full border-t-8 rounded-lg" style={{ borderTopColor: '#0A2E4D' }}>

        {/* Logo/Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🌊</div>
          <h1 className="font-serif text-2xl tracking-widest uppercase text-gray-600 mb-3">
            COASTAL CELEBRATION EXPEDITION
          </h1>
          <div className="w-24 h-1 mx-auto mb-5" style={{ backgroundColor: '#62B6CB' }}></div>
          <h2 className="font-serif text-5xl font-bold mb-4" style={{ color: '#0A2E4D' }}>
            Dr. Ayana Elizabeth Johnson
          </h2>
          <p className="text-lg text-gray-600 font-light">
            Potential Expedition Dates: March 6th–22nd 2028
          </p>
        </div>

        {/* Expedition details box */}
        <div className="border-l-4 p-6 mb-10 rounded-r-lg" style={{ backgroundColor: '#F9F7F4', borderLeftColor: '#62B6CB' }}>
          <h3 className="font-semibold mb-3 uppercase text-sm tracking-wider" style={{ color: '#0A2E4D' }}>EXPEDITION DETAILS</h3>
          <p className="text-gray-700 leading-relaxed">
            Join Dr. Johnson for a coastal celebration combining ocean views,
            scientific inquiry, and fellowship. We're assembling a crew for a multi-day field study.
          </p>
        </div>

        {/* Application form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <label htmlFor="name" className="block text-base font-semibold tracking-wider uppercase mb-4" style={{ color: '#0A2E4D' }}>
              Expedition Member Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 text-xl border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{
                height: '70px',
                borderColor: name ? '#0A2E4D' : '#D1D5DB'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#0A2E4D';
                e.target.style.boxShadow = '0 0 0 3px rgba(98, 182, 203, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = name ? '#0A2E4D' : '#D1D5DB';
                e.target.style.boxShadow = 'none';
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
            className="w-full text-white text-xl font-bold tracking-wide transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-lg hover:shadow-xl"
            style={{
              height: '70px',
              backgroundColor: '#0A2E4D'
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#1B4965')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#0A2E4D')}
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
