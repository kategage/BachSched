'use client';

import { formatTideTime } from '@/lib/tideData';

interface TideSummaryProps {
  highTides: string[];
  lowTides: string[];
}

/**
 * TideSummary - Clean, compact tide display
 * NO bullets, NO raw text lines
 * Format: 🌊 High: 2:41 AM • 3:36 PM
 *         🌑 Low: 9:21 AM • 10:16 PM
 */
export default function TideSummary({ highTides, lowTides }: TideSummaryProps) {
  const formatTimes = (times: string[]): string => {
    if (times.length === 0) return 'None';
    return times.map(formatTideTime).join(' • ');
  };

  return (
    <div className="rounded-xl bg-sky-50 px-3 py-2 space-y-1">
      <div className="flex items-center gap-2 text-xs">
        <span className="text-blue-600">🌊</span>
        <span className="font-medium text-slate-700">High:</span>
        <span className="text-slate-600">{formatTimes(highTides)}</span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-500">🌑</span>
        <span className="font-medium text-slate-700">Low:</span>
        <span className="text-slate-600">{formatTimes(lowTides)}</span>
      </div>
    </div>
  );
}
