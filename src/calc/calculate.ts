import { Breakdown, PtkpStatus } from './constants';
import { lookupTerRate } from './ter';
import { computeBpjs } from './bpjs';

export function calculate(grossMonthly: number, ptkpStatus: PtkpStatus): Breakdown {
  const bpjs = computeBpjs(grossMonthly);
  const terRate = lookupTerRate(grossMonthly, ptkpStatus);
  const pph21 = grossMonthly * terRate;

  const totalEmployeeDeduction =
    bpjs.employee.kesehatan + bpjs.employee.jht + bpjs.employee.jp + pph21;

  const net = grossMonthly - totalEmployeeDeduction;

  const totalEmployerContribution =
    bpjs.employer.kesehatan +
    bpjs.employer.jht +
    bpjs.employer.jp +
    bpjs.employer.jkk +
    bpjs.employer.jkm;

  const totalCostToCompany = grossMonthly + totalEmployerContribution;

  return {
    gross: grossMonthly,
    terRate,
    pph21,
    employee: bpjs.employee,
    employer: bpjs.employer,
    totalEmployeeDeduction,
    net,
    totalCostToCompany,
    jpCapped: bpjs.jpCapped,
    kesehatanCapped: bpjs.kesehatanCapped,
  };
}
