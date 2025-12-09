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

  const getButtonClass = (dateKey: string, status: 'yes' | 'no' | 'maybe') => {
    const currentStatus = availability[dateKey];
    const isSelected = currentStatus === status;

    const baseClass =
      'px-3 py-2 rounded-lg font-medium text-sm transition-all border-2';

    if (isSelected) {
      if (status === 'yes') {
        return `${baseClass} bg-green-500 text-white border-green-600 shadow-md`;
      }
      if (status === 'no') {
        return `${baseClass} bg-red-500 text-white border-red-600 shadow-md`;
      }
      if (status === 'maybe') {
        return `${baseClass} bg-yellow-400 text-gray-900 border-yellow-500 shadow-md`;
      }
    }

    return `${baseClass} bg-white text-gray-700 border-gray-300 hover:border-gray-400`;
  };

  return (
    <div className="space-y-4">
      {dates.map((date) => {
        const dateKey = getDateKey(date);
        const displayDate = formatDisplayDate(date);

        return (
          <div
            key={dateKey}
            className="bg-white rounded-xl p-4 shadow-md border-2 border-pink-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Date Display */}
              <div className="flex-shrink-0">
                <p className="font-bold text-lg text-party-purple">
                  {displayDate}
                </p>
              </div>

              {/* Status Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onStatusChange(dateKey, 'yes')}
                  className={getButtonClass(dateKey, 'yes')}
                >
                  ✓ Yes
                </button>
                <button
                  type="button"
                  onClick={() => onStatusChange(dateKey, 'maybe')}
                  className={getButtonClass(dateKey, 'maybe')}
                >
                  ? Maybe
                </button>
                <button
                  type="button"
                  onClick={() => onStatusChange(dateKey, 'no')}
                  className={getButtonClass(dateKey, 'no')}
                >
                  ✗ No
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
