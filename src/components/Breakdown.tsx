import { Breakdown, Period } from '../calc/constants';
import { formatRupiah } from '../calc/format';

interface BreakdownProps {
  breakdown: Breakdown;
  period: Period;
}

export function Breakdown({ breakdown, period }: BreakdownProps) {
  const multiplier = period === 'annually' ? 12 : 1;

  const getValue = (value: number) => value * multiplier;

  const formatRp = (value: number) => formatRupiah(getValue(value));

  const terPercent = (breakdown.terRate * 100).toFixed(2);

  return (
    <div className="space-y-4">
      {/* Gross */}
      <div className="border-b pb-4">
        <div className="flex justify-between items-center font-semibold text-lg">
          <span>Gross Salary</span>
          <span>{formatRp(breakdown.gross)}</span>
        </div>
      </div>

      {/* Employee Deductions */}
      <div className="border-b pb-4">
        <div className="font-semibold text-gray-700 mb-3">Deductions (Employee)</div>
        <div className="space-y-2 text-sm pl-4">
          <div className="flex justify-between">
            <span>PPh 21 (TER {terPercent}%)</span>
            <span className="text-red-600">−{formatRp(breakdown.pph21)}</span>
          </div>
          <div className="flex justify-between">
            <span>BPJS Kesehatan (1%)</span>
            <span className="text-red-600">−{formatRp(breakdown.employee.kesehatan)}</span>
          </div>
          <div className="flex justify-between">
            <span>BPJS JHT (2%)</span>
            <span className="text-red-600">−{formatRp(breakdown.employee.jht)}</span>
          </div>
          <div className="flex justify-between">
            <span>
              BPJS JP (1%)
              {breakdown.jpCapped && ' (cap Rp 9.559.600)'}
            </span>
            <span className="text-red-600">−{formatRp(breakdown.employee.jp)}</span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
            <span>Total Deductions</span>
            <span className="text-red-600">−{formatRp(breakdown.totalEmployeeDeduction)}</span>
          </div>
        </div>
      </div>

      {/* Net Take-Home */}
      <div className="border-b pb-4 bg-green-50 p-4 rounded-lg">
        <div className="flex justify-between items-center font-bold text-lg text-green-700">
          <span>Net Take-Home</span>
          <span>{formatRp(breakdown.net)}</span>
        </div>
      </div>

      {/* Employer Contributions */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="font-semibold text-gray-700 mb-3">Employer Contributions (Informational)</div>
        <div className="space-y-2 text-sm pl-4">
          <div className="flex justify-between">
            <span>BPJS Kesehatan (4%)</span>
            <span>{formatRp(breakdown.employer.kesehatan)}</span>
          </div>
          <div className="flex justify-between">
            <span>BPJS JHT (3.7%)</span>
            <span>{formatRp(breakdown.employer.jht)}</span>
          </div>
          <div className="flex justify-between">
            <span>
              BPJS JP (2%)
              {breakdown.jpCapped && ' (cap Rp 9.559.600)'}
            </span>
            <span>{formatRp(breakdown.employer.jp)}</span>
          </div>
          <div className="flex justify-between">
            <span>BPJS JKK (0.24%)</span>
            <span>{formatRp(breakdown.employer.jkk)}</span>
          </div>
          <div className="flex justify-between">
            <span>BPJS JKM (0.3%)</span>
            <span>{formatRp(breakdown.employer.jkm)}</span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
            <span>Total Cost to Company</span>
            <span>{formatRp(breakdown.totalCostToCompany)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
