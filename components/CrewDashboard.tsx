'use client';

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

  return (
    <div className="bg-white border-l-4 rounded-xl shadow-md p-6 mb-6" style={{ borderLeftColor: '#62B6CB' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Crew Member
          </div>
          <div className="text-lg font-bold" style={{ color: '#0A2E4D' }}>
            {crewMemberName}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Expedition
          </div>
          <div className="text-lg font-bold" style={{ color: '#0A2E4D' }}>
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

        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Dates Assessed
          </div>
          <div className="text-lg font-bold" style={{ color: '#0A2E4D' }}>
            {datesAssessed} of {totalDates}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {percentComplete}% • {datesAssessed} of {totalDates} dates assessed
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
