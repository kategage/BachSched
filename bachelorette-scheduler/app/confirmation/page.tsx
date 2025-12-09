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
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-party-pink text-center">
          {/* Success Icon */}
          <div className="text-6xl mb-4">🎉</div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-party-purple mb-4">
            Thank You{participant?.name ? `, ${participant.name}` : ''}!
          </h1>

          <p className="text-gray-600 mb-6">
            Your availability has been saved successfully!
          </p>

          {/* Shareable Link */}
          <div className="bg-pink-50 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Your unique link to edit anytime:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-white border-2 border-party-pink rounded-lg text-sm text-gray-700"
              />
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-party-purple text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
              >
                {copied ? '✓' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              💡 <strong>Save this link!</strong> You can use it to update your
              availability anytime before the event.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <a
              href={`/schedule?id=${uniqueId}`}
              className="block w-full bg-gradient-to-r from-party-pink to-party-purple text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
            >
              Edit My Availability
            </a>

            <a
              href="/"
              className="block w-full bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
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
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
