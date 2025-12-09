'use client';

import { formatTideTime } from '@/lib/tideData';

interface TideSummaryProps {
  highTides: string[];
  lowTides: string[];
}

/**
 * TideSummary Component
 *
 * Displays tide information in a clean, scannable format.
 * Expected data format:
 * - highTides: array of times in 24hr format ["02:41", "15:36"]
 * - lowTides: array of times in 24hr format ["09:21", "22:16"]
 *
 * Renders two compact rows with icons and formatted times:
 * 🌊 High   2:41 AM • 3:36 PM
 * 🌑 Low    9:21 AM • 10:16 PM
 */
export default function TideSummary({ highTides, lowTides }: TideSummaryProps) {
  // Format multiple times with bullet separator
  const formatTimes = (times: string[]): string => {
    if (times.length === 0) return 'None';
    return times.map(formatTideTime).join(' • ');
  };

  return (
    <div className="space-y-1">
      {/* High tide row */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-blue-600">🌊</span>
        <span className="font-medium text-gray-700 w-10">High</span>
        <span className="text-gray-600">{formatTimes(highTides)}</span>
      </div>

      {/* Low tide row */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-gray-500">🌑</span>
        <span className="font-medium text-gray-700 w-10">Low</span>
        <span className="text-gray-600">{formatTimes(lowTides)}</span>
      </div>
    </div>
  );
}
