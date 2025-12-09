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
          <svg className="animate-spin h-8 w-8 mx-auto mb-4" style={{ color: '#0A2E4D' }} viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-black font-semibold">Loading your assessment...</p>
        </div>
      </div>
    );
  }

  if (!participant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-black font-semibold">Participant not found</p>
        </div>
      </div>
    );
  }

  const completedDates = Object.keys(availability).length;
  const totalDates = getAllDates().length;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-white border-t-8 p-8 mb-8 text-center" style={{ borderTopColor: '#0A2E4D' }}>
          <h1 className="font-serif text-3xl mb-2" style={{ color: '#0A2E4D' }}>
            Expedition Availability Assessment
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            Welcome, <span className="font-semibold">{participant.name}</span>
          </p>
          <p className="text-gray-600">
            Mark your availability for each field study date using the tide chart below.
            Select your tide level: High Tide (Available), Mid Tide (Possible), or Low Tide (Unavailable).
          </p>
        </div>

        {/* Progress indicator */}
        <div className="bg-white p-6 mb-6 border-l-4" style={{ borderLeftColor: '#F9D949' }}>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">
              <span className="text-3xl font-bold" style={{ color: '#0A2E4D' }}>{completedDates}</span> of {totalDates} dates assessed
            </span>
            <span className="text-gray-500">{Math.round((completedDates/totalDates)*100)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 h-2 mt-3">
            <div
              className="h-2 transition-all duration-300"
              style={{
                width: `${(completedDates/totalDates)*100}%`,
                backgroundColor: '#F9D949'
              }}
            ></div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white p-6 mb-6 flex justify-around text-center">
          <div>
            <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center text-white text-2xl" style={{ backgroundColor: '#0A2E4D' }}>🌊</div>
            <p className="font-semibold" style={{ color: '#0A2E4D' }}>High Tide</p>
            <p className="text-sm text-gray-600">Available</p>
          </div>
          <div>
            <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: '#F9D949' }}>〰️</div>
            <p className="font-semibold text-gray-700">Mid Tide</p>
            <p className="text-sm text-gray-600">Possible</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-gray-300 mx-auto mb-2 rounded-full flex items-center justify-center text-2xl">○</div>
            <p className="font-semibold text-gray-500">Low Tide</p>
            <p className="text-sm text-gray-600">Unavailable</p>
          </div>
        </div>

        {/* Tide chart grid */}
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <CalendarGrid
              availability={availability}
              onStatusChange={handleStatusChange}
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-600 text-red-700 px-4 py-3 mb-6">
              {error}
            </div>
          )}

          {/* Submit button */}
          <div className="bg-white p-8 text-center">
            <button
              type="submit"
              disabled={saving || completedDates !== totalDates}
              className="w-full max-w-md h-16 text-lg font-semibold tracking-wide uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: completedDates === totalDates ? '#0A2E4D' : '#D1D5DB',
                color: completedDates === totalDates ? '#FFFFFF' : '#6B7280'
              }}
              onMouseEnter={(e) => {
                if (completedDates === totalDates && !saving) {
                  e.currentTarget.style.backgroundColor = '#000000';
                }
              }}
              onMouseLeave={(e) => {
                if (completedDates === totalDates && !saving) {
                  e.currentTarget.style.backgroundColor = '#0A2E4D';
                }
              }}
            >
              {saving ? 'Submitting...' : 'Submit Expedition Application →'}
            </button>
            {completedDates !== totalDates && (
              <p className="text-sm text-gray-500 mt-3">
                Please assess all {totalDates - completedDates} remaining dates to continue
              </p>
            )}
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
            <svg className="animate-spin h-8 w-8 mx-auto mb-4" style={{ color: '#0A2E4D' }} viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-black font-semibold">Loading...</p>
          </div>
        </div>
      }
    >
      <ScheduleContent />
    </Suspense>
  );
}
