import { describe, it, expect } from 'vitest';
import { calculate } from './calculate';
import { lookupTerRate } from './ter';
import { PTKP_TO_TER, PtkpStatus, TerCategory } from './constants';

const ALL_PTKP: PtkpStatus[] = ['TK/0', 'TK/1', 'TK/2', 'TK/3', 'K/0', 'K/1', 'K/2', 'K/3'];

// Per PMK 168/2023:
// Category A: TK/0 (54M), TK/1 (58.5M), K/0 (58.5M)
// Category B: TK/2 (63M), K/1 (63M), TK/3 (67.5M), K/2 (67.5M)
// Category C: K/3 (72M)
const CAT_A: PtkpStatus[] = ['TK/0', 'TK/1', 'K/0'];
const CAT_B: PtkpStatus[] = ['TK/2', 'K/1', 'TK/3', 'K/2'];

describe('calc', () => {
  describe('calculate', () => {
    it('gross = 0 → all zeros', () => {
      const result = calculate(0, 'TK/0');
      expect(result.gross).toBe(0);
      expect(result.pph21).toBe(0);
      expect(result.net).toBe(0);
      expect(result.totalEmployeeDeduction).toBe(0);
      expect(result.terRate).toBe(0);
    });

    it('gross = 5,000,000 (below TER threshold) → pph21 = 0', () => {
      const result = calculate(5_000_000, 'TK/0');
      expect(result.pph21).toBe(0);
      expect(result.terRate).toBe(0);
    });

    it('gross = 10,000,000 TK/0 → asserts TER bracket rate', () => {
      const result = calculate(10_000_000, 'TK/0');
      expect(result.terRate).toBe(0.02);
      expect(result.pph21).toBe(200_000);
    });

    it('net = gross - totalEmployeeDeduction', () => {
      const gross = 10_000_000;
      const result = calculate(gross, 'TK/0');
      expect(result.net).toBe(gross - result.totalEmployeeDeduction);
    });

    it('cost to company = gross + sum(employer contributions)', () => {
      const result = calculate(10_000_000, 'TK/0');
      const sumEmployer =
        result.employer.kesehatan +
        result.employer.jht +
        result.employer.jp +
        result.employer.jkk +
        result.employer.jkm;
      expect(result.totalCostToCompany).toBe(result.gross + sumEmployer);
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // PMK 168/2023 — PTKP to Category mapping
  // ═══════════════════════════════════════════════════════════════════
  describe('PMK 168/2023 PTKP → Category mapping', () => {
    it.each([
      ['TK/0', 'A'],
      ['TK/1', 'A'],
      ['K/0', 'A'],
      ['TK/2', 'B'],
      ['K/1', 'B'],
      ['TK/3', 'B'],
      ['K/2', 'B'],
      ['K/3', 'C'],
    ] as const)('%s → Category %s', (ptkp, expectedCat) => {
      expect(PTKP_TO_TER[ptkp as PtkpStatus]).toBe(expectedCat as TerCategory);
    });

    it('mapping covers all 8 PTKP statuses exactly once', () => {
      expect(Object.keys(PTKP_TO_TER).sort()).toEqual([...ALL_PTKP].sort());
    });

    it('every status maps to A, B, or C', () => {
      for (const ptkp of ALL_PTKP) {
        expect(['A', 'B', 'C']).toContain(PTKP_TO_TER[ptkp]);
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // Within-category equality (lawful: same TER rate by design)
  // ═══════════════════════════════════════════════════════════════════
  describe('within-category equality per PMK 168/2023', () => {
    // Test at a range of gross levels to cover all bracket transitions
    const grossLevels = [5_000_000, 7_000_000, 10_000_000, 15_000_000, 25_000_000, 50_000_000, 100_000_000];

    for (const gross of grossLevels) {
      describe(`at gross = Rp ${gross.toLocaleString('id-ID')}`, () => {
        it('all Category A statuses (TK/0, TK/1, K/0) produce identical TER rate', () => {
          const rates = CAT_A.map((p) => calculate(gross, p).terRate);
          const [first, ...rest] = rates;
          for (const r of rest) expect(r).toBe(first);
        });

        it('all Category A statuses produce identical net salary', () => {
          const nets = CAT_A.map((p) => calculate(gross, p).net);
          const [first, ...rest] = nets;
          for (const n of rest) expect(n).toBe(first);
        });

        it('all Category B statuses (TK/2, K/1, TK/3, K/2) produce identical TER rate', () => {
          const rates = CAT_B.map((p) => calculate(gross, p).terRate);
          const [first, ...rest] = rates;
          for (const r of rest) expect(r).toBe(first);
        });

        it('all Category B statuses produce identical net salary', () => {
          const nets = CAT_B.map((p) => calculate(gross, p).net);
          const [first, ...rest] = nets;
          for (const n of rest) expect(n).toBe(first);
        });
      });
    }
  });

  // ═══════════════════════════════════════════════════════════════════
  // Cross-category inequality at gross levels above all zero-brackets
  // ═══════════════════════════════════════════════════════════════════
  describe('cross-category inequality above all 0% thresholds', () => {
    // At gross > 6.6M, Cat A/B/C all exit the 0% bracket → rates MUST differ.
    const grossLevels = [7_000_000, 10_000_000, 15_000_000, 25_000_000, 50_000_000, 100_000_000];

    for (const gross of grossLevels) {
      describe(`at gross = Rp ${gross.toLocaleString('id-ID')}`, () => {
        it('Category A (TK/0) ≠ Category B (TK/2)', () => {
          expect(calculate(gross, 'TK/0').terRate).not.toBe(calculate(gross, 'TK/2').terRate);
        });

        it('Category B (TK/2) ≠ Category C (K/3)', () => {
          expect(calculate(gross, 'TK/2').terRate).not.toBe(calculate(gross, 'K/3').terRate);
        });

        it('Category A (TK/0) ≠ Category C (K/3)', () => {
          expect(calculate(gross, 'TK/0').terRate).not.toBe(calculate(gross, 'K/3').terRate);
        });

        it('monotonic tax: A > B > C (higher PTKP = lower tax)', () => {
          const a = calculate(gross, 'TK/0').pph21;
          const b = calculate(gross, 'TK/2').pph21;
          const c = calculate(gross, 'K/3').pph21;
          expect(a).toBeGreaterThan(b);
          expect(b).toBeGreaterThan(c);
        });
      });
    }
  });

  // ═══════════════════════════════════════════════════════════════════
  // Specific user-reported scenarios
  // ═══════════════════════════════════════════════════════════════════
  describe('user-reported pairs', () => {
    it('TK/0 = K/0 (both Cat A) — INTENDED per PMK 168/2023, not a bug', () => {
      // User observation: both give same result. This is correct by law.
      const gross = 10_000_000;
      expect(calculate(gross, 'TK/0').net).toBe(calculate(gross, 'K/0').net);
    });

    it('K/2 ≠ K/3 at gross > 6.6M (K/2 is Cat B, K/3 is Cat C)', () => {
      // User observation: should NOT be identical above the zero-brackets.
      const gross = 10_000_000;
      expect(calculate(gross, 'K/2').terRate).not.toBe(calculate(gross, 'K/3').terRate);
      expect(calculate(gross, 'K/2').pph21).toBeGreaterThan(calculate(gross, 'K/3').pph21);
    });

    it('K/2 = K/3 only below 6.2M (both in their 0% bracket — unavoidable overlap)', () => {
      const gross = 5_000_000;
      expect(calculate(gross, 'K/2').terRate).toBe(0);
      expect(calculate(gross, 'K/3').terRate).toBe(0);
    });

    it('K/0 ≠ K/1 (K/0 is Cat A, K/1 is Cat B)', () => {
      const gross = 10_000_000;
      expect(calculate(gross, 'K/0').terRate).not.toBe(calculate(gross, 'K/1').terRate);
      expect(calculate(gross, 'K/0').pph21).toBeGreaterThan(calculate(gross, 'K/1').pph21);
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // TER rate lookups (single-status spot checks)
  // ═══════════════════════════════════════════════════════════════════
  describe('lookupTerRate spot checks', () => {
    it('TK/0 @ 4M = 0%', () => expect(lookupTerRate(4_000_000, 'TK/0')).toBe(0));
    it('TK/0 @ 5.5M = 0.25%', () => expect(lookupTerRate(5_500_000, 'TK/0')).toBe(0.0025));
    it('TK/0 @ 10M = 2%', () => expect(lookupTerRate(10_000_000, 'TK/0')).toBe(0.02));
    it('TK/2 @ 10M < TK/0 @ 10M', () => {
      expect(lookupTerRate(10_000_000, 'TK/2')).toBeLessThan(lookupTerRate(10_000_000, 'TK/0'));
    });
    it('K/3 @ 10M < TK/2 @ 10M', () => {
      expect(lookupTerRate(10_000_000, 'K/3')).toBeLessThan(lookupTerRate(10_000_000, 'TK/2'));
    });
    it('top bracket hits 30% for extreme income', () => {
      expect(lookupTerRate(500_000_000, 'TK/0')).toBe(0.3);
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // Integer-rounded monetary values
  // ═══════════════════════════════════════════════════════════════════
  describe('all monetary values are integers', () => {
    const testCases: Array<[number, PtkpStatus]> = [
      [15_000_000, 'TK/0'],
      [7_500_000, 'K/3'],
      [13_333_333, 'K/1'],
      [9_559_600, 'TK/2'],
    ];

    for (const [gross, ptkp] of testCases) {
      it(`gross = Rp ${gross.toLocaleString('id-ID')}, ${ptkp}`, () => {
        const r = calculate(gross, ptkp);
        const values = [
          r.pph21,
          r.employee.kesehatan,
          r.employee.jht,
          r.employee.jp,
          r.employer.kesehatan,
          r.employer.jht,
          r.employer.jp,
          r.employer.jkk,
          r.employer.jkm,
          r.totalEmployeeDeduction,
          r.net,
          r.totalCostToCompany,
        ];
        for (const v of values) {
          expect(Number.isInteger(v)).toBe(true);
        }
      });
    }
  });

  // ═══════════════════════════════════════════════════════════════════
  // BPJS caps
  // ═══════════════════════════════════════════════════════════════════
  describe('BPJS caps', () => {
    it('JP cap: gross = 9,559,600 → jpCapped = false, jp = 95,596', () => {
      const r = calculate(9_559_600, 'TK/0');
      expect(r.jpCapped).toBe(false);
      expect(r.employee.jp).toBe(95_596);
    });

    it('JP cap: gross = 15,000,000 → jpCapped = true, jp = 95,596', () => {
      const r = calculate(15_000_000, 'TK/0');
      expect(r.jpCapped).toBe(true);
      expect(r.employee.jp).toBe(95_596);
    });

    it('JP below cap: gross = 9,000,000 → jp = 90,000', () => {
      const r = calculate(9_000_000, 'TK/0');
      expect(r.employee.jp).toBe(90_000);
    });

    it('KESEHATAN cap: gross = 12,000,000 → kesehatanCapped = false, kesehatan = 120,000', () => {
      const r = calculate(12_000_000, 'TK/0');
      expect(r.kesehatanCapped).toBe(false);
      expect(r.employee.kesehatan).toBe(120_000);
    });

    it('KESEHATAN cap: gross = 20,000,000 → kesehatanCapped = true, kesehatan = 120,000', () => {
      const r = calculate(20_000_000, 'TK/0');
      expect(r.kesehatanCapped).toBe(true);
      expect(r.employee.kesehatan).toBe(120_000);
    });

    it('KESEHATAN below cap: gross = 11,000,000 → kesehatan = 110,000', () => {
      const r = calculate(11_000_000, 'TK/0');
      expect(r.employee.kesehatan).toBe(110_000);
    });
  });
});
