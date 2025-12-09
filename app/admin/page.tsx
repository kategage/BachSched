'use client';

import { useState, useEffect } from 'react';
import { supabase, type Participant, type Availability } from '@/lib/supabase';
import { getAllDates, formatDisplayDate, getDateKey } from '@/lib/dates';

interface ParticipantWithAvailability extends Participant {
  availability: Record<string, 'yes' | 'no' | 'maybe'>;
}

interface BestPeriod {
  startDate: Date;
  endDate: Date;
  yesCount: number;
  maybeCount: number;
  noCount: number;
  score: number;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [participants, setParticipants] = useState<
    ParticipantWithAvailability[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin';

    if (password === adminPassword) {
      setAuthenticated(true);
      setError('');
      loadAdminData();
    } else {
      setError('Incorrect password');
    }
  };

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Load all participants
      const { data: participantsData, error: participantsError } =
        await supabase
          .from('participants')
          .select('*')
          .order('name');

      if (participantsError) throw participantsError;

      // Load all availability
      const { data: availabilityData, error: availabilityError } =
        await supabase.from('availability').select('*');

      if (availabilityError) throw availabilityError;

      // Combine data
      const participantsWithAvailability: ParticipantWithAvailability[] =
        participantsData.map((participant) => {
          const availability: Record<string, 'yes' | 'no' | 'maybe'> = {};

          availabilityData
            .filter(
              (a: Availability) => a.participant_id === participant.id
            )
            .forEach((a: Availability) => {
              availability[a.date] = a.status;
            });

          return {
            ...participant,
            availability,
          };
        });

