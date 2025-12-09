'use client';

import TideSummary from './TideSummary';
import TideSelector from './TideSelector';
import { getTideDataForDate } from '@/lib/tideData';

interface DateCardProps {
  date: Date;
  dateKey: string;
  dayOfWeek: string;
  monthDay: string;
  fieldDayNumber: number;
  selectedChoice?: 'yes' | 'no' | 'maybe';
  onStatusChange: (status: 'yes' | 'no' | 'maybe') => void;
  showTideInfo: boolean;
}

/**
 * DateCard - Card-based date row component
 * Structure:
 * - Header: Date name + Assessment badge
 * - Field Day label
 * - Tide info (optional)
 * - Tide selector controls
 */
export default function DateCard({
  date,
  dateKey,
  dayOfWeek,
  monthDay,
  fieldDayNumber,
  selectedChoice,
  onStatusChange,
  showTideInfo,
}: DateCardProps) {
  const tideData = getTideDataForDate(dateKey);

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-slate-200 px-5 py-4 space-y-3 hover:shadow-md transition-shadow">
      {/* Header row: date on left, assessment status on right */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold" style={{ color: '#0A2E4D' }}>
            {dayOfWeek}
          </h3>
          <p className="text-sm text-slate-600">{monthDay}</p>
          <p className="text-xs text-slate-500 mt-1">Field Day {fieldDayNumber}</p>
        </div>

        {/* Assessment badge */}
        <div>
          {selectedChoice ? (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
              ✓ Assessed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
              Not assessed
            </span>
          )}
        </div>
      </div>

      {/* Tide info section */}
      {showTideInfo && tideData && (
        <div className="pt-3 border-t border-slate-100">
          <TideSummary
            highTides={tideData.highTides}
            lowTides={tideData.lowTides}
          />
        </div>
      )}

      {/* Tide selector */}
      <div className="pt-3 border-t border-slate-100">
        <TideSelector
          selectedChoice={selectedChoice}
          onSelect={onStatusChange}
        />
      </div>
    </div>
  );
}
