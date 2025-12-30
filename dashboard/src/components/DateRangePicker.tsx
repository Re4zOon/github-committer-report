import { useState } from 'react';
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';

interface DateRangePickerProps {
  onRangeChange: (since: Date, until: Date) => void;
}

type PresetRange = '7d' | '30d' | '90d' | 'thisMonth' | 'lastMonth' | 'custom';

export function DateRangePicker({ onRangeChange }: DateRangePickerProps) {
  const [preset, setPreset] = useState<PresetRange>('30d');
  const [customStart, setCustomStart] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [customEnd, setCustomEnd] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handlePresetChange = (newPreset: PresetRange) => {
    setPreset(newPreset);
    const now = new Date();
    let since: Date;
    let until: Date = now;

    switch (newPreset) {
      case '7d':
        since = subDays(now, 7);
        break;
      case '30d':
        since = subDays(now, 30);
        break;
      case '90d':
        since = subDays(now, 90);
        break;
      case 'thisMonth':
        since = startOfMonth(now);
        until = endOfMonth(now);
        break;
      case 'lastMonth': {
        const lastMonth = subMonths(now, 1);
        since = startOfMonth(lastMonth);
        until = endOfMonth(lastMonth);
        break;
      }
      case 'custom':
        since = new Date(customStart);
        until = new Date(customEnd);
        break;
      default:
        since = subDays(now, 30);
    }

    onRangeChange(since, until);
  };

  const handleCustomRangeApply = () => {
    setPreset('custom');
    onRangeChange(new Date(customStart), new Date(customEnd));
  };

  return (
    <div className="date-range-picker">
      <div className="preset-buttons">
        <button
          className={`preset-btn ${preset === '7d' ? 'active' : ''}`}
          onClick={() => handlePresetChange('7d')}
        >
          Last 7 Days
        </button>
        <button
          className={`preset-btn ${preset === '30d' ? 'active' : ''}`}
          onClick={() => handlePresetChange('30d')}
        >
          Last 30 Days
        </button>
        <button
          className={`preset-btn ${preset === '90d' ? 'active' : ''}`}
          onClick={() => handlePresetChange('90d')}
        >
          Last 90 Days
        </button>
        <button
          className={`preset-btn ${preset === 'thisMonth' ? 'active' : ''}`}
          onClick={() => handlePresetChange('thisMonth')}
        >
          This Month
        </button>
        <button
          className={`preset-btn ${preset === 'lastMonth' ? 'active' : ''}`}
          onClick={() => handlePresetChange('lastMonth')}
        >
          Last Month
        </button>
      </div>
      <div className="custom-range">
        <input
          type="date"
          value={customStart}
          onChange={(e) => setCustomStart(e.target.value)}
          className="date-input"
        />
        <span className="date-separator">to</span>
        <input
          type="date"
          value={customEnd}
          onChange={(e) => setCustomEnd(e.target.value)}
          className="date-input"
        />
        <button onClick={handleCustomRangeApply} className="apply-btn">
          Apply
        </button>
      </div>
    </div>
  );
}

export default DateRangePicker;
