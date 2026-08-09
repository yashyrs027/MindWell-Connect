import React, { useState } from 'react';
import type { DateRange } from '../../hooks/useAnalyticsData';

type PresetKey = 'last7' | 'last30' | 'last90' | 'last180' | 'custom';

const PRESETS: { key: PresetKey; label: string; days?: number }[] = [
  { key: 'last7', label: 'Last 7 Days', days: 7 },
  { key: 'last30', label: 'Last 30 Days', days: 30 },
  { key: 'last90', label: 'Last 3 Months', days: 90 },
  { key: 'last180', label: 'Last 6 Months', days: 180 },
  { key: 'custom', label: 'Custom Range' },
];

const toInputDate = (d: Date) => d.toISOString().slice(0, 10);

interface DateRangeFilterProps {
  onChange: (range: DateRange, label: string) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ onChange }) => {
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>('last30');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [customError, setCustomError] = useState<string | undefined>(undefined);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const applyPreset = (preset: typeof PRESETS[number]) => {
    setSelectedPreset(preset.key);
    setCustomError(undefined);
    if (preset.key === 'custom') return; // wait for explicit dates

    const end = new Date(today);
    const start = new Date(today);
    start.setDate(start.getDate() - (preset.days! - 1));
    onChange({ start, end }, preset.label);
  };

  const applyCustomRange = () => {
    if (!customStart || !customEnd) {
      setCustomError('Select both a start and end date.');
      return;
    }
    const start = new Date(customStart);
    const end = new Date(customEnd);

    if (start > end) {
      setCustomError('Start date must be before end date.');
      return;
    }
    if (end > today) {
      setCustomError('End date cannot be in the future.');
      return;
    }

    setCustomError(undefined);
    onChange({ start, end }, `${customStart} – ${customEnd}`);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
      <label htmlFor="analytics-period" className="text-sm font-semibold text-slate-700 flex-shrink-0">
        Analytics Period:
      </label>
      <select
        id="analytics-period"
        value={selectedPreset}
        onChange={(e) => applyPreset(PRESETS.find(p => p.key === e.target.value)!)}
        className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        {PRESETS.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
      </select>

      {selectedPreset === 'custom' && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <input
            type="date"
            value={customStart}
            max={toInputDate(today)}
            onChange={(e) => setCustomStart(e.target.value)}
            aria-label="Custom range start date"
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-slate-400 text-sm">to</span>
          <input
            type="date"
            value={customEnd}
            max={toInputDate(today)}
            onChange={(e) => setCustomEnd(e.target.value)}
            aria-label="Custom range end date"
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={applyCustomRange}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Apply
          </button>
        </div>
      )}

      {customError && <p className="text-red-500 text-xs w-full sm:w-auto">{customError}</p>}
    </div>
  );
};

export default DateRangeFilter;