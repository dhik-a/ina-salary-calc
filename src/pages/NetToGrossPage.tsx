import { useState, useMemo } from 'react';
import { PtkpStatus, Period, ThrType } from '../calc/constants';
import { calculate } from '../calc/calculate';
import { formatRupiah } from '../calc/format';
import {
  solveGrossFromNet,
  UnreachableNetError,
  FlatZonePolicy,
  SolveResult,
} from '../calc/solve';
import { NetSalaryForm } from '../components/NetSalaryForm';
import { BreakdownDisplay } from '../components/Breakdown';
import { FlatZoneAlert } from '../components/FlatZoneAlert';
import { useLang } from '../i18n/useLang';

type SolveOutcome =
  | { kind: 'empty' }
  | { kind: 'error' }
  | { kind: 'ok'; result: SolveResult };

export function NetToGrossPage() {
  const [net, setNet] = useState(0);
  const [ptkp, setPtkp] = useState<PtkpStatus>('TK/0');
  const [period, setPeriod] = useState<Period>('monthly');
  const [includeThr, setIncludeThr] = useState(false);
  const [thrType, setThrType] = useState<ThrType>('full');
  const [thrMonthsWorked, setThrMonthsWorked] = useState(11);
  const [flatZonePolicy, setFlatZonePolicy] = useState<FlatZonePolicy>('smallest');
  const { t } = useLang();

  const thrOpts = { include: includeThr, type: thrType, monthsWorked: thrMonthsWorked };

  const outcome = useMemo<SolveOutcome>(() => {
    if (net === 0) return { kind: 'empty' };
    try {
      const result = solveGrossFromNet(net, ptkp, period, thrOpts, flatZonePolicy);
      return { kind: 'ok', result };
    } catch (e) {
      if (e instanceof UnreachableNetError) return { kind: 'error' };
      throw e;
    }
  }, [net, ptkp, period, includeThr, thrType, thrMonthsWorked, flatZonePolicy]);

  return (
    <div>
      <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-lg p-3 mb-6 text-sm">
        {t('grossAccuracyDisclaimer')}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">{t('inputHeading')}</h2>
          <NetSalaryForm
            net={net}
            onNetChange={setNet}
            ptkp={ptkp}
            onPtkpChange={setPtkp}
            period={period}
            onPeriodChange={setPeriod}
            includeThr={includeThr}
            onIncludeThrChange={setIncludeThr}
            thrType={thrType}
            onThrTypeChange={setThrType}
            thrMonthsWorked={thrMonthsWorked}
            onThrMonthsWorkedChange={setThrMonthsWorked}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">{t('breakdownHeading')}</h2>
          {outcome.kind === 'empty' && (
            <div className="bg-gray-100 p-6 rounded-lg text-center text-gray-500">
              {t('emptyStateNet')}
            </div>
          )}
          {outcome.kind === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
              {t('unreachableNetError')}
            </div>
          )}
          {outcome.kind === 'ok' && (() => {
            const breakdown = calculate(outcome.result.gross, ptkp, thrOpts);
            return (
              <>
                {/* Hero: computed gross */}
                <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg mb-4">
                  <div className="text-sm text-indigo-700 font-medium mb-1">
                    {t('computedGrossLabel')}
                  </div>
                  <div className="text-2xl font-bold text-indigo-800">
                    {formatRupiah(outcome.result.gross)}
                  </div>
                  {period === 'monthly' && (
                    <div className="text-xs text-indigo-600 mt-1">
                      / {t('monthly').toLowerCase()}
                    </div>
                  )}
                </div>

                {outcome.result.flatZone.min < outcome.result.flatZone.max && (
                  <FlatZoneAlert policy={flatZonePolicy} onChange={setFlatZonePolicy} />
                )}

                <BreakdownDisplay breakdown={breakdown} period={period} />
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
