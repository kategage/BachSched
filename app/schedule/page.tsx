'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase, type Participant, type Availability } from '@/lib/supabase';
import CalendarGrid from '@/components/CalendarGrid';
import CrewDashboard from '@/components/CrewDashboard';
import TideKey from '@/components/TideKey';
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
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Page header - left aligned */}
        <div className="mb-6">
          <h1 className="text-3xl font-serif font-bold mb-2" style={{ color: '#0A2E4D' }}>
            Expedition Availability Assessment
          </h1>
          <p className="text-sm text-gray-600">
            Expedition Portal • Crew Availability Assessment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-2">
            {/* Crew Dashboard */}
            <CrewDashboard
              crewMemberName={participant.name}
              datesAssessed={completedDates}
              totalDates={totalDates}
            />

            {/* Availability Grid */}
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <CalendarGrid
                  availability={availability}
                  onStatusChange={handleStatusChange}
                />
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-600 text-red-700 px-5 py-4 mb-6 rounded-xl">
                  {error}
                </div>
              )}

              {/* Submit button */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-center">
                <button
                  type="submit"
                  disabled={saving || completedDates !== totalDates}
                  className="w-full max-w-md h-14 text-base font-semibold tracking-wide uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-md hover:shadow-lg"
                  style={{
                    backgroundColor: completedDates === totalDates ? '#0A2E4D' : '#D1D5DB',
                    color: completedDates === totalDates ? '#FFFFFF' : '#6B7280'
                  }}
                  onMouseEnter={(e) => {
                    if (completedDates === totalDates && !saving) {
                      e.currentTarget.style.backgroundColor = '#1B4965';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (completedDates === totalDates && !saving) {
                      e.currentTarget.style.backgroundColor = '#0A2E4D';
                    }
                  }}
                >
                  {saving ? 'Submitting Assessment...' : 'Submit Expedition Application →'}
                </button>
                {completedDates !== totalDates && (
                  <p className="text-xs text-gray-600 mt-3">
                    Please assess all {totalDates - completedDates} remaining dates to continue
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <TideKey />

              {/* Additional info card */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#0A2E4D' }}>
                  About This Assessment
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">
                  We're glad you're considering joining the crew. We'll use this information to inform our final dates.
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Tide times are based on NOAA predictions for Port Maria, Jamaica.
                  Use the filters to view specific availability categories.
                </p>
              </div>
            </div>
          </div>
        </div>
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
