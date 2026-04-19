import { ThrType } from '../calc/constants';

interface ThrToggleProps {
  value: ThrType;
  onChange: (type: ThrType) => void;
}

export function ThrToggle({ value, onChange }: ThrToggleProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange('full')}
        className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition ${
          value === 'full'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Full (≥12 months)
      </button>
      <button
        onClick={() => onChange('prorated')}
        className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition ${
          value === 'prorated'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Pro-rated (&lt;12 months)
      </button>
    </div>
  );
}
