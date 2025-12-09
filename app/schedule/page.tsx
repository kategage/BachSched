'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase, type Participant, type Availability } from '@/lib/supabase';
import CalendarGrid from '@/components/CalendarGrid';
import { getAllDates, getDateKey } from '@/lib/dates';

function ScheduleContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const uniqueId = searchParams.get('id');

  const [participant, setParticipant] = useState<Participant | null>(null);
  const [availability, setAvailability] = useState<
    Record<string, 'yes' | 'no' | 'maybe'>
  >({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!uniqueId) {
      router.push('/');
      return;
    }

    loadParticipantData();
  }, [uniqueId]);

  const loadParticipantData = async () => {
    try {
      // Load participant
      const { data: participantData, error: participantError } = await supabase
        .from('participants')
        .select('*')
        .eq('unique_id', uniqueId)
        .single();

      if (participantError) throw participantError;

      setParticipant(participantData);

      // Load existing availability
      const { data: availabilityData, error: availabilityError } =
        await supabase
          .from('availability')
          .select('*')
          .eq('participant_id', participantData.id);

      if (availabilityError && availabilityError.code !== 'PGRST116') {
        throw availabilityError;
      }

      // Convert to map
      const availabilityMap: Record<string, 'yes' | 'no' | 'maybe'> = {};
      if (availabilityData) {
        availabilityData.forEach((item: Availability) => {
          availabilityMap[item.date] = item.status;
        });
      }

      setAvailability(availabilityMap);
      setLoading(false);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load your data. Please try again.');
      setLoading(false);
    }
  };

  const handleStatusChange = (date: string, status: 'yes' | 'no' | 'maybe') => {
    setAvailability((prev) => ({
      ...prev,
      [date]: status,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!participant) return;

    setSaving(true);
    setError('');

    try {
      const dates = getAllDates();

      // Delete existing availability
      await supabase
        .from('availability')
        .delete()
        .eq('participant_id', participant.id);

      // Insert new availability
      const availabilityRecords = dates
        .map((date) => {
          const dateKey = getDateKey(date);
          const status = availability[dateKey];

          if (!status) return null;

          return {
            participant_id: participant.id,
            date: dateKey,
            status,
          };
        })
        .filter(Boolean);

      if (availabilityRecords.length > 0) {
        const { error: insertError } = await supabase
          .from('availability')
          .insert(availabilityRecords);

        if (insertError) throw insertError;
      }

      // Update participant last_updated
      await supabase
        .from('participants')
        .update({ last_updated: new Date().toISOString() })
        .eq('id', participant.id);

      // Redirect to confirmation page
      router.push(`/confirmation?id=${uniqueId}`);
    } catch (err) {
      console.error('Error saving availability:', err);
      setError('Failed to save your availability. Please try again.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="text-6xl mb-4">🌴</div>
          <p className="text-tropical-navy font-semibold text-lg">Loading your calendar...</p>
        </div>
      </div>
    );
  }

  if (!participant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌊</div>
          <p className="text-tropical-navy font-semibold">Participant not found</p>
        </div>
      </div>
    );
  }

  const completedDates = Object.keys(availability).length;
  const totalDates = getAllDates().length;
  const progress = Math.round((completedDates / totalDates) * 100);

  return (
    <div className="min-h-screen p-4 py-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        {/* Tropical Header */}
        <div className="bg-gradient-to-r from-tropical-turquoise to-tropical-aqua rounded-3xl shadow-2xl p-6 mb-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🌺</span>
            <h1 className="text-3xl md:text-4xl font-bold">
              Hi {participant.name}!
            </h1>
          </div>
          <p className="text-white/90 text-lg font-medium mb-4">
            Select your availability for Ayana's beach bachelorette
          </p>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <p className="text-white font-semibold mb-1">
              📅 March 6-22, 2025
            </p>
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-sm text-white/90 mb-2">
                <span className="font-medium">Progress</span>
                <span className="font-bold">
                  {completedDates}/{totalDates} days
                </span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-3">
                <div
                  className="bg-white h-3 rounded-full transition-all shadow-lg"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <form onSubmit={handleSubmit}>
          <CalendarGrid
            availability={availability}
            onStatusChange={handleStatusChange}
          />

          {error && (
            <div className="mt-6 bg-tropical-coral/10 border-2 border-tropical-coral text-tropical-coral px-5 py-4 rounded-2xl font-medium">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6 sticky bottom-4">
            <button
              type="submit"
              disabled={saving || completedDates === 0}
              className="w-full bg-gradient-to-r from-tropical-turquoise to-tropical-aqua text-white font-bold py-5 px-6 rounded-2xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg shadow-xl"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save My Availability 🌊'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SchedulePage() {
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
      <ScheduleContent />
    </Suspense>
  );
}
