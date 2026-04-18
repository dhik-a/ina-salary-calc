import {
  PtkpStatus,
  AnnualBreakdown,
  PTKP_ANNUAL,
  BIAYA_JABATAN_RATE,
  BIAYA_JABATAN_ANNUAL_CAP,
  PASAL_17_BRACKETS,
  ProgressiveBracket,
} from './constants';
import { BpjsResult } from './bpjs';

export function applyProgressive(pkp: number, brackets: ProgressiveBracket[]): number {
  if (pkp <= 0) return 0;
  let tax = 0;
  let remaining = pkp;
  let lower = 0;
  for (const b of brackets) {
    const width = b.upTo - lower;
    const taxable = Math.min(remaining, width);
    tax += taxable * b.rate;
    remaining -= taxable;
    lower = b.upTo;
    if (remaining <= 0) break;
  }
  return Math.round(tax);
}

export function computeAnnual(
  grossMonthly: number,
  ptkpStatus: PtkpStatus,
  monthlyBpjs: BpjsResult,
  monthlyPph21: number
): AnnualBreakdown {
  const gross = grossMonthly * 12;
  const biayaJabatan = Math.min(Math.round(gross * BIAYA_JABATAN_RATE), BIAYA_JABATAN_ANNUAL_CAP);

  const employee = {
    kesehatan: monthlyBpjs.employee.kesehatan * 12,
    jht: monthlyBpjs.employee.jht * 12,
    jp: monthlyBpjs.employee.jp * 12,
  };
  const employer = {
    kesehatan: monthlyBpjs.employer.kesehatan * 12,
    jht: monthlyBpjs.employer.jht * 12,
    jp: monthlyBpjs.employer.jp * 12,
    jkk: monthlyBpjs.employer.jkk * 12,
    jkm: monthlyBpjs.employer.jkm * 12,
  };

  // Per PMK 168/2023 + Per-Dirjen PER-16/PJ/2016: deductible from gross for PPh 21
  // are biaya jabatan + employee JHT + employee JP.
  // BPJS Kesehatan employee contribution is NOT deducted (conservative DJP interpretation).
  const penghasilanNeto = gross - biayaJabatan - employee.jht - employee.jp;
  const ptkp = PTKP_ANNUAL[ptkpStatus];
  const pkpRaw = Math.max(0, penghasilanNeto - ptkp);
  const pkp = Math.floor(pkpRaw / 1000) * 1000; // round down to nearest 1,000

  const pph21Annual = applyProgressive(pkp, PASAL_17_BRACKETS);
  const pph21JanNov = monthlyPph21 * 11;
  const pph21December = pph21Annual - pph21JanNov; // may be negative (refund)

  const totalEmployeeDeduction = employee.kesehatan + employee.jht + employee.jp + pph21Annual;
  const net = gross - totalEmployeeDeduction;

  const totalEmployerContribution = employer.kesehatan + employer.jht + employer.jp + employer.jkk + employer.jkm;
  const totalCostToCompany = gross + totalEmployerContribution;

  return {
    gross,
    biayaJabatan,
    employee,
    employer,
    penghasilanNeto,
    ptkp,
    pkp,
    pph21Annual,
    pph21JanNov,
    pph21December,
    totalEmployeeDeduction,
    net,
    totalCostToCompany,
  };
}
