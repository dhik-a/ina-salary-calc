import { Breakdown, JP_CAP, Period } from '../calc/constants';
import { formatRupiah } from '../calc/format';
import { useLang } from '../i18n/useLang';

interface BreakdownProps {
  breakdown: Breakdown;
  period: Period;
}

export function BreakdownDisplay({ breakdown, period }: BreakdownProps) {
  const { t } = useLang();
  const isAnnual = period === 'annually';
  const formatRp = (value: number) => formatRupiah(value);
  const terPercent = (breakdown.terRate * 100).toFixed(2);

  return (
    <div className="space-y-4">
      {/* Gross */}
      <div className="border-b pb-4">
        {isAnnual && breakdown.annual.thr > 0 ? (
          <>
            <div className="flex justify-between items-center font-semibold text-base mb-2">
              <span>{t('grossSalaryAnnual')}</span>
              <span>{formatRp(breakdown.annual.gross)}</span>
            </div>
            <div className="flex justify-between items-center font-semibold text-base mb-2">
              <span>{t('thr')}</span>
              <span>{formatRp(breakdown.annual.thr)}</span>
            </div>
            <div className="flex justify-between items-center font-semibold text-lg border-t pt-2">
              <span>{t('totalAnnualGross')}</span>
              <span>{formatRp(breakdown.annual.grossIncludingThr)}</span>
            </div>
          </>
        ) : (
          <div className="flex justify-between items-center font-semibold text-lg">
            <span>{t('grossSalary')}</span>
            <span>
              {isAnnual
                ? formatRp(breakdown.annual.gross)
                : formatRp(breakdown.gross)}
            </span>
          </div>
        )}
      </div>

      {/* Employee Deductions */}
      <div className="border-b pb-4">
        <div className="font-semibold text-gray-700 mb-3">{t('deductionsHeading')}</div>
        <div className="space-y-2 text-sm pl-4">
          {isAnnual ? (
            <>
              <div className="flex justify-between">
                <span>{t('pph21JanNov', { rate: terPercent })}</span>
                <span className="text-red-600">
                  −{formatRp(breakdown.annual.pph21JanNov)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('pph21December')}</span>
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
              {breakdown.annual.thr > 0 && (
                <div className="flex justify-between">
                  <span>{t('pph21Thr')}</span>
                  <span className="text-red-600">
                    −{formatRp(breakdown.annual.pph21Thr)}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-gray-700">
                <span>{t('pph21AnnualTotal')}</span>
                <span className="text-red-600">
                  −{formatRp(breakdown.annual.pph21Annual)}
                </span>
              </div>
            </>
          ) : (
            <div className="flex justify-between">
              <span>{t('pph21Monthly', { rate: terPercent })}</span>
              <span className="text-red-600">−{formatRp(breakdown.pph21)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>{t('bpjsKesehatan1')}</span>
            <span className="text-red-600">
              −{formatRp(
                isAnnual
                  ? breakdown.annual.employee.kesehatan
                  : breakdown.employee.kesehatan
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t('bpjsJht2')}</span>
            <span className="text-red-600">
              −{formatRp(
                isAnnual ? breakdown.annual.employee.jht : breakdown.employee.jht
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span>
              {t('bpjsJp1')}
              {breakdown.jpCapped && t('jpCap', { cap: formatRupiah(JP_CAP) })}
            </span>
            <span className="text-red-600">
              −{formatRp(
                isAnnual ? breakdown.annual.employee.jp : breakdown.employee.jp
              )}
            </span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
            <span>{t('totalDeductions')}</span>
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
          <span>{t('netTakeHome')}</span>
          <span>{formatRp(isAnnual ? breakdown.annual.net : breakdown.net)}</span>
        </div>
      </div>

      {/* Employer Contributions */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="font-semibold text-gray-700 mb-3">{t('employerHeading')}</div>
        <div className="space-y-2 text-sm pl-4">
          <div className="flex justify-between">
            <span>{t('bpjsKesehatan4')}</span>
            <span>
              {formatRp(
                isAnnual
                  ? breakdown.annual.employer.kesehatan
                  : breakdown.employer.kesehatan
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t('bpjsJht37')}</span>
            <span>
              {formatRp(
                isAnnual ? breakdown.annual.employer.jht : breakdown.employer.jht
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span>
              {t('bpjsJp2')}
              {breakdown.jpCapped && t('jpCap', { cap: formatRupiah(JP_CAP) })}
            </span>
            <span>
              {formatRp(
                isAnnual ? breakdown.annual.employer.jp : breakdown.employer.jp
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t('bpjsJkk')}</span>
            <span>
              {formatRp(
                isAnnual ? breakdown.annual.employer.jkk : breakdown.employer.jkk
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t('bpjsJkm')}</span>
            <span>
              {formatRp(
                isAnnual ? breakdown.annual.employer.jkm : breakdown.employer.jkm
              )}
            </span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
            <span>{t('totalCostToCompany')}</span>
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
