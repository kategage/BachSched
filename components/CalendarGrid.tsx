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
        const dateKey = getDateKey(date); // Unique key like "2026-03-06"
        const displayDate = formatDisplayDate(date); // "Friday, March 6"
        const selectedChoice = availability[dateKey]; // Current selection for THIS date only

        return (
          <div
            key={dateKey}
            className="bg-gradient-to-r from-teal-50 to-orange-50 rounded-2xl p-5 border-2 border-teal-200 shadow-sm"
          >
            {/* Date Header */}
            <div className="mb-3">
              <p className="font-bold text-lg text-gray-800">
                {displayDate}
              </p>
            </div>

            {/* Status Buttons - Horizontal */}
            <div className="flex gap-3">
              {/* YES Button */}
              <button
                type="button"
                onClick={() => onStatusChange(dateKey, 'yes')}
                className={`
                  flex-1 py-4 px-6 rounded-full font-bold text-base transition-all duration-200 shadow-md
                  ${selectedChoice === 'yes'
                    ? 'bg-emerald-500 text-white transform scale-105 shadow-lg'
                    : 'bg-white border-2 border-gray-300 text-gray-600 hover:shadow-lg hover:scale-102'
                  }
                `}
              >
                {selectedChoice === 'yes' ? '✓ Yes' : 'Yes'}
              </button>

              {/* MAYBE Button */}
              <button
                type="button"
                onClick={() => onStatusChange(dateKey, 'maybe')}
                className={`
                  flex-1 py-4 px-6 rounded-full font-bold text-base transition-all duration-200 shadow-md
                  ${selectedChoice === 'maybe'
                    ? 'bg-amber-400 text-gray-900 transform scale-105 shadow-lg'
                    : 'bg-white border-2 border-gray-300 text-gray-600 hover:shadow-lg hover:scale-102'
                  }
                `}
              >
                {selectedChoice === 'maybe' ? '~ Maybe' : 'Maybe'}
              </button>

              {/* NO Button */}
              <button
                type="button"
                onClick={() => onStatusChange(dateKey, 'no')}
                className={`
                  flex-1 py-4 px-6 rounded-full font-bold text-base transition-all duration-200 shadow-md
                  ${selectedChoice === 'no'
                    ? 'bg-rose-400 text-white transform scale-105 shadow-lg'
                    : 'bg-white border-2 border-gray-300 text-gray-600 hover:shadow-lg hover:scale-102'
                  }
                `}
              >
                {selectedChoice === 'no' ? '✗ No' : 'No'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
