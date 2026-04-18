import { Period } from '../calc/constants';

interface PeriodToggleProps {
  value: Period;
  onChange: (period: Period) => void;
}

export function PeriodToggle({ value, onChange }: PeriodToggleProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange('monthly')}
        className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
          value === 'monthly'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => onChange('annually')}
        className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
          value === 'annually'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Annually
      </button>
    </div>
  );
}
