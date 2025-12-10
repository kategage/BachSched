'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase, type Participant } from '@/lib/supabase';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const uniqueId = searchParams.get('id');
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uniqueId) {
      window.location.href = '/';
      return;
    }

    loadParticipant();
  }, [uniqueId]);

  const loadParticipant = async () => {
    try {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('unique_id', uniqueId)
        .single();

      if (error) throw error;

      setParticipant(data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading participant:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <svg className="animate-spin h-8 w-8 mx-auto mb-4" style={{ color: '#0A2E4D' }} viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-black font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-white">
      <div className="bg-white p-8 sm:p-12 max-w-xl w-full border-t-8 text-center rounded-2xl shadow-2xl" style={{
        borderTopColor: '#0A2E4D',
        boxShadow: '0 25px 50px -12px rgba(10, 46, 77, 0.25)'
      }}>

        <div className="text-6xl mb-6">✨</div>

        <h1 className="font-serif text-3xl mb-4" style={{ color: '#0A2E4D' }}>
          Expedition Application Submitted
        </h1>

        <p className="text-lg text-gray-700 mb-8">
          Thank you, <span className="font-semibold">{participant?.name}</span>. Your availability
          assessment has been recorded for Dr. Johnson's coastal celebration expedition.
        </p>

        {/* Venn Diagram - Sweet Spot */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8 mb-6">
          <h3 className="text-center font-bold text-xl mb-6 text-green-900">
            ✓ You've Found Your Sweet Spot!
          </h3>

          <div className="max-w-sm mx-auto mb-6">
            <svg viewBox="0 0 300 300" className="w-full">
              {/* Three overlapping circles */}
              <circle cx="150" cy="120" r="75" fill="#10B981" opacity="0.4"/>
              <circle cx="110" cy="180" r="75" fill="#3B82F6" opacity="0.4"/>
              <circle cx="190" cy="180" r="75" fill="#F59E0B" opacity="0.4"/>

              {/* Labels */}
              <text x="150" y="60" fill="#047857" fontSize="12" fontWeight="bold" textAnchor="middle">
                Celebrating
              </text>
              <text x="150" y="75" fill="#047857" fontSize="12" fontWeight="bold" textAnchor="middle">
                Ayana
              </text>

              <text x="60" y="220" fill="#1e40af" fontSize="12" fontWeight="bold" textAnchor="middle">
                Ocean
              </text>
              <text x="60" y="235" fill="#1e40af" fontSize="12" fontWeight="bold" textAnchor="middle">
                Time
              </text>

              <text x="240" y="220" fill="#b45309" fontSize="12" fontWeight="bold" textAnchor="middle">
                Being a
              </text>
              <text x="240" y="235" fill="#b45309" fontSize="12" fontWeight="bold" textAnchor="middle">
                Good Friend
              </text>

              {/* Center star */}
              <text x="150" y="165" fontSize="40" textAnchor="middle">⭐</text>
              <text x="150" y="195" fill="#047857" fontSize="14" fontWeight="bold" textAnchor="middle">
                You're Here!
              </text>
            </svg>
          </div>

          <p className="text-center text-sm text-gray-700 leading-relaxed">
            By submitting your availability, you've positioned yourself at the intersection
            of <strong>ocean celebration</strong>, <strong>friendship</strong>, and
            <strong>honoring Dr. Johnson</strong>. This is the sweet spot.
          </p>

          <p className="text-center text-xs text-gray-500 mt-4 italic">
            "What can I do to help celebrate my friend? Get to the heart of your celebration Venn!"
            <br/>— Definitely something Ayana would say
          </p>
        </div>

        <div className="border-l-4 p-5 mb-8 rounded-r-lg" style={{ backgroundColor: '#F9F7F4', borderLeftColor: '#62B6CB' }}>
          <p className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: '#0A2E4D' }}>Your Expedition ID</p>
          {uniqueId && (
            <>
              <code className="text-sm font-mono bg-white px-3 py-2 inline-block border border-gray-300 rounded break-all">
                {typeof window !== 'undefined' && `${window.location.origin}/schedule?id=${uniqueId}`}
              </code>
              <p className="text-xs text-gray-600 mt-3 italic">
                Save this link to update your availability if needed
              </p>
            </>
          )}
        </div>

        <button
          onClick={() => window.location.href = '/'}
          className="px-8 py-3 text-white font-semibold uppercase tracking-wide transition-all rounded-full shadow-lg hover:shadow-xl text-sm"
          style={{ backgroundColor: '#0A2E4D' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1B4965'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0A2E4D'}
        >
          Complete
        </button>

        <div className="mt-8 text-sm text-gray-500 italic">
          <p>✨ Looking forward to the expedition</p>
        </div>

      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <svg className="animate-spin h-8 w-8 mx-auto mb-4" style={{ color: '#0A2E4D' }} viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-black font-semibold">Loading...</p>
          </div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
