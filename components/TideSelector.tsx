'use client';

interface TideSelectorProps {
  selectedChoice?: 'yes' | 'no' | 'maybe';
  onSelect: (status: 'yes' | 'no' | 'maybe') => void;
}

/**
 * TideSelector - Compact segmented control for tide level selection
 * Replaces long horizontal bars with modern segmented UI
 * Format: [ High Tide ] [ Mid Tide ] [ Low Tide ]
 */
export default function TideSelector({ selectedChoice, onSelect }: TideSelectorProps) {
  return (
    <div>
      {/* Desktop: horizontal segmented control */}
      <div className="hidden md:flex">
        <div className="inline-flex rounded-lg border border-slate-300 overflow-hidden">
          {/* High Tide */}
          <button
            type="button"
            onClick={() => onSelect('yes')}
            className={`px-6 py-3 text-xs font-semibold transition-all whitespace-nowrap border-r border-slate-300 ${
              selectedChoice === 'yes'
                ? 'text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
            style={selectedChoice === 'yes' ? { backgroundColor: '#0A2E4D' } : {}}
          >
            <div className="text-center">
              <div className="font-bold">High Tide</div>
              <div className="text-[10px] opacity-75 mt-0.5">Fully on deck</div>
            </div>
          </button>

          {/* Mid Tide */}
          <button
            type="button"
            onClick={() => onSelect('maybe')}
            className={`px-6 py-3 text-xs font-semibold transition-all whitespace-nowrap border-r border-slate-300 ${
              selectedChoice === 'maybe'
                ? ''
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
            style={selectedChoice === 'maybe' ? { backgroundColor: '#F9D949', color: '#0A2E4D' } : {}}
          >
            <div className="text-center">
              <div className="font-bold">Mid Tide</div>
              <div className="text-[10px] opacity-75 mt-0.5">Possibly afloat</div>
            </div>
          </button>

          {/* Low Tide */}
          <button
            type="button"
            onClick={() => onSelect('no')}
            className={`px-6 py-3 text-xs font-semibold transition-all whitespace-nowrap ${
              selectedChoice === 'no'
                ? 'bg-slate-400 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="text-center">
              <div className="font-bold">Low Tide</div>
              <div className="text-[10px] opacity-75 mt-0.5">Washed ashore</div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile: stacked buttons */}
      <div className="md:hidden flex flex-col gap-2">
        <button
          type="button"
          onClick={() => onSelect('yes')}
          className={`w-full px-4 py-3 rounded-lg text-xs font-semibold transition-all ${
            selectedChoice === 'yes'
              ? 'text-white'
              : 'bg-white text-slate-700 border border-slate-300'
          }`}
          style={selectedChoice === 'yes' ? { backgroundColor: '#0A2E4D' } : {}}
        >
          <div className="text-center">
            <div className="font-bold">High Tide</div>
            <div className="text-[10px] opacity-75 mt-0.5">Fully on deck</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelect('maybe')}
          className={`w-full px-4 py-3 rounded-lg text-xs font-semibold transition-all ${
            selectedChoice === 'maybe'
              ? ''
              : 'bg-white text-slate-700 border border-slate-300'
          }`}
          style={selectedChoice === 'maybe' ? { backgroundColor: '#F9D949', color: '#0A2E4D' } : {}}
        >
          <div className="text-center">
            <div className="font-bold">Mid Tide</div>
            <div className="text-[10px] opacity-75 mt-0.5">Possibly afloat</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelect('no')}
          className={`w-full px-4 py-3 rounded-lg text-xs font-semibold transition-all ${
            selectedChoice === 'no'
              ? 'bg-slate-400 text-white'
              : 'bg-white text-slate-700 border border-slate-300'
          }`}
        >
          <div className="text-center">
            <div className="font-bold">Low Tide</div>
            <div className="text-[10px] opacity-75 mt-0.5">Washed ashore</div>
          </div>
        </button>
      </div>
    </div>
  );
}
