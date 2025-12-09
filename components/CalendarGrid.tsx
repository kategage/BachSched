'use client';

import { getAllDates, formatDisplayDate, getDateKey } from '@/lib/dates';

interface CalendarGridProps {
  availability: Record<string, 'yes' | 'no' | 'maybe'>;
  onStatusChange: (date: string, status: 'yes' | 'no' | 'maybe') => void;
}

export default function CalendarGrid({
  availability,
  onStatusChange,
}: CalendarGridProps) {
  const dates = getAllDates();

  return (
    <div className="space-y-4">
      {dates.map((date) => {
        const dateKey = getDateKey(date);
        const displayDate = formatDisplayDate(date);
        const selectedChoice = availability[dateKey];

        // Split display date into day and date
        const [dayOfWeek, monthDay] = displayDate.split(', ');

        return (
          <div key={dateKey} className="bg-white p-6 border-l-4 border-gray-200">
            {/* Date header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-serif font-bold" style={{ color: '#0A2E4D' }}>
                  {dayOfWeek}
                </h3>
                <p className="text-gray-600">{monthDay}</p>
              </div>
              {selectedChoice && (
                <span className="text-xs px-3 py-1 font-semibold" style={{ backgroundColor: '#F9D949' }}>
                  ASSESSED
                </span>
              )}
            </div>

            {/* TIDE CHART VISUALIZATION */}
            <div className="relative h-40 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg overflow-hidden">
              {/* Tide level markers (background) */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
                <div className="text-xs text-gray-400 font-semibold">HIGH TIDE</div>
                <div className="text-xs text-gray-400 font-semibold">MID TIDE</div>
                <div className="text-xs text-gray-400 font-semibold">LOW TIDE</div>
              </div>

              {/* Interactive tide buttons */}
              <div className="relative h-full flex flex-col justify-between p-2">
                {/* HIGH TIDE - Available (YES) */}
                <button
                  type="button"
                  onClick={() => onStatusChange(dateKey, 'yes')}
                  className="h-1/3 transition-all duration-300 flex items-center justify-center font-semibold"
                  style={{
                    backgroundColor: selectedChoice === 'yes' ? '#0A2E4D' : 'rgba(255, 255, 255, 0.5)',
                    color: selectedChoice === 'yes' ? '#FFFFFF' : '#374151',
                    border: selectedChoice === 'yes' ? '4px solid #F9D949' : '2px solid #D1D5DB',
                    transform: selectedChoice === 'yes' ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: selectedChoice === 'yes' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedChoice !== 'yes') {
                      e.currentTarget.style.backgroundColor = 'rgba(10, 46, 77, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedChoice !== 'yes') {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                    }
                  }}
                >
                  {selectedChoice === 'yes' ? '🌊 HIGH TIDE - Available' : 'Available'}
                </button>

                {/* MID TIDE - Possible (MAYBE) */}
                <button
                  type="button"
                  onClick={() => onStatusChange(dateKey, 'maybe')}
                  className="h-1/3 transition-all duration-300 flex items-center justify-center font-semibold"
                  style={{
                    backgroundColor: selectedChoice === 'maybe' ? '#F9D949' : 'rgba(255, 255, 255, 0.5)',
                    color: selectedChoice === 'maybe' ? '#111827' : '#374151',
                    border: selectedChoice === 'maybe' ? '4px solid #0A2E4D' : '2px solid #D1D5DB',
                    transform: selectedChoice === 'maybe' ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: selectedChoice === 'maybe' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedChoice !== 'maybe') {
                      e.currentTarget.style.backgroundColor = 'rgba(249, 217, 73, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedChoice !== 'maybe') {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                    }
                  }}
                >
                  {selectedChoice === 'maybe' ? '〰️ MID TIDE - Possible' : 'Possible'}
                </button>

                {/* LOW TIDE - Unavailable (NO) */}
                <button
                  type="button"
                  onClick={() => onStatusChange(dateKey, 'no')}
                  className="h-1/3 transition-all duration-300 flex items-center justify-center font-semibold"
                  style={{
                    backgroundColor: selectedChoice === 'no' ? '#9CA3AF' : 'rgba(255, 255, 255, 0.5)',
                    color: selectedChoice === 'no' ? '#FFFFFF' : '#374151',
                    border: selectedChoice === 'no' ? '4px solid #6B7280' : '2px solid #D1D5DB',
                    transform: selectedChoice === 'no' ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: selectedChoice === 'no' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedChoice !== 'no') {
                      e.currentTarget.style.backgroundColor = 'rgba(156, 163, 175, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedChoice !== 'no') {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                    }
                  }}
                >
                  {selectedChoice === 'no' ? '○ LOW TIDE - Unavailable' : 'Unavailable'}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
