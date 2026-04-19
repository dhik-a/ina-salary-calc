import { Period } from '../calc/constants';
import { useLang } from '../i18n/useLang';

interface PeriodToggleProps {
  value: Period;
  onChange: (period: Period) => void;
}

export function PeriodToggle({ value, onChange }: PeriodToggleProps) {
  const { t } = useLang();
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
        {t('monthly')}
      </button>
      <button
        onClick={() => onChange('annually')}
        className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
          value === 'annually'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {t('annually')}
      </button>
    </div>
  );
}
