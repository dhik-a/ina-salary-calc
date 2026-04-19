import { describe, it, expect } from 'vitest';
import { applyProgressive, computeAnnual } from './annual';
import { calculate } from './calculate';
import {
  PASAL_17_BRACKETS,
  PTKP_ANNUAL,
  PtkpStatus,
  BIAYA_JABATAN_ANNUAL_CAP,
} from './constants';
import { computeBpjs } from './bpjs';

const ALL_PTKP: PtkpStatus[] = ['TK/0', 'TK/1', 'TK/2', 'TK/3', 'K/0', 'K/1', 'K/2', 'K/3'];

describe('applyProgressive (Pasal 17)', () => {
  it('pkp = 0 → tax = 0', () => {
    expect(applyProgressive(0, PASAL_17_BRACKETS)).toBe(0);
  });

  it('pkp < 0 → tax = 0', () => {
    expect(applyProgressive(-1_000_000, PASAL_17_BRACKETS)).toBe(0);
  });

  it('pkp = 60M (top of 5% bracket) → 3M', () => {
    expect(applyProgressive(60_000_000, PASAL_17_BRACKETS)).toBe(3_000_000);
  });

  it('pkp = 250M (top of 15% bracket) → 31.5M', () => {
    expect(applyProgressive(250_000_000, PASAL_17_BRACKETS)).toBe(31_500_000);
  });

  it('pkp = 500M (top of 25% bracket) → 94M', () => {
    expect(applyProgressive(500_000_000, PASAL_17_BRACKETS)).toBe(94_000_000);
  });

  it('pkp = 5B (top of 30% bracket) → 1.444B', () => {
    expect(applyProgressive(5_000_000_000, PASAL_17_BRACKETS)).toBe(1_444_000_000);
  });

  it('pkp = 6B (35% top bracket) → 1.794B', () => {
    // 1.444B + 1B × 35% = 1.794B
    expect(applyProgressive(6_000_000_000, PASAL_17_BRACKETS)).toBe(1_794_000_000);
  });

  it('monotonic: higher PKP → higher tax', () => {
    const samples = [0, 30_000_000, 60_000_000, 150_000_000, 300_000_000, 600_000_000];
    let prev = -1;
    for (const pkp of samples) {
      const t = applyProgressive(pkp, PASAL_17_BRACKETS);
      expect(t).toBeGreaterThan(prev);
      prev = t;
    }
  });
});

describe('PTKP_ANNUAL (Pasal 7 UU PPh)', () => {
  it('covers all 8 PTKP statuses exactly once', () => {
    expect(Object.keys(PTKP_ANNUAL).sort()).toEqual([...ALL_PTKP].sort());
  });

  it.each([
    ['TK/0', 54_000_000],
    ['TK/1', 58_500_000],
    ['TK/2', 63_000_000],
    ['TK/3', 67_500_000],
    ['K/0', 58_500_000],
    ['K/1', 63_000_000],
    ['K/2', 67_500_000],
    ['K/3', 72_000_000],
  ] as const)('%s → Rp %d', (ptkp, expected) => {
    expect(PTKP_ANNUAL[ptkp as PtkpStatus]).toBe(expected);
  });
});

