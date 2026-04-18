import {
  KESEHATAN_CAP,
  JP_CAP,
  BPJS_KESEHATAN_EMPLOYEE_RATE,
  BPJS_KESEHATAN_EMPLOYER_RATE,
  BPJS_JHT_EMPLOYEE_RATE,
  BPJS_JHT_EMPLOYER_RATE,
  BPJS_JP_EMPLOYEE_RATE,
  BPJS_JP_EMPLOYER_RATE,
  BPJS_JKK_EMPLOYER_RATE,
  BPJS_JKM_EMPLOYER_RATE,
} from './constants';

export interface BpjsResult {
  employee: { kesehatan: number; jht: number; jp: number };
  employer: { kesehatan: number; jht: number; jp: number; jkk: number; jkm: number };
  jpCapped: boolean;
  kesehatanCapped: boolean;
}

export function computeBpjs(grossMonthly: number): BpjsResult {
  // Apply caps
  const basisKesehatan = Math.min(grossMonthly, KESEHATAN_CAP);
  const basisJp = Math.min(grossMonthly, JP_CAP);

  // Employee contributions
  const employeeKesehatan = basisKesehatan * BPJS_KESEHATAN_EMPLOYEE_RATE;
  const employeeJht = grossMonthly * BPJS_JHT_EMPLOYEE_RATE;
  const employeeJp = basisJp * BPJS_JP_EMPLOYEE_RATE;

  // Employer contributions
  const employerKesehatan = basisKesehatan * BPJS_KESEHATAN_EMPLOYER_RATE;
  const employerJht = grossMonthly * BPJS_JHT_EMPLOYER_RATE;
  const employerJp = basisJp * BPJS_JP_EMPLOYER_RATE;
  const employerJkk = grossMonthly * BPJS_JKK_EMPLOYER_RATE;
  const employerJkm = grossMonthly * BPJS_JKM_EMPLOYER_RATE;

  return {
    employee: { kesehatan: employeeKesehatan, jht: employeeJht, jp: employeeJp },
    employer: { kesehatan: employerKesehatan, jht: employerJht, jp: employerJp, jkk: employerJkk, jkm: employerJkm },
    jpCapped: grossMonthly > JP_CAP,
    kesehatanCapped: grossMonthly > KESEHATAN_CAP,
  };
}
