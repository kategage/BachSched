'use client';

import { getCrewTitleForName } from '@/lib/crewTitles';

interface CrewSummaryPanelProps {
  crewMemberName: string;
  datesAssessed: number;
  totalDates: number;
  filterType: 'all' | 'high' | 'mid' | 'unassessed';
  onFilterChange: (filter: 'all' | 'high' | 'mid' | 'unassessed') => void;
}

/**
 * CrewSummaryPanel - Dashboard-style card at top of assessment page
 * Shows crew info, progress, and filter chips
 */
export default function CrewSummaryPanel({
  crewMemberName,
  datesAssessed,
  totalDates,
  filterType,
  onFilterChange,
}: CrewSummaryPanelProps) {
  const percentComplete = Math.round((datesAssessed / totalDates) * 100);
  const crewTitle = getCrewTitleForName(crewMemberName);

  return (
    <>
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl" style={{ backgroundColor: '#0A2E4D' }}>
              🌊
            </div>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#0A2E4D' }}>
                Expedition Availability Assessment
              </h1>
              <p className="text-gray-500">{crewMemberName} • March 6-22, 2026</p>
            </div>
          </div>
        </div>

        {/* Crew Member Info - 3 Column Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs uppercase tracking-wide text-blue-900 font-semibold mb-1">
              Crew Member
            </p>
            <p className="text-lg font-semibold" style={{ color: '#0A2E4D' }}>
              {crewMemberName}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs uppercase tracking-wide text-blue-900 font-semibold mb-1">
              Crew Title
            </p>
            <p className="text-lg font-semibold" style={{ color: '#0A2E4D' }}>
              {crewTitle}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs uppercase tracking-wide text-blue-900 font-semibold mb-1">
              Expedition
            </p>
            <p className="text-lg font-semibold" style={{ color: '#0A2E4D' }}>
              Coastal Celebration
            </p>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">
              Assessment Progress
            </p>
            <p className="text-3xl font-bold" style={{ color: '#0A2E4D' }}>
              {datesAssessed} <span className="text-lg text-gray-500 font-normal">of {totalDates} dates</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold" style={{ color: '#F9D949' }}>
              {percentComplete}%
            </p>
          </div>
        </div>
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500 rounded-full"
            style={{
              width: `${percentComplete}%`,
              background: 'linear-gradient(to right, #0A2E4D, #F9D949)'
            }}
          />
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'all' as const, label: 'All Dates' },
          { key: 'high' as const, label: 'High Tide Only' },
          { key: 'mid' as const, label: 'Mid Tide Only' },
          { key: 'unassessed' as const, label: 'Unassessed' }
        ].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onFilterChange(key)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              filterType === key
                ? 'text-white shadow-md'
                : 'bg-white border border-gray-200 hover:bg-gray-50'
            }`}
            style={filterType === key ? { backgroundColor: '#0A2E4D' } : {}}
          >
            {label}
          </button>
        ))}
      </div>
    </>
  );
}
