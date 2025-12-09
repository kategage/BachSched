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
    <div className="space-y-3">
      {dates.map((date) => {
        const dateKey = getDateKey(date);
        const displayDate = formatDisplayDate(date);
        const selectedChoice = availability[dateKey];

        return (
          <div
            key={dateKey}
            className="bg-gradient-to-br from-cyan-50 via-teal-50 to-orange-50 rounded-3xl p-4 border-2 border-teal-300 shadow-lg hover:shadow-xl transition-shadow"
          >
            {/* Date Header with emoji */}
            <div className="mb-3 flex items-center justify-between">
              <p className="font-bold text-lg text-gray-800">
                {displayDate}
              </p>
              <span className="text-2xl">
                {selectedChoice === 'yes' ? '✨' : selectedChoice === 'maybe' ? '🤔' : selectedChoice === 'no' ? '🌊' : '🏖️'}
              </span>
            </div>

            {/* Status Buttons - Horizontal with vibrant colors */}
            <div className="flex gap-2">
              {/* YES Button */}
              <button
                type="button"
                onClick={() => onStatusChange(dateKey, 'yes')}
                className={`
                  flex-1 py-3 px-4 rounded-full font-bold text-base transition-all duration-300 shadow-md
                  ${selectedChoice === 'yes'
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white transform scale-105 shadow-2xl ring-2 ring-emerald-300'
                    : 'bg-white border-3 border-emerald-300 text-gray-700 hover:shadow-xl hover:scale-105 hover:border-emerald-400'
                  }
                `}
                style={{
                  borderWidth: selectedChoice !== 'yes' ? '3px' : '0'
                }}
              >
                <span className="text-lg">
                  {selectedChoice === 'yes' ? '✓ Yes! 🎉' : 'Yes'}
                </span>
              </button>

              {/* MAYBE Button */}
              <button
                type="button"
                onClick={() => onStatusChange(dateKey, 'maybe')}
                className={`
                  flex-1 py-3 px-4 rounded-full font-bold text-base transition-all duration-300 shadow-md
                  ${selectedChoice === 'maybe'
                    ? 'bg-gradient-to-r from-amber-300 to-orange-400 text-gray-900 transform scale-105 shadow-2xl ring-2 ring-amber-300'
                    : 'bg-white border-3 border-amber-300 text-gray-700 hover:shadow-xl hover:scale-105 hover:border-amber-400'
                  }
                `}
                style={{
                  borderWidth: selectedChoice !== 'maybe' ? '3px' : '0'
                }}
              >
                <span className="text-lg">
                  {selectedChoice === 'maybe' ? '🤔 Maybe' : 'Maybe'}
                </span>
              </button>

              {/* NO Button */}
              <button
                type="button"
                onClick={() => onStatusChange(dateKey, 'no')}
                className={`
                  flex-1 py-3 px-4 rounded-full font-bold text-base transition-all duration-300 shadow-md
                  ${selectedChoice === 'no'
                    ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white transform scale-105 shadow-2xl ring-2 ring-rose-300'
                    : 'bg-white border-3 border-rose-300 text-gray-700 hover:shadow-xl hover:scale-105 hover:border-rose-400'
                  }
                `}
                style={{
                  borderWidth: selectedChoice !== 'no' ? '3px' : '0'
                }}
              >
                <span className="text-lg">
                  {selectedChoice === 'no' ? '✗ No' : 'No'}
                </span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
