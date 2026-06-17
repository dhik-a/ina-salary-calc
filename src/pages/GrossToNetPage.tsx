import { useState } from 'react';
import { PtkpStatus, Period, ThrType } from '../calc/constants';
import { calculate } from '../calc/calculate';
import { SalaryForm } from '../components/SalaryForm';
import { BreakdownDisplay } from '../components/Breakdown';
import { useLang } from '../i18n/useLang';

export function GrossToNetPage() {
  const [gross, setGross] = useState(0);
  const [ptkp, setPtkp] = useState<PtkpStatus>('TK/0');
  const [period, setPeriod] = useState<Period>('monthly');
  const [includeThr, setIncludeThr] = useState(false);
  const [thrType, setThrType] = useState<ThrType>('full');
  const [thrMonthsWorked, setThrMonthsWorked] = useState(11);
  const { t } = useLang();

  const breakdown = calculate(gross, ptkp, {
    include: includeThr,
    type: thrType,
    monthsWorked: thrMonthsWorked,
  });

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">{t('inputHeading')}</h2>
        <SalaryForm
          gross={gross}
          onGrossChange={setGross}
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
        {gross === 0 ? (
          <div className="bg-gray-100 p-6 rounded-lg text-center text-gray-500">
            {t('emptyState')}
          </div>
        ) : (
          <BreakdownDisplay breakdown={breakdown} period={period} />
        )}
      </div>
    </div>
  );
}
