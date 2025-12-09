'use client';

import { oracabessaTidesMarch2026, type TideDay } from '@/lib/tides-oracabessa-march-2026';

interface DateCardProps {
  date: Date;
  dateKey: string;
  dayOfWeek: string;
  monthDay: string;
  fieldDayNumber: number;
  selectedChoice?: 'yes' | 'no' | 'maybe';
  onStatusChange: (status: 'yes' | 'no' | 'maybe') => void;
}

/**
 * DateCard - Modern tide chart card with visual 3-button grid
 * Structure:
 * - Header with date info and assessment badge
 * - Predicted tide information (scientific data)
 * - 3-column grid of large interactive tide buttons
 */
export default function DateCard({
  dateKey,
  dayOfWeek,
  monthDay,
  fieldDayNumber,
  selectedChoice,
  onStatusChange,
}: DateCardProps) {
  // Find tide data for this date
  const tideData = oracabessaTidesMarch2026.find((day: TideDay) => day.date === dateKey);

  // Format tide events to 12-hour time
  const formatTime = (time24: string): string => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">

      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#0A2E4D' }}>
                {fieldDayNumber}
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: '#0A2E4D' }}>
                  {dayOfWeek}
                </h3>
                <p className="text-sm text-gray-600">{monthDay} • Field Day {fieldDayNumber}</p>
              </div>
            </div>
          </div>
          <div>
            {selectedChoice ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold" style={{ backgroundColor: '#F9D949' }}>
                <span>✓</span> Assessed
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-500 px-4 py-2 rounded-full text-sm font-semibold">
                Not assessed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Predicted Tides Section */}
      {tideData && (
        <div className="px-6 pt-4 pb-2 bg-slate-50 border-b border-gray-100">
          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">
            Predicted Tides • Oracabessa, Jamaica
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-semibold text-slate-700">High: </span>
              <span className="text-slate-600">
                {tideData.high.map((t, i) => (
                  <span key={i}>
                    {formatTime(t.time)} ({t.heightFt} ft)
                    {i < tideData.high.length - 1 && ', '}
                  </span>
                ))}
                {tideData.high.length === 0 && '—'}
              </span>
            </div>
            <div>
              <span className="font-semibold text-slate-700">Low: </span>
              <span className="text-slate-600">
                {tideData.low.map((t, i) => (
                  <span key={i}>
                    {formatTime(t.time)} ({t.heightFt} ft)
                    {i < tideData.low.length - 1 && ', '}
                  </span>
                ))}
                {tideData.low.length === 0 && '—'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tide Chart Visualization - 3-button grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* HIGH TIDE BUTTON */}
          <button
            type="button"
            onClick={() => onStatusChange('yes')}
            className={`group relative rounded-xl p-6 transition-all duration-200 ${
              selectedChoice === 'yes'
                ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-lg scale-105 ring-4 ring-yellow-400'
                : 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:border-blue-400 hover:scale-102'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🌊</div>
              <div className={`font-bold text-lg mb-1 ${selectedChoice === 'yes' ? 'text-white' : ''}`} style={selectedChoice === 'yes' ? {} : { color: '#0A2E4D' }}>
                High Tide
              </div>
              <div className={`text-sm ${selectedChoice === 'yes' ? 'text-blue-200' : 'text-gray-600'}`}>
                Fully on deck
              </div>
              {selectedChoice === 'yes' && (
                <div className="mt-3 font-bold" style={{ color: '#F9D949' }}>✓ Available</div>
              )}
            </div>
          </button>

          {/* MID TIDE BUTTON */}
          <button
            type="button"
            onClick={() => onStatusChange('maybe')}
            className={`group relative rounded-xl p-6 transition-all duration-200 ${
              selectedChoice === 'maybe'
                ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-900 shadow-lg scale-105 ring-4 ring-blue-900'
                : 'bg-gradient-to-br from-yellow-50 to-yellow-100 text-gray-800 border-2 border-yellow-200 hover:border-yellow-400 hover:scale-102'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">〰️</div>
              <div className="font-bold text-lg mb-1">
                Mid Tide
              </div>
              <div className={`text-sm ${selectedChoice === 'maybe' ? 'text-gray-800' : 'text-gray-600'}`}>
                Possibly afloat
              </div>
              {selectedChoice === 'maybe' && (
                <div className="mt-3 text-gray-900 font-bold">✓ Maybe</div>
              )}
            </div>
          </button>

          {/* LOW TIDE BUTTON */}
          <button
            type="button"
            onClick={() => onStatusChange('no')}
            className={`group relative rounded-xl p-6 transition-all duration-200 ${
              selectedChoice === 'no'
                ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white shadow-lg scale-105 ring-4 ring-gray-600'
                : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 border-2 border-gray-200 hover:border-gray-400 hover:scale-102'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">○</div>
              <div className="font-bold text-lg mb-1">
                Low Tide
              </div>
              <div className={`text-sm ${selectedChoice === 'no' ? 'text-gray-200' : 'text-gray-600'}`}>
                Washed ashore
              </div>
              {selectedChoice === 'no' && (
                <div className="mt-3 font-bold">✓ Unavailable</div>
              )}
            </div>
          </button>

        </div>
      </div>

    </div>
  );
}
