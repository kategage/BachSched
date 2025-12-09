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
      {dates.map((date, index) => {
        const dateKey = getDateKey(date);
        const displayDate = formatDisplayDate(date);
        const selectedChoice = availability[dateKey];

        // Split display date into day and date
        const [dayOfWeek, monthDay] = displayDate.split(', ');

        // Alternating backgrounds
        const bgColor = index % 2 === 0 ? '#FFFFFF' : '#F3E9D2';

        return (
          <div
            key={dateKey}
            className="p-6 rounded-lg shadow-sm transition-all hover:shadow-md"
            style={{ backgroundColor: bgColor }}
          >
            {/* Date header with assessed badge */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-serif font-bold" style={{ color: '#05324F' }}>
                  {dayOfWeek}
                </h3>
                <p className="text-gray-600 text-sm">{monthDay}</p>
              </div>
              {selectedChoice && (
                <span
                  className="text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide"
                  style={{
                    backgroundColor: '#E3A534',
                    color: '#05324F'
                  }}
                >
                  ✓ Assessed
                </span>
              )}
            </div>

            {/* Horizontal pill buttons for tide levels */}
            <div className="flex gap-3 flex-wrap">
              {/* HIGH TIDE - Available */}
              <button
                type="button"
                onClick={() => onStatusChange(dateKey, 'yes')}
                className="flex-1 min-w-[140px] py-3 px-5 rounded-full font-semibold text-sm transition-all duration-200"
                style={{
                  backgroundColor: selectedChoice === 'yes' ? '#05324F' : '#FFFFFF',
                  color: selectedChoice === 'yes' ? '#FFFFFF' : '#05324F',
                  border: selectedChoice === 'yes' ? '2px solid #05324F' : '2px solid #05324F',
                  boxShadow: selectedChoice === 'yes' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(183, 227, 224, 0.5)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (selectedChoice !== 'yes') {
                    e.currentTarget.style.backgroundColor = '#B7E3E0';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedChoice !== 'yes') {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>🌊</span>
                  <div className="text-left">
                    <div className="font-bold">High Tide</div>
                    <div className="text-xs opacity-75">Fully on deck</div>
                  </div>
                </div>
              </button>

              {/* MID TIDE - Possible */}
              <button
                type="button"
                onClick={() => onStatusChange(dateKey, 'maybe')}
                className="flex-1 min-w-[140px] py-3 px-5 rounded-full font-semibold text-sm transition-all duration-200"
                style={{
                  backgroundColor: selectedChoice === 'maybe' ? '#F7E7A0' : '#FFFFFF',
                  color: '#05324F',
                  border: '2px solid #05324F',
                  boxShadow: selectedChoice === 'maybe' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (selectedChoice !== 'maybe') {
                    e.currentTarget.style.backgroundColor = '#FFF4CC';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedChoice !== 'maybe') {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>〰️</span>
                  <div className="text-left">
                    <div className="font-bold">Mid Tide</div>
                    <div className="text-xs opacity-75">Possibly afloat</div>
                  </div>
                </div>
              </button>

              {/* LOW TIDE - Unavailable */}
              <button
                type="button"
                onClick={() => onStatusChange(dateKey, 'no')}
                className="flex-1 min-w-[140px] py-3 px-5 rounded-full font-semibold text-sm transition-all duration-200"
                style={{
                  backgroundColor: selectedChoice === 'no' ? '#E5E5E5' : '#FFFFFF',
                  color: selectedChoice === 'no' ? '#6B7280' : '#05324F',
                  border: '2px solid #05324F',
                  boxShadow: selectedChoice === 'no' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (selectedChoice !== 'no') {
                    e.currentTarget.style.backgroundColor = '#F3F4F6';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedChoice !== 'no') {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>○</span>
                  <div className="text-left">
                    <div className="font-bold">Low Tide</div>
                    <div className="text-xs opacity-75">Washed ashore</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
