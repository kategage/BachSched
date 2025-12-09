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
          <div className="text-6xl mb-4">🌴</div>
          <p className="text-tropical-navy font-semibold text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full animate-fade-in">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-tropical-turquoise/30 text-center">
          {/* Success Icon with tropical gradient background */}
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-tropical-turquoise to-tropical-aqua rounded-full flex items-center justify-center shadow-lg">
            <div className="text-5xl">🌊</div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-tropical-navy mb-3">
            Thank You{participant?.name ? `, ${participant.name}` : ''}!
          </h1>

          <p className="text-tropical-teal text-lg font-medium mb-8">
            Thanks for helping plan Ayana's special weekend! 🌴
          </p>

          {/* Shareable Link */}
          <div className="bg-gradient-to-br from-tropical-sky to-tropical-cream rounded-2xl p-5 mb-6 border-2 border-tropical-turquoise/30">
            <p className="text-sm font-semibold text-tropical-navy mb-3">
              ✨ Your unique link to edit anytime:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-4 py-3 bg-white border-2 border-tropical-turquoise/40 rounded-xl text-sm text-tropical-navy font-medium"
              />
              <button
                onClick={copyToClipboard}
                className="min-h-[44px] px-5 py-3 bg-tropical-turquoise text-white rounded-xl hover:bg-tropical-aqua transition-colors text-sm font-bold shadow-lg active:scale-95"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-tropical-orange/10 border-2 border-tropical-orange/40 rounded-2xl p-5 mb-8">
            <p className="text-sm text-tropical-navy font-medium">
              <span className="text-2xl mr-2">🍹</span>
              <strong>Save this link!</strong> You can update your availability anytime before Ayana's celebration.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <a
              href={`/schedule?id=${uniqueId}`}
              className="block w-full bg-gradient-to-r from-tropical-turquoise to-tropical-aqua text-white font-bold py-4 px-6 rounded-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
            >
              Edit My Availability 📅
            </a>

            <a
              href="/"
              className="block w-full bg-white border-2 border-tropical-turquoise/30 text-tropical-navy font-semibold py-4 px-6 rounded-xl hover:bg-tropical-sky/50 hover:border-tropical-turquoise transition-all"
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
            <div className="text-6xl mb-4">🌴</div>
            <p className="text-tropical-navy font-semibold text-lg">Loading...</p>
          </div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
