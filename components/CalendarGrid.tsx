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

    // Pill-shaped buttons with proper styling
    const baseClass =
      'px-6 py-3 font-semibold transition-all duration-200 ease-in-out touch-manipulation flex-1 text-sm';

    if (isSelected) {
      // Selected state with scale and shadow
      if (status === 'yes') {
        return `${baseClass} text-white transform scale-105` + ' bg-emerald-500 rounded-full shadow-[0_4px_6px_rgba(0,0,0,0.1)]'; // Emerald green
      }
      if (status === 'maybe') {
        return `${baseClass} text-gray-900 transform scale-105` + ' bg-amber-400 rounded-full shadow-[0_4px_6px_rgba(0,0,0,0.1)]'; // Sunshine yellow
      }
      if (status === 'no') {
        return `${baseClass} text-white transform scale-105` + ' bg-rose-400 rounded-full shadow-[0_4px_6px_rgba(0,0,0,0.1)]'; // Coral pink
      }
    }

    // Unselected state
    return `${baseClass} bg-white text-gray-600 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-full`;
  };

  const getStatusEmoji = (status: 'yes' | 'no' | 'maybe') => {
    if (status === 'yes') return '✓';
    if (status === 'maybe') return '~';
    if (status === 'no') return '✗';
    return '';
  };

  return (
    <div className="space-y-3">
      {dates.map((date) => {
        const dateKey = getDateKey(date);
        const displayDate = formatDisplayDate(date);
        const currentStatus = availability[dateKey];

        return (
          <div
            key={dateKey}
            className="bg-white rounded-xl p-4 border border-gray-100"
          >
            {/* Date Header */}
            <div className="mb-3">
              <p className="font-semibold text-sm text-gray-700">
                {displayDate}
              </p>
            </div>

            {/* Status Buttons - Horizontal */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onStatusChange(dateKey, 'yes')}
                className={getButtonClass(dateKey, 'yes')}
              >
                {currentStatus === 'yes' && getStatusEmoji('yes') + ' '}
                Yes
              </button>
              <button
                type="button"
                onClick={() => onStatusChange(dateKey, 'maybe')}
                className={getButtonClass(dateKey, 'maybe')}
              >
                {currentStatus === 'maybe' && getStatusEmoji('maybe') + ' '}
                Maybe
              </button>
              <button
                type="button"
                onClick={() => onStatusChange(dateKey, 'no')}
                className={getButtonClass(dateKey, 'no')}
              >
                {currentStatus === 'no' && getStatusEmoji('no') + ' '}
                No
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
