import { useState } from 'react';
import { PtkpStatus, Period, ThrType } from './calc/constants';
import { calculate } from './calc/calculate';
import { SalaryForm } from './components/SalaryForm';
import { BreakdownDisplay } from './components/Breakdown';
import { Footer } from './components/Footer';
import { LanguageProvider } from './i18n/LanguageContext';
import { LanguageToggle } from './components/LanguageToggle';
import { useLang } from './i18n/useLang';

function AppInner() {
  const [gross, setGross] = useState(0);
  const [ptkp, setPtkp] = useState<PtkpStatus>('TK/0');
  const [period, setPeriod] = useState<Period>('monthly');
  const [includeThr, setIncludeThr] = useState(false);
  const [thrType, setThrType] = useState<ThrType>('full');
  const [thrMonthsWorked, setThrMonthsWorked] = useState(11);
  const { t, lang, setLang } = useLang();

  const breakdown = calculate(gross, ptkp, {
    include: includeThr,
    type: thrType,
    monthsWorked: thrMonthsWorked,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{t('appTitle')}</h1>
              <p className="text-gray-600">{t('appSubtitle')}</p>
            </div>
            <LanguageToggle value={lang} onChange={setLang} />
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-6">
            {/* Form */}
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

            {/* Breakdown */}
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
        </div>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  );
}

export default App;
