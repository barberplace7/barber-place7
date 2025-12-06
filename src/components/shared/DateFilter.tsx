import React from 'react';

interface DateFilterProps {
  datePreset: string;
  dateFrom: string;
  dateTo: string;
  onPresetChange: (preset: string) => void;
  onDateChange: (from: string, to: string) => void;
}

const DATE_PRESETS = [
  { id: 'today', name: 'Today' },
  { id: '7days', name: 'Last 7 Days' },
  { id: '30days', name: 'Last 30 Days' },
  { id: 'custom', name: 'Custom Range' }
];

export const DateFilter: React.FC<DateFilterProps> = ({
  datePreset,
  dateFrom,
  dateTo,
  onPresetChange,
  onDateChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
        <div className="flex flex-wrap gap-2">
          {DATE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onPresetChange(preset.id)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                datePreset === preset.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateChange(e.target.value, dateTo)}
            disabled={datePreset !== 'custom'}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => onDateChange(dateFrom, e.target.value)}
            disabled={datePreset !== 'custom'}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
};
