import { useState } from 'react';
import { PtkpStatus, Period, ThrType } from './calc/constants';
import { calculate } from './calc/calculate';
import { SalaryForm } from './components/SalaryForm';
import { BreakdownDisplay } from './components/Breakdown';
import { Footer } from './components/Footer';

function App() {
  const [gross, setGross] = useState(0);
  const [ptkp, setPtkp] = useState<PtkpStatus>('TK/0');
  const [period, setPeriod] = useState<Period>('monthly');
  const [includeThr, setIncludeThr] = useState(false);
  const [thrType, setThrType] = useState<ThrType>('full');
  const [thrMonthsWorked, setThrMonthsWorked] = useState(11);

  const breakdown = calculate(gross, ptkp, {
    include: includeThr,
    type: thrType,
    monthsWorked: thrMonthsWorked,
  });

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
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Breakdown</h2>
              {gross === 0 ? (
                <div className="bg-gray-100 p-6 rounded-lg text-center text-gray-500">
                  Enter a gross salary to see the breakdown
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

export default App;
