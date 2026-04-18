import { useState, useMemo } from 'react';
import { PtkpStatus, Period } from './calc/constants';
import { calculate } from './calc/calculate';
import { SalaryForm } from './components/SalaryForm';
import { Breakdown } from './components/Breakdown';

function App() {
  const [gross, setGross] = useState(0);
  const [ptkp, setPtkp] = useState<PtkpStatus>('TK/0');
  const [period, setPeriod] = useState<Period>('monthly');

  const breakdown = useMemo(() => calculate(gross, ptkp), [gross, ptkp]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Salary Calculator</h1>
          <p className="text-gray-600 mb-6">Indonesian net salary calculator</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Form */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Input</h2>
              <SalaryForm
                gross={gross}
                onGrossChange={setGross}
                ptkp={ptkp}
                onPtkpChange={setPtkp}
                period={period}
                onPeriodChange={setPeriod}
              />
            </div>

            {/* Breakdown */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Breakdown</h2>
              {gross === 0 ? (
                <div className="bg-gray-100 p-6 rounded-lg text-center text-gray-500">
                  Enter a gross salary to see the breakdown
                </div>
              ) : (
                <Breakdown breakdown={breakdown} period={period} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
