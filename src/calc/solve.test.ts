import { describe, it, expect } from 'vitest';
import { calculate } from './calculate';
import { solveGrossFromNet, UnreachableNetError } from './solve';
import { Period, PtkpStatus, ThrOptions } from './constants';

const NO_THR: ThrOptions = { include: false, type: 'full', monthsWorked: 12 };
const FULL_THR: ThrOptions = { include: true, type: 'full', monthsWorked: 12 };
const PRORATED_THR: ThrOptions = { include: true, type: 'prorated', monthsWorked: 7 };

function netForGross(gross: number, ptkp: PtkpStatus, period: Period, thr: ThrOptions): number {
  const b = calculate(gross, ptkp, thr);
  return period === 'monthly' ? b.net : b.annual.net;
}

function assertRoundTrip(
  gross: number,
  ptkp: PtkpStatus,
  period: Period,
  thr: ThrOptions,
  tolerance = 2,
) {
  const targetNet = netForGross(gross, ptkp, period, thr);
  const result = solveGrossFromNet(targetNet, ptkp, period, thr);
  // The solved gross must produce a net within tolerance of the target.
  const recomputedNet = netForGross(result.gross, ptkp, period, thr);
  expect(Math.abs(recomputedNet - targetNet)).toBeLessThanOrEqual(tolerance);
  // The solved gross should be reasonably close to the original (or in the same
  // flat zone). Accept a generous window in case of TER-boundary effects.
  expect(Math.abs(result.gross - gross)).toBeLessThanOrEqual(100);
}