      setParticipants(participantsWithAvailability);
      setLoading(false);
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError('Failed to load data');
      setLoading(false);
    }
  };

  const getStatusColor = (status?: 'yes' | 'no' | 'maybe') => {
    if (status === 'yes') return 'bg-[#0A2E4D]';
    if (status === 'no') return 'bg-gray-300';
    if (status === 'maybe') return 'bg-[#F9D949]';
    return 'bg-white border border-gray-300';
  };

  const getStatusEmoji = (status?: 'yes' | 'no' | 'maybe') => {
    if (status === 'yes') return '🌊';
    if (status === 'maybe') return '〰️';
    return '';
  };

  const calculateBestPeriods = (): BestPeriod[] => {
    const dates = getAllDates();
    const periods: BestPeriod[] = [];

    // Calculate 4-day periods
    for (let i = 0; i <= dates.length - 4; i++) {
      const periodDates = dates.slice(i, i + 4);
      let yesCount = 0;
      let maybeCount = 0;
      let noCount = 0;

      periodDates.forEach((date) => {
        const dateKey = getDateKey(date);
        participants.forEach((participant) => {
          const status = participant.availability[dateKey];
          if (status === 'yes') yesCount++;
          else if (status === 'maybe') maybeCount++;
          else if (status === 'no') noCount++;
        });
      });

      // Score: prioritize yes, then maybe, then penalize no
      const score = yesCount * 3 + maybeCount * 1 - noCount * 0.5;

      periods.push({
        startDate: periodDates[0],
        endDate: periodDates[3],
        yesCount,
        maybeCount,
        noCount,
        score,
      });
    }

    return periods.sort((a, b) => b.score - a.score).slice(0, 5);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full animate-fade-in">
          <div className="bg-white shadow-lg p-8 border-t-8" style={{ borderTopColor: '#0A2E4D' }}>
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">🔒</div>
              <h1 className="font-serif text-3xl mb-2" style={{ color: '#0A2E4D' }}>
                Expedition Control
              </h1>
              <p className="text-gray-600">
                Dr. Ayana Elizabeth Johnson • Roster Management
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold tracking-wide mb-3"
                  style={{ color: '#0A2E4D' }}
                >
                  ADMIN PASSWORD
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none transition-all"
                  style={{
                    borderColor: password ? '#0A2E4D' : '#D1D5DB'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#0A2E4D'}
                  onBlur={(e) => e.target.style.borderColor = password ? '#0A2E4D' : '#D1D5DB'}
                  placeholder="Enter password"
                />
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-600 text-red-700 px-4 py-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full h-14 text-white font-semibold tracking-wide transition-all uppercase"
                style={{ backgroundColor: '#0A2E4D' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1B4965'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0A2E4D'}
              >
                Access Dashboard →
              </button>
            </form>

            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to Application
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const dates = getAllDates();
  const bestPeriods = calculateBestPeriods();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">

        <div className="bg-white border-t-8 p-8 mb-8" style={{ borderTopColor: '#0A2E4D' }}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="font-serif text-3xl mb-2" style={{ color: '#0A2E4D' }}>
                Expedition Roster Management
              </h1>
              <p className="text-gray-600">
                Dr. Ayana Elizabeth Johnson • Beach Celebration Expedition
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {participants.length} crew members • March 6-22, 2028
              </p>
            </div>
            <button
              onClick={() => {
                setAuthenticated(false);
                setPassword('');
              }}
              className="px-6 py-3 font-semibold uppercase tracking-wide transition-all"
              style={{
                backgroundColor: '#0A2E4D',
                color: '#FFFFFF'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1B4965'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0A2E4D'}
            >
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <svg className="animate-spin h-12 w-12 mx-auto mb-4" style={{ color: '#0A2E4D' }} viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-black font-semibold text-lg">Loading expedition data...</p>
          </div>
        ) : (
          <>
            {/* Best Periods Section */}
            <div className="bg-white p-8 mt-6 border-l-4 mb-6" style={{ borderLeftColor: '#F9D949' }}>
              <h2 className="font-serif text-2xl mb-4" style={{ color: '#0A2E4D' }}>
                Optimal 4-Day Field Study Windows
              </h2>
              <div className="space-y-3">
                {bestPeriods.map((period, index) => (
                  <div
                    key={index}
                    className="p-4 border-2 transition-all"
                    style={{
                      borderColor: index === 0 ? '#0A2E4D' : '#E5E7EB',
                      backgroundColor: index === 0 ? '#F9F7F4' : '#FFFFFF'
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="font-bold text-lg text-gray-900">
                        {index + 1}. {formatDisplayDate(period.startDate)} – {formatDisplayDate(period.endDate)}
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm font-semibold">
                        <span className="px-3 py-1" style={{ backgroundColor: 'rgba(10, 46, 77, 0.1)', color: '#0A2E4D' }}>
                          🌊 {period.yesCount} Available
                        </span>
                        <span className="px-3 py-1" style={{ backgroundColor: 'rgba(249, 217, 73, 0.2)', color: '#92400E' }}>
                          〰️ {period.maybeCount} Possible
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600">
                          ○ {period.noCount} Unavailable
                        </span>
                        <span className="px-3 py-1 bg-gray-200 text-gray-900">
                          Score: {period.score.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability Grid */}
            <div className="bg-white p-6 overflow-x-auto">
              <h2 className="font-serif text-2xl mb-4" style={{ color: '#0A2E4D' }}>
                Crew Availability Matrix
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2" style={{ borderColor: '#0A2E4D' }}>
                      <th className="text-left p-3 font-semibold">Member Name</th>
                      {dates.map((date) => (
                        <th key={getDateKey(date)} className="p-2 text-xs text-center min-w-[50px]">
                          <div className="font-semibold text-gray-900">
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div className="text-xs text-gray-500">
                            {date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((participant) => (
                      <tr key={participant.id} className="border-b border-gray-200">
                        <td className="p-3 font-medium">{participant.name}</td>
                        {dates.map((date) => {
                          const dateKey = getDateKey(date);
                          const status = participant.availability[dateKey];
                          return (
                            <td key={dateKey} className="p-2 text-center">
                              <div
                                className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${getStatusColor(status)}`}
                              >
                                <span className="text-sm">{getStatusEmoji(status)}</span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0A2E4D' }}>
                    <span className="text-white text-xs">🌊</span>
                  </div>
                  <span className="text-gray-900">High Tide (Available)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F9D949' }}>
                    <span className="text-xs">〰️</span>
                  </div>
                  <span className="text-gray-900">Mid Tide (Possible)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-xs">○</span>
                  </div>
                  <span className="text-gray-900">Low Tide (Unavailable)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-300"></div>
                  <span className="text-gray-900">No Assessment</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
