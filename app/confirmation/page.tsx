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
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white p-12 max-w-2xl w-full border-t-8 text-center rounded-lg shadow-2xl" style={{ borderTopColor: '#B7E3E0' }}>

        <div className="text-7xl mb-6">✓</div>

        <h1 className="font-serif text-4xl mb-4" style={{ color: '#05324F' }}>
          Expedition Application Submitted
        </h1>

        <p className="text-xl text-gray-700 mb-8">
          Thank you, <span className="font-semibold">{participant?.name}</span>. Your availability
          assessment has been recorded for Dr. Johnson's coastal celebration expedition.
        </p>

        <div className="border-l-4 p-6 mb-10 rounded-r-lg" style={{ backgroundColor: '#F3E9D2', borderLeftColor: '#05324F' }}>
          <p className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: '#05324F' }}>Your Expedition ID</p>
          {uniqueId && (
            <>
              <code className="text-base font-mono bg-white px-4 py-3 inline-block border border-gray-300 rounded">
                {typeof window !== 'undefined' && `${window.location.origin}/schedule?id=${uniqueId}`}
              </code>
              <p className="text-sm text-gray-600 mt-4 italic">
                Save this link to update your availability if needed
              </p>
            </>
          )}
        </div>

        <button
          onClick={() => window.location.href = '/'}
          className="px-10 py-4 text-white font-semibold uppercase tracking-wide transition-all rounded-md shadow-lg hover:shadow-xl"
          style={{ backgroundColor: '#05324F' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#03243A'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#05324F'}
        >
          Complete
        </button>

        <div className="mt-10 text-sm text-gray-500 italic">
          <p>🌊 Looking forward to the expedition</p>
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
