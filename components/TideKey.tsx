'use client';

export default function TideKey() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-6">
      <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: '#0A2E4D' }}>
        Tide Key
      </h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#0A2E4D' }}></div>
          <div className="text-sm">
            <span className="font-semibold" style={{ color: '#0A2E4D' }}>High Tide</span>
            <span className="text-gray-600"> – Available</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F9D949' }}></div>
          <div className="text-sm">
            <span className="font-semibold" style={{ color: '#0A2E4D' }}>Mid Tide</span>
            <span className="text-gray-600"> – Possibly available</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <div className="text-sm">
            <span className="font-semibold" style={{ color: '#0A2E4D' }}>Low Tide</span>
            <span className="text-gray-600"> – Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
}
