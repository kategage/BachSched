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
          <svg className="animate-spin h-8 w-8 mx-auto mb-4" style={{ color: '#14B8A6' }} viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-white font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="portal-card animate-fade-in text-center">
        {/* Big sparkles emoji */}
        <div className="text-6xl mb-4">✨🎉✨</div>

        {/* Success heading */}
        <h1 className="font-display font-bold text-4xl mb-4" style={{ color: '#10B981' }}>
          Success!
        </h1>

        {/* Thank you message */}
        <p className="text-gray-700 text-lg font-semibold mb-2">
          Thanks for responding{participant?.name ? `, ${participant.name}` : ''}! 🌺
        </p>

        <p className="text-gray-600 text-base mb-8">
          Your availability has been saved for Ayana's beach bachelorette.
        </p>

        {/* Divider */}
        <div className="my-8 border-t border-gray-200"></div>

        {/* Share link section */}
        {uniqueId && (
          <div className="mb-8">
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
              Your Personal Link
            </p>
            <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
              <p className="text-xs font-mono text-gray-700 break-all">
                {typeof window !== 'undefined' && `${window.location.origin}/schedule?id=${uniqueId}`}
              </p>
            </div>
            <p className="text-xs text-gray-500">
              Save this link to update your availability anytime
            </p>
          </div>
        )}

        {/* Done button */}
        <a
          href="/"
          className="inline-block px-8 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-all text-sm"
          style={{ backgroundColor: '#14B8A6' }}
        >
          Done
        </a>

        {/* Big tropical emojis at bottom */}
        <div className="text-5xl mt-8">🌴🏖️🌊</div>
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
            <svg className="animate-spin h-8 w-8 mx-auto mb-4" style={{ color: '#14B8A6' }} viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-white font-semibold">Loading...</p>
          </div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