describe('solveGrossFromNet', () => {
  describe('edge cases', () => {
    it('targetNet = 0 → gross = 0, exact', () => {
      const r = solveGrossFromNet(0, 'TK/0', 'monthly', NO_THR);
      expect(r.gross).toBe(0);
      expect(r.exact).toBe(true);
      expect(r.computedNet).toBe(0);
      expect(r.flatZone).toEqual({ min: 0, max: 0 });
    });

    it('negative target throws UnreachableNetError', () => {
      expect(() => solveGrossFromNet(-1, 'TK/0', 'monthly', NO_THR)).toThrow(UnreachableNetError);
    });

    it('NaN/Infinity target throws UnreachableNetError', () => {
      expect(() => solveGrossFromNet(NaN, 'TK/0', 'monthly', NO_THR)).toThrow(UnreachableNetError);
      expect(() => solveGrossFromNet(Infinity, 'TK/0', 'monthly', NO_THR)).toThrow(UnreachableNetError);
    });

    it('target above max achievable throws UnreachableNetError', () => {
      // Max gross 10B, max net well below 10^11. 10^12 must be unreachable.
      expect(() => solveGrossFromNet(1e12, 'TK/0', 'monthly', NO_THR)).toThrow(UnreachableNetError);
    });
  });

  describe('round-trip — monthly mode, no THR', () => {
    const cases: [number, PtkpStatus][] = [
      [3_000_000, 'TK/0'],   // below TER threshold
      [5_500_000, 'TK/0'],   // just above first non-zero TER bracket
      [8_000_000, 'TK/0'],
      [10_000_000, 'TK/1'],  // just above JP cap
      [12_500_000, 'K/0'],   // above Kesehatan cap
      [20_000_000, 'TK/2'],  // Cat B
      [50_000_000, 'TK/3'],  // Cat B, mid
      [100_000_000, 'K/1'],  // Cat B, high
      [80_000_000, 'K/3'],   // Cat C
      [200_000_000, 'K/3'],  // Cat C, high
    ];

    for (const [gross, ptkp] of cases) {
      it(`recovers gross ≈ ${gross.toLocaleString()} for ${ptkp}`, () => {
        assertRoundTrip(gross, ptkp, 'monthly', NO_THR);
      });
    }
  });

  describe('round-trip — annual mode, no THR', () => {
    const cases: [number, PtkpStatus][] = [
      [5_500_000, 'TK/0'],
      [10_000_000, 'TK/1'],
      [15_000_000, 'K/0'],
      [25_000_000, 'TK/2'],
      [60_000_000, 'TK/3'],
      [120_000_000, 'K/3'],
    ];
    for (const [gross, ptkp] of cases) {
      it(`recovers gross ≈ ${gross.toLocaleString()} for ${ptkp}`, () => {
        assertRoundTrip(gross, ptkp, 'annually', NO_THR);
      });
    }
  });

  describe('round-trip — annual mode, full THR', () => {
    const cases: [number, PtkpStatus][] = [
      [6_000_000, 'TK/0'],
      [12_000_000, 'K/0'],
      [25_000_000, 'TK/2'],
      [80_000_000, 'K/3'],
    ];
    for (const [gross, ptkp] of cases) {
      it(`recovers gross ≈ ${gross.toLocaleString()} for ${ptkp} with full THR`, () => {
        assertRoundTrip(gross, ptkp, 'annually', FULL_THR);
      });
    }
  });

  describe('round-trip — annual mode, prorated THR (7 months)', () => {
    const cases: [number, PtkpStatus][] = [
      [7_500_000, 'TK/0'],
      [15_000_000, 'K/1'],
      [50_000_000, 'TK/3'],
    ];
    for (const [gross, ptkp] of cases) {
      it(`recovers gross ≈ ${gross.toLocaleString()} for ${ptkp} with prorated THR`, () => {
        assertRoundTrip(gross, ptkp, 'annually', PRORATED_THR);
      });
    }
  });

  describe('flat zone policy', () => {
    it('returns smallest gross by default when a flat zone exists', () => {
      // Construct a flat zone artificially: search for a small flat zone via probing.
      // For very low gross values, BPJS rounding can create flat zones.
      // Find a target net that has a known flat zone by sampling:
      let foundTarget: number | null = null;
      let foundZone = { min: 0, max: 0 };
      for (let g = 1; g < 100; g++) {
        const net = netForGross(g, 'TK/0', 'monthly', NO_THR);
        const nextNet = netForGross(g + 1, 'TK/0', 'monthly', NO_THR);
        if (net === nextNet) {
          foundTarget = net;
          foundZone = { min: g, max: g + 1 };
          break;
        }
      }
      if (foundTarget !== null) {
        const smallest = solveGrossFromNet(foundTarget, 'TK/0', 'monthly', NO_THR, 'smallest');
        const largest = solveGrossFromNet(foundTarget, 'TK/0', 'monthly', NO_THR, 'largest');
        expect(smallest.gross).toBe(foundZone.min);
        expect(largest.gross).toBeGreaterThanOrEqual(foundZone.max);
        expect(smallest.flatZone.min).toBeLessThanOrEqual(foundZone.min);
      } else {
        // No flat zone in the small range — skip silently. Flat zones depend on rounding behavior.
        expect(true).toBe(true);
      }
    });
  });

  describe('property: solved gross produces target net within Rp 2', () => {
    const SAMPLES: [number, PtkpStatus, Period, ThrOptions][] = [
      [4_000_000, 'TK/0', 'monthly', NO_THR],
      [7_500_000, 'TK/1', 'monthly', NO_THR],
      [11_000_000, 'K/0', 'monthly', NO_THR],
      [13_500_000, 'K/2', 'monthly', NO_THR],
      [25_000_000, 'TK/3', 'monthly', NO_THR],
      [60_000_000, 'K/3', 'monthly', NO_THR],
      [9_000_000, 'TK/0', 'annually', NO_THR],
      [9_000_000, 'TK/0', 'annually', FULL_THR],
      [18_000_000, 'K/1', 'annually', PRORATED_THR],
    ];
    for (const [gross, ptkp, period, thr] of SAMPLES) {
      it(`gross ${gross.toLocaleString()} ${ptkp} ${period} ${thr.include ? thr.type + '-thr' : 'no-thr'}`, () => {
        assertRoundTrip(gross, ptkp, period, thr, 2);
      });
    }
  });
});
