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
    if (status === 'yes') return 'bg-tropical-turquoise text-white';
    if (status === 'no') return 'bg-tropical-coral text-white';
    if (status === 'maybe') return 'bg-tropical-orange text-white';
    return 'bg-gray-300 text-gray-700';
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
        <div className="max-w-md w-full animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-tropical-turquoise/30">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🔒</div>
              <h1 className="text-3xl font-bold text-tropical-navy mb-2">
                Admin Dashboard
              </h1>
              <p className="text-tropical-teal font-medium">
                Ayana's Bachelorette - Availability Overview
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-tropical-navy mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-tropical-turquoise/40 rounded-xl focus:outline-none focus:ring-4 focus:ring-tropical-turquoise/30 focus:border-tropical-turquoise text-tropical-navy font-medium transition-all"
                  placeholder="Enter admin password"
                />
              </div>

              {error && (
                <div className="bg-tropical-coral/10 border-2 border-tropical-coral text-tropical-coral px-5 py-4 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-tropical-turquoise to-tropical-aqua text-white font-bold py-4 px-6 rounded-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
              >
                Login 🌴
              </button>
            </form>

            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-sm text-tropical-teal hover:text-tropical-turquoise transition-colors font-medium"
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
    <div className="min-h-screen p-4 py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Tropical Header */}
        <div className="bg-gradient-to-r from-tropical-turquoise to-tropical-aqua rounded-3xl shadow-2xl p-6 mb-6 text-white">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🌴</span>
                <h1 className="text-3xl md:text-4xl font-bold">
                  Ayana's Bachelorette
                </h1>
              </div>
              <p className="text-white/90 font-medium ml-14">
                {participants.length} participants • March 6-22, 2025
              </p>
            </div>
            <button
              onClick={() => {
                setAuthenticated(false);
                setPassword('');
              }}
              className="px-5 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all font-semibold border border-white/30"
            >
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌊</div>
            <p className="text-tropical-navy font-semibold text-lg">Loading data...</p>
          </div>
        ) : (
          <>
            {/* Best Periods Section */}
            <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 border-2 border-tropical-sand">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-3xl">🏆</span>
                <h2 className="text-2xl font-bold text-tropical-navy">
                  Top 5 Best 4-Day Periods
                </h2>
              </div>
              <div className="space-y-3">
                {bestPeriods.map((period, index) => (
                  <div
                    key={index}
                    className={`p-5 rounded-2xl border-2 transition-all ${
                      index === 0
                        ? 'bg-gradient-to-br from-tropical-sand to-tropical-cream border-tropical-sand shadow-lg'
                        : 'bg-tropical-sky/30 border-tropical-turquoise/20 hover:border-tropical-turquoise/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="font-bold text-lg text-tropical-navy">
                        {index === 0 && '⭐ '}
                        {formatDisplayDate(period.startDate)} -{' '}
                        {formatDisplayDate(period.endDate)}
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm font-semibold">
                        <span className="px-3 py-1 bg-tropical-turquoise/10 text-tropical-turquoise rounded-lg">
                          ✓ {period.yesCount} Yes
                        </span>
                        <span className="px-3 py-1 bg-tropical-orange/10 text-tropical-orange rounded-lg">
                          ? {period.maybeCount} Maybe
                        </span>
                        <span className="px-3 py-1 bg-tropical-coral/10 text-tropical-coral rounded-lg">
                          ✗ {period.noCount} No
                        </span>
                        <span className="px-3 py-1 bg-tropical-navy/10 text-tropical-navy rounded-lg">
                          Score: {period.score.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability Grid */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-tropical-turquoise/20 overflow-x-auto">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-3xl">📅</span>
                <h2 className="text-2xl font-bold text-tropical-navy">
                  Full Availability Grid
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="sticky left-0 bg-white border-2 border-tropical-turquoise/30 px-4 py-3 text-left font-bold text-tropical-navy z-10">
                        Participant
                      </th>
                      {dates.map((date) => (
                        <th
                          key={getDateKey(date)}
                          className="border-2 border-tropical-turquoise/30 px-2 py-3 text-center text-sm min-w-[80px] bg-tropical-sky/30"
                        >
                          <div className="font-bold text-tropical-navy">
                            {date.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                          <div className="text-xs text-tropical-teal">
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
                      <tr key={participant.id} className="hover:bg-tropical-sky/20 transition-colors">
                        <td className="sticky left-0 bg-white border-2 border-tropical-turquoise/30 px-4 py-3 font-semibold text-tropical-navy z-10">
                          {participant.name}
                        </td>
                        {dates.map((date) => {
                          const dateKey = getDateKey(date);
                          const status = participant.availability[dateKey];
                          return (
                            <td
                              key={dateKey}
                              className={`border-2 border-tropical-turquoise/30 px-2 py-3 text-center font-bold ${getStatusColor(
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

              <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-tropical-turquoise rounded-lg shadow-sm"></div>
                  <span className="text-tropical-navy">Yes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-tropical-orange rounded-lg shadow-sm"></div>
                  <span className="text-tropical-navy">Maybe</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-tropical-coral rounded-lg shadow-sm"></div>
                  <span className="text-tropical-navy">No</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-300 rounded-lg shadow-sm"></div>
                  <span className="text-tropical-navy">No Response</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
