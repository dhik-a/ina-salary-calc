import { describe, it, expect } from 'vitest';
import { calculate } from './calculate';
import { lookupTerRate } from './ter';

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
      // 10,000,000 falls in bracket (9,650,001 - 10,050,000] → 2%
      expect(result.terRate).toBe(0.02);
      expect(result.pph21).toBe(200_000);
    });

    it('gross = 9,559,600 (JP cap threshold) → jpCapped = false', () => {
      const result = calculate(9_559_600, 'TK/0');
      expect(result.jpCapped).toBe(false);
      expect(result.employee.jp).toBe(95_596);
    });

    it('gross = 15,000,000 (> JP cap) → jpCapped = true, jp capped at 95,596', () => {
      const result = calculate(15_000_000, 'TK/0');
      expect(result.jpCapped).toBe(true);
      expect(result.employee.jp).toBe(95_596);
    });

    it('gross = 12,000,000 (KESEHATAN cap threshold) → kesehatanCapped = false', () => {
      const result = calculate(12_000_000, 'TK/0');
      expect(result.kesehatanCapped).toBe(false);
      expect(result.employee.kesehatan).toBe(120_000);
    });

    it('gross = 20,000,000 (> KESEHATAN cap) → kesehatanCapped = true, kesehatan capped at 120,000', () => {
      const result = calculate(20_000_000, 'TK/0');
      expect(result.kesehatanCapped).toBe(true);
      expect(result.employee.kesehatan).toBe(120_000);
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

  describe('lookupTerRate', () => {
    it('TK/0 → Category A brackets', () => {
      // 0 → 0%
      expect(lookupTerRate(4_000_000, 'TK/0')).toBe(0);
      // 5,400,001 - 5,650,000 → 0.25%
      expect(lookupTerRate(5_500_000, 'TK/0')).toBe(0.0025);
      // 10,000,000 → 2%
      expect(lookupTerRate(10_000_000, 'TK/0')).toBe(0.02);
    });

    it('TK/1 → Category A brackets', () => {
      expect(lookupTerRate(10_000_000, 'TK/1')).toBe(0.02);
    });

    it('TK/2 → Category B brackets', () => {
      expect(lookupTerRate(10_000_000, 'TK/2')).toBe(0.02);
    });

    it('K/3 → Category C brackets', () => {
      expect(lookupTerRate(10_000_000, 'K/3')).toBe(0.02);
    });

    it('highest bracket rate = 30%', () => {
      expect(lookupTerRate(500_000_000, 'TK/0')).toBe(0.3);
    });
  });

  describe('BPJS caps', () => {
    it('JP cap applied at 9,559,600', () => {
      const below = calculate(9_000_000, 'TK/0');
      const above = calculate(15_000_000, 'TK/0');
      // Above cap: employee.jp = 9,559,600 * 1% = 95,596
      expect(above.employee.jp).toBe(95_596);
      // Below cap: employee.jp = 9,000,000 * 1% = 90,000
      expect(below.employee.jp).toBe(90_000);
    });

    it('KESEHATAN cap applied at 12,000,000', () => {
      const below = calculate(11_000_000, 'TK/0');
      const above = calculate(20_000_000, 'TK/0');
      // Above cap: employee.kesehatan = 12,000,000 * 1% = 120,000
      expect(above.employee.kesehatan).toBe(120_000);
      // Below cap: employee.kesehatan = 11,000,000 * 1% = 110,000
      expect(below.employee.kesehatan).toBe(110_000);
    });
  });
});
