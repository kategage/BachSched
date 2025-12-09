'use client';

import { getCrewTitleForName } from '@/lib/crewTitles';

interface CrewDashboardProps {
  crewMemberName: string;
  datesAssessed: number;
  totalDates: number;
}

export default function CrewDashboard({
  crewMemberName,
  datesAssessed,
  totalDates,
}: CrewDashboardProps) {
  const percentComplete = Math.round((datesAssessed / totalDates) * 100);
  const isComplete = datesAssessed === totalDates;
  const crewTitle = getCrewTitleForName(crewMemberName);

  return (
    <div className="bg-white border-l-4 rounded-xl shadow-md p-6 mb-6" style={{ borderLeftColor: '#62B6CB' }}>
      {/* Grid layout for crew info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Crew Member
          </div>
          <div className="text-lg font-bold mb-2" style={{ color: '#0A2E4D' }}>
            {crewMemberName}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Crew Title:
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50" style={{ color: '#0A2E4D' }}>
              {crewTitle}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              Expedition
            </div>
            <div className="text-base font-bold" style={{ color: '#0A2E4D' }}>
              Coastal Celebration Expedition
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              Assessment Status
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                isComplete
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {isComplete ? '✓ Complete' : '⧗ In Progress'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar section */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Assessment Progress
          </span>
          <span className="text-sm font-bold" style={{ color: '#0A2E4D' }}>
            {percentComplete}% • {datesAssessed} of {totalDates} dates
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-3 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${percentComplete}%`,
              background: 'linear-gradient(90deg, #0A2E4D 0%, #62B6CB 100%)'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
