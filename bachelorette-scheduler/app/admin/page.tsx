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
    if (status === 'yes') return 'bg-green-500 text-white';
    if (status === 'no') return 'bg-red-500 text-white';
    if (status === 'maybe') return 'bg-yellow-400 text-gray-900';
    return 'bg-gray-300 text-gray-600';
  };

  const getStatusEmoji = (status?: 'yes' | 'no' | 'maybe') => {
    if (status === 'yes') return '✓';
    if (status === 'no') return '✗';
    if (status === 'maybe') return '?';
    return '—';
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-party-purple">
            <h1 className="text-3xl font-bold text-party-purple mb-6 text-center">
              🔒 Admin Dashboard
            </h1>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-party-purple rounded-lg focus:outline-none focus:ring-2 focus:ring-party-pink text-gray-900"
                  placeholder="Enter admin password"
                />
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-party-purple to-party-pink text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
              >
                Login
              </button>
            </form>

            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-sm text-party-purple hover:text-party-pink transition-colors"
              >
                ← Back to Home
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
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-4 border-party-purple">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-party-purple mb-2">
                📊 Admin Dashboard
              </h1>
              <p className="text-gray-600">
                {participants.length} participants • March 6-22, 2025
              </p>
            </div>
            <button
              onClick={() => {
                setAuthenticated(false);
                setPassword('');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Loading data...</p>
          </div>
        ) : (
          <>
            {/* Best Periods Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-party-gold">
              <h2 className="text-2xl font-bold text-party-purple mb-4">
                ⭐ Top 5 Best 4-Day Periods
              </h2>
              <div className="space-y-3">
                {bestPeriods.map((period, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      index === 0
                        ? 'bg-yellow-50 border-party-gold'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="font-bold text-lg text-party-purple">
                        {index === 0 && '🏆 '}
                        {formatDisplayDate(period.startDate)} -{' '}
                        {formatDisplayDate(period.endDate)}
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span className="text-green-600 font-medium">
                          ✓ {period.yesCount} Yes
                        </span>
                        <span className="text-yellow-600 font-medium">
                          ? {period.maybeCount} Maybe
                        </span>
                        <span className="text-red-600 font-medium">
                          ✗ {period.noCount} No
                        </span>
                        <span className="text-gray-600 font-bold">
                          Score: {period.score.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability Grid */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-party-pink overflow-x-auto">
              <h2 className="text-2xl font-bold text-party-purple mb-4">
                📅 Full Availability Grid
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="sticky left-0 bg-white border-2 border-gray-300 px-4 py-3 text-left font-bold text-party-purple z-10">
                        Participant
                      </th>
                      {dates.map((date) => (
                        <th
                          key={getDateKey(date)}
                          className="border-2 border-gray-300 px-2 py-3 text-center text-sm min-w-[80px]"
                        >
                          <div className="font-bold text-party-purple">
                            {date.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                          <div className="text-xs text-gray-600">
                            {date.toLocaleDateString('en-US', {
                              weekday: 'short',
                            })}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((participant) => (
                      <tr key={participant.id}>
                        <td className="sticky left-0 bg-white border-2 border-gray-300 px-4 py-3 font-medium z-10">
                          {participant.name}
                        </td>
                        {dates.map((date) => {
                          const dateKey = getDateKey(date);
                          const status = participant.availability[dateKey];
                          return (
                            <td
                              key={dateKey}
                              className={`border-2 border-gray-300 px-2 py-3 text-center font-bold ${getStatusColor(
                                status
                              )}`}
                            >
                              {getStatusEmoji(status)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Yes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                  <span>Maybe</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>No</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <span>No Response</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
