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
      'min-h-[44px] px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 border-2 touch-manipulation active:scale-95';

    if (isSelected) {
      if (status === 'yes') {
        return `${baseClass} bg-tropical-turquoise text-white border-tropical-turquoise shadow-lg shadow-tropical-turquoise/30 hover:shadow-xl`;
      }
      if (status === 'no') {
        return `${baseClass} bg-tropical-coral text-white border-tropical-coral shadow-lg shadow-tropical-coral/30 hover:shadow-xl`;
      }
      if (status === 'maybe') {
        return `${baseClass} bg-tropical-orange text-white border-tropical-orange shadow-lg shadow-tropical-orange/30 hover:shadow-xl`;
      }
    }

    return `${baseClass} bg-white text-tropical-navy border-tropical-turquoise/30 hover:border-tropical-turquoise hover:bg-tropical-sky/50`;
  };

  return (
    <div className="space-y-3">
      {dates.map((date) => {
        const dateKey = getDateKey(date);
        const displayDate = formatDisplayDate(date);

        return (
          <div
            key={dateKey}
            className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow border border-tropical-turquoise/20"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Date Display */}
              <div className="flex-shrink-0">
                <p className="font-bold text-lg text-tropical-navy">
                  {displayDate}
                </p>
              </div>

              {/* Status Buttons */}
              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                <button
                  type="button"
                  onClick={() => onStatusChange(dateKey, 'yes')}
                  className={getButtonClass(dateKey, 'yes')}
                >
                  <span className="flex items-center gap-1">
                    <span>✓</span>
                    <span>Yes</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onStatusChange(dateKey, 'maybe')}
                  className={getButtonClass(dateKey, 'maybe')}
                >
                  <span className="flex items-center gap-1">
                    <span>?</span>
                    <span>Maybe</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onStatusChange(dateKey, 'no')}
                  className={getButtonClass(dateKey, 'no')}
                >
                  <span className="flex items-center gap-1">
                    <span>✗</span>
                    <span>No</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
