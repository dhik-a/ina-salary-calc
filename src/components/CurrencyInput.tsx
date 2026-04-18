import { parseRupiahInput, formatRupiah } from '../calc/format';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export function CurrencyInput({ value, onChange, label }: CurrencyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseRupiahInput(e.target.value);
    onChange(parsed);
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        type="text"
        inputMode="numeric"
        value={value === 0 ? '' : formatRupiah(value)}
        onChange={handleChange}
        placeholder="Rp 0"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      />
    </div>
  );
}
