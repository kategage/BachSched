'use client';

/**
 * TideLegend - Visual guide showing what each tide level means
 * 3-card grid layout with gradients and clear descriptions
 */
export default function TideLegend() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <p className="text-sm uppercase tracking-wide font-semibold text-gray-700 mb-4">
        Tide Level Guide
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* High Tide */}
        <div className="flex items-center gap-4 bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4 text-white">
          <div className="text-3xl">🌊</div>
          <div>
            <p className="font-bold text-lg">High Tide</p>
            <p className="text-sm text-blue-200">Fully on deck • Available</p>
          </div>
        </div>

        {/* Mid Tide */}
        <div className="flex items-center gap-4 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg p-4">
          <div className="text-3xl">〰️</div>
          <div>
            <p className="font-bold text-lg text-gray-900">Mid Tide</p>
            <p className="text-sm text-gray-700">Possibly afloat • Maybe</p>
          </div>
        </div>

        {/* Low Tide */}
        <div className="flex items-center gap-4 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg p-4">
          <div className="text-3xl">○</div>
          <div>
            <p className="font-bold text-lg text-gray-700">Low Tide</p>
            <p className="text-sm text-gray-600">Washed ashore • Unavailable</p>
          </div>
        </div>
      </div>
    </div>
  );
}