describe('computeAnnual', () => {
  const annualFor = (gross: number, ptkp: PtkpStatus) => {
    const bpjs = computeBpjs(gross);
    const terRate = calculate(gross, ptkp).terRate;
    const pph21 = Math.round(gross * terRate);
    return computeAnnual(gross, ptkp, bpjs, pph21);
  };

  describe('biaya jabatan cap', () => {
    it('gross 10M/mo → biaya jabatan = 6M (5% × 120M, exactly at cap)', () => {
      const a = annualFor(10_000_000, 'TK/0');
      expect(a.biayaJabatan).toBe(BIAYA_JABATAN_ANNUAL_CAP);
    });

    it('gross 20M/mo → biaya jabatan capped at 6M', () => {
      const a = annualFor(20_000_000, 'TK/0');
      expect(a.biayaJabatan).toBe(BIAYA_JABATAN_ANNUAL_CAP);
    });

    it('gross 5M/mo → biaya jabatan = 3M (5% × 60M, below cap)', () => {
      const a = annualFor(5_000_000, 'TK/0');
      expect(a.biayaJabatan).toBe(3_000_000);
    });
  });

  describe('PKP rounding (floor to nearest 1,000)', () => {
    it('PKP is always a multiple of 1,000', () => {
      for (const gross of [5_000_000, 7_333_333, 10_000_001, 15_555_555, 25_123_456]) {
        for (const ptkp of ALL_PTKP) {
          const a = annualFor(gross, ptkp);
          expect(a.pkp % 1000).toBe(0);
        }
      }
    });

    it('PKP is never negative', () => {
      for (const ptkp of ALL_PTKP) {
        const a = annualFor(1_000_000, ptkp);
        expect(a.pkp).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('low gross (negative raw PKP)', () => {
    it('gross 4M TK/0 → pkp = 0, pph21Annual = 0, pph21December = 0', () => {
      // TER at 4M for TK/0 is 0%, so monthly PPh21 = 0 and JanNov = 0
      const a = annualFor(4_000_000, 'TK/0');
      expect(a.pkp).toBe(0);
      expect(a.pph21Annual).toBe(0);
      expect(a.pph21JanNov).toBe(0);
      expect(a.pph21December).toBe(0);
    });
  });

  describe('December reconciliation — 10M/mo TK/0', () => {
    const a = annualFor(10_000_000, 'TK/0');

    it('gross annual = 120M', () => {
      expect(a.gross).toBe(120_000_000);
    });

    it('biaya jabatan = 6M (capped)', () => {
      expect(a.biayaJabatan).toBe(6_000_000);
    });

    it('ptkp = 54M (TK/0)', () => {
      expect(a.ptkp).toBe(54_000_000);
    });

    it('pph21JanNov = monthly TER × 11', () => {
      // TER at 10M for TK/0 is 2% → 200k/mo × 11 = 2.2M
      expect(a.pph21JanNov).toBe(2_200_000);
    });

    it('pph21December is positive (TER under-withholds at this level)', () => {
      expect(a.pph21December).toBeGreaterThan(0);
    });

    it('pph21Annual = pph21JanNov + pph21December', () => {
      expect(a.pph21Annual).toBe(a.pph21JanNov + a.pph21December);
    });

    it('net = gross − total employee deductions', () => {
      expect(a.net).toBe(a.gross - a.totalEmployeeDeduction);
    });
  });

  describe('integer invariants', () => {
    const cases: Array<[number, PtkpStatus]> = [
      [10_000_000, 'TK/0'],
      [15_000_000, 'K/2'],
      [50_000_000, 'K/3'],
      [7_500_000, 'TK/1'],
    ];

    for (const [gross, ptkp] of cases) {
      it(`gross ${gross}, ${ptkp}: all annual monetary values are integers`, () => {
        const a = annualFor(gross, ptkp);
        const values = [
          a.gross,
          a.thr,
          a.grossIncludingThr,
          a.biayaJabatan,
          a.employee.kesehatan,
          a.employee.jht,
          a.employee.jp,
          a.employer.kesehatan,
          a.employer.jht,
          a.employer.jp,
          a.employer.jkk,
          a.employer.jkm,
          a.penghasilanNeto,
          a.ptkp,
          a.pkp,
          a.pph21Annual,
          a.pph21JanNov,
          a.pph21December,
          a.totalEmployeeDeduction,
          a.net,
          a.totalCostToCompany,
        ];
        for (const v of values) {
          expect(Number.isInteger(v)).toBe(true);
        }
      });
    }
  });

  describe('cost to company consistency', () => {
    it('annual cost to company = annual gross + sum(annual employer)', () => {
      const a = annualFor(15_000_000, 'K/1');
      const sumEmployer =
        a.employer.kesehatan +
        a.employer.jht +
        a.employer.jp +
        a.employer.jkk +
        a.employer.jkm;
      expect(a.totalCostToCompany).toBe(a.gross + sumEmployer);
    });
  });
});

describe('THR (Tunjangan Hari Raya)', () => {
  describe('THR disabled (regression)', () => {
    it('compute annual with include=false gives same result as default', () => {
      const r1 = calculate(10_000_000, 'TK/0');
      const r2 = calculate(10_000_000, 'TK/0', { include: false, type: 'full', monthsWorked: 12 });
      expect(r2.annual.thr).toBe(0);
      expect(r2.annual.pph21Annual).toBe(r1.annual.pph21Annual);
    });
  });

  describe('THR full', () => {
    it('gross 10M TK/0, THR full → thr = 10M, grossIncludingThr = 130M', () => {
      const r = calculate(10_000_000, 'TK/0', { include: true, type: 'full', monthsWorked: 12 });
      expect(r.annual.thr).toBe(10_000_000);
      expect(r.annual.grossIncludingThr).toBe(130_000_000);
    });

    it('THR full increases pph21Annual', () => {
      const rWithout = calculate(10_000_000, 'TK/0', { include: false, type: 'full', monthsWorked: 12 });
      const rWith = calculate(10_000_000, 'TK/0', { include: true, type: 'full', monthsWorked: 12 });
      expect(rWith.annual.pph21Annual).toBeGreaterThan(rWithout.annual.pph21Annual);
    });

    it('pph21JanNov unchanged with THR full', () => {
      const rWithout = calculate(10_000_000, 'TK/0', { include: false, type: 'full', monthsWorked: 12 });
      const rWith = calculate(10_000_000, 'TK/0', { include: true, type: 'full', monthsWorked: 12 });
      expect(rWith.annual.pph21JanNov).toBe(rWithout.annual.pph21JanNov);
    });

    it('cost to company grows by THR amount', () => {
      const rWithout = calculate(10_000_000, 'TK/0', { include: false, type: 'full', monthsWorked: 12 });
      const rWith = calculate(10_000_000, 'TK/0', { include: true, type: 'full', monthsWorked: 12 });
      expect(rWith.annual.totalCostToCompany).toBe(rWithout.annual.totalCostToCompany + 10_000_000);
    });
  });

  describe('THR pro-rated', () => {
    it('months=6 → thr ≈ halfSalary', () => {
      const r = calculate(10_000_000, 'TK/0', { include: true, type: 'prorated', monthsWorked: 6 });
      expect(r.annual.thr).toBe(5_000_000);
    });

    it('months=1 → thr ≈ 1/12 salary', () => {
      const r = calculate(10_000_000, 'TK/0', { include: true, type: 'prorated', monthsWorked: 1 });
      const expected = Math.round(10_000_000 / 12);
      expect(r.annual.thr).toBe(expected);
    });

    it('months=11 → thr ≈ 11/12 salary', () => {
      const r = calculate(10_000_000, 'TK/0', { include: true, type: 'prorated', monthsWorked: 11 });
      const expected = Math.round(10_000_000 * (11 / 12));
      expect(r.annual.thr).toBe(expected);
    });

    it('pro-rated monotonicity: more months = higher THR', () => {
      const r1 = calculate(10_000_000, 'TK/0', { include: true, type: 'prorated', monthsWorked: 1 });
      const r6 = calculate(10_000_000, 'TK/0', { include: true, type: 'prorated', monthsWorked: 6 });
      const r11 = calculate(10_000_000, 'TK/0', { include: true, type: 'prorated', monthsWorked: 11 });
      expect(r1.annual.thr).toBeLessThan(r6.annual.thr);
      expect(r6.annual.thr).toBeLessThan(r11.annual.thr);
    });
  });

  describe('BPJS unchanged with THR', () => {
    it('employee BPJS same with/without THR', () => {
      const rWithout = calculate(10_000_000, 'TK/0', { include: false, type: 'full', monthsWorked: 12 });
      const rWith = calculate(10_000_000, 'TK/0', { include: true, type: 'full', monthsWorked: 12 });
      expect(rWith.annual.employee.kesehatan).toBe(rWithout.annual.employee.kesehatan);
      expect(rWith.annual.employee.jht).toBe(rWithout.annual.employee.jht);
      expect(rWith.annual.employee.jp).toBe(rWithout.annual.employee.jp);
    });

    it('employer BPJS same with/without THR', () => {
      const rWithout = calculate(10_000_000, 'TK/0', { include: false, type: 'full', monthsWorked: 12 });
      const rWith = calculate(10_000_000, 'TK/0', { include: true, type: 'full', monthsWorked: 12 });
      expect(rWith.annual.employer.kesehatan).toBe(rWithout.annual.employer.kesehatan);
      expect(rWith.annual.employer.jht).toBe(rWithout.annual.employer.jht);
      expect(rWith.annual.employer.jp).toBe(rWithout.annual.employer.jp);
    });
  });
});

describe('calculate — annual field wired in', () => {
  it('exposes annual breakdown', () => {
    const r = calculate(10_000_000, 'TK/0');
    expect(r.annual).toBeDefined();
    expect(r.annual.gross).toBe(120_000_000);
  });

  it('annual BPJS = monthly × 12', () => {
    const r = calculate(10_000_000, 'TK/0');
    expect(r.annual.employee.kesehatan).toBe(r.employee.kesehatan * 12);
    expect(r.annual.employee.jht).toBe(r.employee.jht * 12);
    expect(r.annual.employee.jp).toBe(r.employee.jp * 12);
  });
});
