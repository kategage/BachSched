'use client';

import { useState } from 'react';
import { getAllDates, formatDisplayDate, getDateKey } from '@/lib/dates';
import { getTideDataForDate } from '@/lib/tideData';
import TideSummary from './TideSummary';

interface CalendarGridProps {
  availability: Record<string, 'yes' | 'no' | 'maybe'>;
  onStatusChange: (date: string, status: 'yes' | 'no' | 'maybe') => void;
}

type FilterType = 'all' | 'high' | 'mid' | 'unassessed';

export default function CalendarGrid({
  availability,
  onStatusChange,
}: CalendarGridProps) {
  const dates = getAllDates();
  const [showTideInfo, setShowTideInfo] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  // Filter dates based on selected filter
  const filteredDates = dates.filter(date => {
    const dateKey = getDateKey(date);
    const selectedChoice = availability[dateKey];

    if (filter === 'all') return true;
    if (filter === 'high') return selectedChoice === 'yes';
    if (filter === 'mid') return selectedChoice === 'maybe';
    if (filter === 'unassessed') return !selectedChoice;
    return true;
  });

  return (
    <div>
      {/* Filters and tide toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Dates' },
            { key: 'high', label: 'High Tide Only' },
            { key: 'mid', label: 'Mid Tide Only' },
            { key: 'unassessed', label: 'Unassessed' }
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key as FilterType)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                filter === key
                  ? 'text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
              style={filter === key ? { backgroundColor: '#0A2E4D' } : {}}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tide info toggle - styled as a modern pill */}
        <button
          type="button"
          onClick={() => setShowTideInfo(!showTideInfo)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm ${
            showTideInfo
              ? 'bg-blue-50 border-2 hover:bg-blue-100'
              : 'bg-white border-2 border-gray-300 hover:border-gray-400'
          }`}
          style={{
            borderColor: showTideInfo ? '#62B6CB' : undefined,
            color: '#0A2E4D'
          }}
        >
          <span className="text-sm">{showTideInfo ? '▼' : '▶'}</span>
          <span>Field Conditions</span>
        </button>
      </div>

      {/* Date rows */}
      <div className="space-y-2">
        {filteredDates.map((date, index) => {
          const dateKey = getDateKey(date);
          const displayDate = formatDisplayDate(date);
          const selectedChoice = availability[dateKey];
          const [dayOfWeek, monthDay] = displayDate.split(', ');
          const tideData = getTideDataForDate(dateKey);

          return (
            <div
              key={dateKey}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
            >
              {/* Desktop layout: 3-zone row */}
              <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center">
                {/* Left zone: Date info */}
                <div className="col-span-3">
                  <div className="font-bold text-base" style={{ color: '#0A2E4D' }}>
                    {dayOfWeek}
                  </div>
                  <div className="text-sm text-gray-600">{monthDay}</div>
                  <div className="text-xs text-gray-500 mt-1">Field Day {index + 1}</div>

                  {/* Tide info (desktop) */}
                  {showTideInfo && tideData && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <TideSummary
                        highTides={tideData.highTides}
                        lowTides={tideData.lowTides}
                      />
                    </div>
                  )}
                </div>

                {/* Center zone: Segmented control */}
                <div className="col-span-6 flex justify-center">
                  <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
                    {/* High Tide */}
                    <button
                      type="button"
                      onClick={() => onStatusChange(dateKey, 'yes')}
                      className={`px-5 py-2.5 text-xs font-semibold transition-all whitespace-nowrap ${
                        selectedChoice === 'yes'
                          ? 'text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                      style={selectedChoice === 'yes' ? { backgroundColor: '#0A2E4D' } : {}}
                    >
                      <div className="text-center">
                        <div className="font-bold">High Tide</div>
                        <div className="text-[10px] opacity-75">Fully on deck</div>
                      </div>
                    </button>

                    {/* Mid Tide */}
                    <button
                      type="button"
                      onClick={() => onStatusChange(dateKey, 'maybe')}
                      className={`px-5 py-2.5 text-xs font-semibold transition-all border-x border-gray-300 whitespace-nowrap ${
                        selectedChoice === 'maybe'
                          ? 'text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                      style={selectedChoice === 'maybe' ? { backgroundColor: '#F9D949', color: '#0A2E4D' } : {}}
                    >
                      <div className="text-center">
                        <div className="font-bold">Mid Tide</div>
                        <div className="text-[10px] opacity-75">Possibly afloat</div>
                      </div>
                    </button>

                    {/* Low Tide */}
                    <button
                      type="button"
                      onClick={() => onStatusChange(dateKey, 'no')}
                      className={`px-5 py-2.5 text-xs font-semibold transition-all whitespace-nowrap ${
                        selectedChoice === 'no'
                          ? 'bg-gray-400 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-bold">Low Tide</div>
                        <div className="text-[10px] opacity-75">Washed ashore</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Right zone: Status badge */}
                <div className="col-span-3 flex justify-end">
                  {selectedChoice ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      ✓ Assessed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      Not assessed
                    </span>
                  )}
                </div>
              </div>

              {/* Mobile layout: Stacked */}
              <div className="md:hidden space-y-3">
                {/* Date header */}
                <div>
                  <div className="font-bold text-base" style={{ color: '#0A2E4D' }}>
                    {dayOfWeek}
                  </div>
                  <div className="text-sm text-gray-600">{monthDay}</div>
                  <div className="text-xs text-gray-500 mt-1">Field Day {index + 1}</div>
                </div>

                {/* Tide info (mobile) */}
                {showTideInfo && tideData && (
                  <div className="pt-2 border-t border-gray-100">
                    <TideSummary
                      highTides={tideData.highTides}
                      lowTides={tideData.lowTides}
                    />
                  </div>
                )}

                {/* Segmented control (mobile - full width) */}
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => onStatusChange(dateKey, 'yes')}
                    className={`w-full px-4 py-3 rounded-lg text-xs font-semibold transition-all ${
                      selectedChoice === 'yes'
                        ? 'text-white'
                        : 'bg-white text-gray-700 border border-gray-300'
                    }`}
                    style={selectedChoice === 'yes' ? { backgroundColor: '#0A2E4D' } : {}}
                  >
                    <div className="text-center">
                      <div className="font-bold">High Tide</div>
                      <div className="text-[10px] opacity-75">Fully on deck</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onStatusChange(dateKey, 'maybe')}
                    className={`w-full px-4 py-3 rounded-lg text-xs font-semibold transition-all ${
                      selectedChoice === 'maybe'
                        ? 'text-white'
                        : 'bg-white text-gray-700 border border-gray-300'
                    }`}
                    style={selectedChoice === 'maybe' ? { backgroundColor: '#F9D949', color: '#0A2E4D' } : {}}
                  >
                    <div className="text-center">
                      <div className="font-bold">Mid Tide</div>
                      <div className="text-[10px] opacity-75">Possibly afloat</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onStatusChange(dateKey, 'no')}
                    className={`w-full px-4 py-3 rounded-lg text-xs font-semibold transition-all ${
                      selectedChoice === 'no'
                        ? 'bg-gray-400 text-white'
                        : 'bg-white text-gray-700 border border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-bold">Low Tide</div>
                      <div className="text-[10px] opacity-75">Washed ashore</div>
                    </div>
                  </button>
                </div>

                {/* Status badge (mobile) */}
                <div className="flex justify-end">
                  {selectedChoice ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      ✓ Assessed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      Not assessed
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDates.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-sm">No dates match the selected filter.</p>
        </div>
      )}
    </div>
  );
}
