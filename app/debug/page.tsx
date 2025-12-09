'use client';

import { getAllDates, formatDisplayDate, getDateKey } from '@/lib/dates';
import { useState } from 'react';

export default function DebugPage() {
  const dates = getAllDates();
  const [availability, setAvailability] = useState<Record<string, string>>({});

  const handleSelection = (dateKey: string, choice: string) => {
    console.log('Button clicked:', { dateKey, choice });
    setAvailability(prev => {
      const newState = {
        ...prev,
        [dateKey]: choice
      };
      console.log('New availability state:', newState);
      return newState;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Debug: Date Keys and Button State</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">All Dates and Their Keys:</h2>
          <div className="space-y-2 font-mono text-sm bg-gray-50 p-4 rounded">
            {dates.map((date, index) => {
              const dateKey = getDateKey(date);
              const displayDate = formatDisplayDate(date);
              return (
                <div key={index} className="flex gap-4">
                  <span className="font-bold">{index + 1}.</span>
                  <span className="flex-1">{displayDate}</span>
                  <span className="text-blue-600">{dateKey}</span>
                  <span className="text-gray-400">ISO: {date.toISOString()}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Current State:</h2>
          <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(availability, null, 2)}
          </pre>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Test Buttons (March 6-8):</h2>
          {dates.slice(0, 3).map((date) => {
            const dateKey = getDateKey(date);
            const displayDate = formatDisplayDate(date);
            const selectedChoice = availability[dateKey];

            return (
              <div key={dateKey} className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                <div className="mb-3">
                  <p className="font-bold">{displayDate}</p>
                  <p className="text-xs text-gray-500">Key: {dateKey}</p>
                  <p className="text-xs text-blue-600">Selected: {selectedChoice || 'none'}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelection(dateKey, 'yes')}
                    className={`px-4 py-2 rounded-full font-bold transition-all ${
                      selectedChoice === 'yes'
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white scale-105'
                        : 'bg-white border-3 border-emerald-300'
                    }`}
                  >
                    {selectedChoice === 'yes' ? '✓ Yes' : 'Yes'}
                  </button>
                  <button
                    onClick={() => handleSelection(dateKey, 'maybe')}
                    className={`px-4 py-2 rounded-full font-bold transition-all ${
                      selectedChoice === 'maybe'
                        ? 'bg-gradient-to-r from-amber-300 to-orange-400 text-gray-900 scale-105'
                        : 'bg-white border-3 border-amber-300'
                    }`}
                  >
                    {selectedChoice === 'maybe' ? '🤔 Maybe' : 'Maybe'}
                  </button>
                  <button
                    onClick={() => handleSelection(dateKey, 'no')}
                    className={`px-4 py-2 rounded-full font-bold transition-all ${
                      selectedChoice === 'no'
                        ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white scale-105'
                        : 'bg-white border-3 border-rose-300'
                    }`}
                  >
                    {selectedChoice === 'no' ? '✗ No' : 'No'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <a href="/" className="text-blue-600 hover:underline">← Back to Home</a>
        </div>
      </div>
    </div>
  );
}
