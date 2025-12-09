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
      'min-h-[48px] px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 touch-manipulation flex-1 text-sm';

    if (isSelected) {
      if (status === 'yes') {
        return `${baseClass} text-white shadow-md` + ' bg-[#10B981]'; // Emerald green
      }
      if (status === 'maybe') {
        return `${baseClass} text-gray-900 shadow-md` + ' bg-[#FBBF24]'; // Sunshine yellow
      }
      if (status === 'no') {
        return `${baseClass} text-white shadow-md` + ' bg-[#FB7185]'; // Coral pink
      }
    }

    return `${baseClass} bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100`;
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
