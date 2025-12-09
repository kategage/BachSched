'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase, type Participant } from '@/lib/supabase';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const uniqueId = searchParams.get('id');

  const [participant, setParticipant] = useState<Participant | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/schedule?id=${uniqueId}`
      : '';

  useEffect(() => {
    if (!uniqueId) return;

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <svg className="animate-spin h-8 w-8 text-primary mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="bg-white rounded-xl p-8 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 mx-auto mb-6 bg-success/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-3">
            Thank You{participant?.name ? `, ${participant.name}` : ''}!
          </h1>

          <p className="text-gray-600 text-lg mb-8">
            Your availability has been saved for Ayana's celebration
          </p>

          {/* Shareable Link */}
          <div className="bg-gray-50 rounded-lg p-5 mb-6">
            <p className="text-sm font-semibold text-gray-900 mb-3">
              Your unique link to edit anytime:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 font-mono"
              />
              <button
                onClick={copyToClipboard}
                className="min-h-[44px] px-5 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-700">
              <strong>Save this link!</strong> You can update your availability anytime before the celebration.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <a
              href={`/schedule?id=${uniqueId}`}
              className="block w-full bg-primary text-white font-semibold py-4 px-6 rounded-lg hover:bg-primary/90 transition-all shadow-sm"
            >
              Edit My Availability
            </a>

            <a
              href="/"
              className="block w-full bg-white border border-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-lg hover:bg-gray-50 transition-all"
            >
              Back to Home
            </a>
          </div>
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
            <svg className="animate-spin h-8 w-8 text-primary mx-auto mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
