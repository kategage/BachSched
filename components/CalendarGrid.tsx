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
      'min-h-[48px] px-5 py-3 rounded-lg font-medium text-sm transition-all duration-200 border-3 touch-manipulation flex-1';

    if (isSelected) {
      if (status === 'yes') {
        return `${baseClass} bg-primary text-white border-primary scale-105 shadow-sm`;
      }
      if (status === 'maybe') {
        return `${baseClass} bg-warning text-gray-900 border-warning scale-105 shadow-sm`;
      }
      if (status === 'no') {
        return `${baseClass} bg-muted text-gray-700 border-muted scale-105 shadow-sm`;
      }
    }

    return `${baseClass} bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50`;
  };

  return (
    <div className="space-y-4">
      {dates.map((date) => {
        const dateKey = getDateKey(date);
        const displayDate = formatDisplayDate(date);

        return (
          <div
            key={dateKey}
            className="bg-white rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_6px_rgba(0,0,0,0.1)] transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Date Display */}
              <div className="flex-shrink-0">
                <p className="font-semibold text-base text-gray-900">
                  {displayDate}
                </p>
              </div>

              {/* Status Buttons */}
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => onStatusChange(dateKey, 'yes')}
                  className={getButtonClass(dateKey, 'yes')}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => onStatusChange(dateKey, 'maybe')}
                  className={getButtonClass(dateKey, 'maybe')}
                >
                  Maybe
                </button>
                <button
                  type="button"
                  onClick={() => onStatusChange(dateKey, 'no')}
                  className={getButtonClass(dateKey, 'no')}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
