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

  // Employee contributions — rounded to integer rupiah
  const employeeKesehatan = Math.round(basisKesehatan * BPJS_KESEHATAN_EMPLOYEE_RATE);
  const employeeJht = Math.round(grossMonthly * BPJS_JHT_EMPLOYEE_RATE);
  const employeeJp = Math.round(basisJp * BPJS_JP_EMPLOYEE_RATE);

  // Employer contributions — rounded to integer rupiah
  const employerKesehatan = Math.round(basisKesehatan * BPJS_KESEHATAN_EMPLOYER_RATE);
  const employerJht = Math.round(grossMonthly * BPJS_JHT_EMPLOYER_RATE);
  const employerJp = Math.round(basisJp * BPJS_JP_EMPLOYER_RATE);
  const employerJkk = Math.round(grossMonthly * BPJS_JKK_EMPLOYER_RATE);
  const employerJkm = Math.round(grossMonthly * BPJS_JKM_EMPLOYER_RATE);

  return {
    employee: { kesehatan: employeeKesehatan, jht: employeeJht, jp: employeeJp },
    employer: { kesehatan: employerKesehatan, jht: employerJht, jp: employerJp, jkk: employerJkk, jkm: employerJkm },
    jpCapped: grossMonthly > JP_CAP,
    kesehatanCapped: grossMonthly > KESEHATAN_CAP,
  };
}
