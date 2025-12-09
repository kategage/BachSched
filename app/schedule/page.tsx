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

    // Validate that all dates have been answered
    const dates = getAllDates();
    const allDatesAnswered = dates.every((date) => {
      const dateKey = getDateKey(date);
      return availability[dateKey] !== undefined;
    });

    if (!allDatesAnswered) {
      setError('Please select an option (Yes/Maybe/No) for all 17 dates before submitting.');
      return;
    }

    setSaving(true);
    setError('');

    try {
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
          <svg className="animate-spin h-8 w-8 mx-auto mb-4" style={{ color: '#14B8A6' }} viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-white font-semibold">Loading your calendar...</p>
        </div>
      </div>
    );
  }

  if (!participant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white font-semibold">Participant not found</p>
        </div>
      </div>
    );
  }

  const completedDates = Object.keys(availability).length;
  const totalDates = getAllDates().length;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="portal-card animate-fade-in" style={{ maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-7xl mb-3 animate-pulse">✨🌺✨</div>
          <h1 className="font-display font-bold text-4xl mb-3 bg-gradient-to-r from-teal-600 via-cyan-500 to-orange-500 bg-clip-text text-transparent">
            Hi {participant.name}!
          </h1>
          <p className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            When can you make it? 🏖️
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Select your availability for each day below
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <span>{completedDates} of {totalDates} days selected</span>
            <span>{Math.round((completedDates / totalDates) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${(completedDates / totalDates) * 100}%`,
                backgroundColor: '#10B981'
              }}
            />
          </div>
        </div>

        {/* Scrollable Calendar */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
          <div className="pr-2" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
            <CalendarGrid
              availability={availability}
              onStatusChange={handleStatusChange}
            />
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving || completedDates === 0}
              className="w-full h-14 text-white font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              style={{
                backgroundColor: '#FB923C',
                minHeight: '56px'
              }}
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
                'Submit My Availability 🏖️'
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
            <svg className="animate-spin h-8 w-8 mx-auto mb-4" style={{ color: '#14B8A6' }} viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-white font-semibold">Loading...</p>
          </div>
        </div>
      }
    >
      <ScheduleContent />
    </Suspense>
  );
}
