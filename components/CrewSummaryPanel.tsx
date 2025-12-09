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
    <div className="rounded-2xl bg-white shadow-sm border border-slate-200 px-6 py-6 mb-6">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#0A2E4D' }}>
          Expedition Availability Assessment
        </h1>
        <p className="text-sm text-slate-600">
          Expedition Portal • Crew Availability Assessment
        </p>
      </div>

      {/* Crew info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Crew Member
            </div>
            <div className="text-lg font-bold" style={{ color: '#0A2E4D' }}>
              {crewMemberName}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Crew Title
            </div>
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-sky-100 text-sm font-bold" style={{ color: '#0A2E4D' }}>
              {crewTitle}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Expedition
            </div>
            <div className="text-base font-semibold" style={{ color: '#0A2E4D' }}>
              Coastal Celebration Expedition
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Assessment Progress
            </div>
            <div className="text-base font-bold" style={{ color: '#0A2E4D' }}>
              {percentComplete}% • {datesAssessed} of {totalDates} dates
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-2.5 rounded-full transition-all duration-500"
            style={{
              width: `${percentComplete}%`,
              background: 'linear-gradient(90deg, #0A2E4D 0%, #62B6CB 100%)'
            }}
          />
        </div>
      </div>

      {/* Filter chips */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Filter Dates
        </div>
        <div className="flex flex-wrap gap-2">
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
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                filterType === key
                  ? 'text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-300 hover:border-slate-400'
              }`}
              style={filterType === key ? { backgroundColor: '#0A2E4D' } : {}}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
