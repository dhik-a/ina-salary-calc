import { FlatZonePolicy } from '../calc/solve';
import { useLang } from '../i18n/useLang';

interface FlatZoneAlertProps {
  policy: FlatZonePolicy;
  onChange: (policy: FlatZonePolicy) => void;
}

const OPTIONS: Array<{ value: FlatZonePolicy; labelKey: 'flatZoneSmallest' | 'flatZoneLargest' | 'flatZoneMidpoint' }> = [
  { value: 'smallest', labelKey: 'flatZoneSmallest' },
  { value: 'largest', labelKey: 'flatZoneLargest' },
  { value: 'midpoint', labelKey: 'flatZoneMidpoint' },
];

export function FlatZoneAlert({ policy, onChange }: FlatZoneAlertProps) {
  const { t } = useLang();
  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3 mb-4 text-sm">
      <p className="mb-2">{t('flatZoneAlert')}</p>
      <div className="flex flex-wrap gap-3">
        {OPTIONS.map((opt) => (
          <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="flat-zone-policy"
              checked={policy === opt.value}
              onChange={() => onChange(opt.value)}
            />
            <span>{t(opt.labelKey)}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
