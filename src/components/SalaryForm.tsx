import { PtkpStatus, Period } from '../calc/constants';
import { CurrencyInput } from './CurrencyInput';
import { PeriodToggle } from './PeriodToggle';

interface SalaryFormProps {
  gross: number;
  onGrossChange: (gross: number) => void;
  ptkp: PtkpStatus;
  onPtkpChange: (ptkp: PtkpStatus) => void;
  period: Period;
  onPeriodChange: (period: Period) => void;
}

const PTKP_OPTIONS: PtkpStatus[] = ['TK/0', 'TK/1', 'TK/2', 'TK/3', 'K/0', 'K/1', 'K/2', 'K/3'];

export function SalaryForm({
  gross,
  onGrossChange,
  ptkp,
  onPtkpChange,
  period,
  onPeriodChange,
}: SalaryFormProps) {
  return (
    <div className="space-y-4">
      <CurrencyInput
        value={gross}
        onChange={onGrossChange}
        label="Gross Salary (Monthly)"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">PTKP Status</label>
        <select
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Display Period</label>
        <PeriodToggle value={period} onChange={onPeriodChange} />
      </div>
    </div>
  );
}
