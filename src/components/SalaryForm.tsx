import { useId } from 'react';
import { PtkpStatus, Period, ThrType } from '../calc/constants';
import { CurrencyInput } from './CurrencyInput';
import { PeriodToggle } from './PeriodToggle';
import { ThrToggle } from './ThrToggle';
import { useLang } from '../i18n/useLang';

interface SalaryFormProps {
  gross: number;
  onGrossChange: (gross: number) => void;
  ptkp: PtkpStatus;
  onPtkpChange: (ptkp: PtkpStatus) => void;
  period: Period;
  onPeriodChange: (period: Period) => void;
  includeThr: boolean;
  onIncludeThrChange: (include: boolean) => void;
  thrType: ThrType;
  onThrTypeChange: (type: ThrType) => void;
  thrMonthsWorked: number;
  onThrMonthsWorkedChange: (months: number) => void;
}

const PTKP_OPTIONS: PtkpStatus[] = ['TK/0', 'TK/1', 'TK/2', 'TK/3', 'K/0', 'K/1', 'K/2', 'K/3'];

export function SalaryForm({
  gross,
  onGrossChange,
  ptkp,
  onPtkpChange,
  period,
  onPeriodChange,
  includeThr,
  onIncludeThrChange,
  thrType,
  onThrTypeChange,
  thrMonthsWorked,
  onThrMonthsWorkedChange,
}: SalaryFormProps) {
  const ptkpId = useId();
  const thrMonthsId = useId();
  const { t } = useLang();

  return (
    <div className="space-y-4">
      <CurrencyInput
        value={gross}
        onChange={onGrossChange}
        label={t('grossSalaryLabel')}
      />

      <div>
        <label htmlFor={ptkpId} className="block text-sm font-medium text-gray-700 mb-2">
          {t('ptkpStatusLabel')}
        </label>
        <select
          id={ptkpId}
          value={ptkp}
          onChange={(e) => onPtkpChange(e.target.value as PtkpStatus)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          {PTKP_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('displayPeriodLabel')}</label>
        <PeriodToggle value={period} onChange={onPeriodChange} />
      </div>

      {period === 'annually' && (
        <div className="border-t pt-4 space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeThr}
              onChange={(e) => onIncludeThrChange(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium text-gray-700">{t('includeThrLabel')}</span>
          </label>
          {includeThr && (
            <>
              <ThrToggle value={thrType} onChange={onThrTypeChange} />
              {thrType === 'prorated' && (
                <div>
                  <label htmlFor={thrMonthsId} className="block text-xs font-medium text-gray-600 mb-2">
                    {t('monthsWorkedLabel')}
                  </label>
                  <input
                    id={thrMonthsId}
                    type="number"
                    min={1}
                    max={11}
                    value={thrMonthsWorked}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (Number.isFinite(val)) {
                        onThrMonthsWorkedChange(Math.max(1, Math.min(11, val)));
                      }
                    }}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
