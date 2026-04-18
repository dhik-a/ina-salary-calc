import { Breakdown, JP_CAP, Period } from '../calc/constants';
import { formatRupiah } from '../calc/format';

interface BreakdownProps {
  breakdown: Breakdown;
  period: Period;
}

export function BreakdownDisplay({ breakdown, period }: BreakdownProps) {
  const isAnnual = period === 'annually';
  const formatRp = (value: number) => formatRupiah(value);
  const terPercent = (breakdown.terRate * 100).toFixed(2);

  return (
    <div className="space-y-4">
      {/* Gross */}
      <div className="border-b pb-4">
        <div className="flex justify-between items-center font-semibold text-lg">
          <span>Gross Salary</span>
          <span>
            {isAnnual
              ? formatRp(breakdown.annual.gross)
              : formatRp(breakdown.gross)}
          </span>
        </div>
      </div>

      {/* Employee Deductions */}
      <div className="border-b pb-4">
        <div className="font-semibold text-gray-700 mb-3">Deductions (Employee)</div>
        <div className="space-y-2 text-sm pl-4">
          {isAnnual ? (
            <>
              <div className="flex justify-between">
                <span>PPh 21 Jan–Nov (TER {terPercent}%)</span>
                <span className="text-red-600">
                  −{formatRp(breakdown.annual.pph21JanNov)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>PPh 21 December (reconciliation)</span>
                <span
                  className={
                    breakdown.annual.pph21December < 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  {breakdown.annual.pph21December < 0 ? '+' : '−'}
                  {formatRp(Math.abs(breakdown.annual.pph21December))}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-gray-700">
                <span>PPh 21 Annual Total</span>
                <span className="text-red-600">
                  −{formatRp(breakdown.annual.pph21Annual)}
                </span>
              </div>
            </>
          ) : (
            <div className="flex justify-between">
              <span>PPh 21 (TER {terPercent}%)</span>
              <span className="text-red-600">−{formatRp(breakdown.pph21)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>BPJS Kesehatan (1%)</span>
            <span className="text-red-600">
              −{formatRp(
                isAnnual
                  ? breakdown.annual.employee.kesehatan
                  : breakdown.employee.kesehatan
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span>BPJS JHT (2%)</span>
            <span className="text-red-600">
              −{formatRp(
                isAnnual ? breakdown.annual.employee.jht : breakdown.employee.jht
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span>
              BPJS JP (1%)
              {isAnnual
                ? breakdown.annual.employee.jp > 1155600 && ` (capped)`
                : breakdown.jpCapped && ` (cap ${formatRupiah(JP_CAP)})`}
            </span>
            <span className="text-red-600">
              −{formatRp(
                isAnnual ? breakdown.annual.employee.jp : breakdown.employee.jp
              )}
            </span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
            <span>Total Deductions</span>
            <span className="text-red-600">
              −{formatRp(
                isAnnual
                  ? breakdown.annual.totalEmployeeDeduction
                  : breakdown.totalEmployeeDeduction
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Net Take-Home */}
      <div className="border-b pb-4 bg-green-50 p-4 rounded-lg">
        <div className="flex justify-between items-center font-bold text-lg text-green-700">
          <span>Net Take-Home</span>
          <span>{formatRp(isAnnual ? breakdown.annual.net : breakdown.net)}</span>
        </div>
      </div>

      {/* Employer Contributions */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="font-semibold text-gray-700 mb-3">Employer Contributions (Informational)</div>
        <div className="space-y-2 text-sm pl-4">
          <div className="flex justify-between">
            <span>BPJS Kesehatan (4%)</span>
            <span>
              {formatRp(
                isAnnual
                  ? breakdown.annual.employer.kesehatan
                  : breakdown.employer.kesehatan
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span>BPJS JHT (3.7%)</span>
            <span>
              {formatRp(
                isAnnual ? breakdown.annual.employer.jht : breakdown.employer.jht
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span>
              BPJS JP (2%)
              {isAnnual
                ? breakdown.annual.employer.jp > 1155600 && ` (capped)`
                : breakdown.jpCapped && ` (cap ${formatRupiah(JP_CAP)})`}
            </span>
            <span>
              {formatRp(
                isAnnual ? breakdown.annual.employer.jp : breakdown.employer.jp
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span>BPJS JKK (0.24%)</span>
            <span>
              {formatRp(
                isAnnual ? breakdown.annual.employer.jkk : breakdown.employer.jkk
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span>BPJS JKM (0.3%)</span>
            <span>
              {formatRp(
                isAnnual ? breakdown.annual.employer.jkm : breakdown.employer.jkm
              )}
            </span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
            <span>Total Cost to Company</span>
            <span>
              {formatRp(
                isAnnual
                  ? breakdown.annual.totalCostToCompany
                  : breakdown.totalCostToCompany
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
