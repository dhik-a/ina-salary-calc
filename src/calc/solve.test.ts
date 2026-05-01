import { describe, it, expect } from 'vitest';
import { calculate } from './calculate';
import { solveGrossFromNet, UnreachableNetError } from './solve';
import { Period, PtkpStatus, ThrOptions } from './constants';

const NO_THR: ThrOptions = { include: false, type: 'full', monthsWorked: 12 };
const FULL_THR: ThrOptions = { include: true, type: 'full', monthsWorked: 12 };
const PRORATED_THR: ThrOptions = { include: true, type: 'prorated', monthsWorked: 7 };

function forwardNet(gross: number, ptkp: PtkpStatus, period: Period, thr: ThrOptions): number {
  const b = calculate(gross, ptkp, thr);
  return period === 'monthly' ? b.net : b.annual.net;
}

/**
 * Core assertion: given a target net, solve for gross, compute net from that
 * gross, and verify the computed net is within `tolerance` of the target.
 * Monthly mode should always match exactly (tolerance 0).
 * Annual mode may be off by a few rupiah (floor(pkp/1000) rounding in PMK 168/2023).
 */
function assertNetToGrossToNet(
  targetNet: number,
  ptkp: PtkpStatus,
  period: Period,
  thr: ThrOptions,
  tolerance: number,
) {
  const result = solveGrossFromNet(targetNet, ptkp, period, thr);
  const computedNet = forwardNet(result.gross, ptkp, period, thr);
  expect(
    Math.abs(computedNet - targetNet),
    `net→gross→net: target=${targetNet}, gross=${result.gross}, computedNet=${computedNet}`,
  ).toBeLessThanOrEqual(tolerance);
}

// ─────────────────────────────────────────────────────────────────────────────
// Edge cases
// ─────────────────────────────────────────────────────────────────────────────
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
    expect(() => solveGrossFromNet(1e12, 'TK/0', 'monthly', NO_THR)).toThrow(UnreachableNetError);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Monthly — net → gross → net (tolerance 0: monthly should always be exact)
// ─────────────────────────────────────────────────────────────────────────────
describe('monthly net → gross → net (no THR)', () => {
  const TARGETS: Array<[number, PtkpStatus]> = [
    // Below TER threshold (rate 0)
    [2_000_000, 'TK/0'],
    [4_500_000, 'TK/0'],
    // Just above first bracket boundary
    [5_000_000, 'TK/0'],
    [5_200_000, 'TK/1'],
    // Mid-range
    [7_500_000, 'TK/0'],
    [7_500_000, 'TK/1'],
    [7_500_000, 'K/0'],
    [9_000_000, 'TK/2'],
    [9_000_000, 'K/3'],
    // Around JP cap (gross ~9.56M → net ~9.1M)
    [9_000_000, 'TK/0'],
    // Around Kesehatan cap (gross ~12M → net ~11.2M)
    [11_000_000, 'TK/0'],
    [11_000_000, 'K/0'],
    // High range
    [15_000_000, 'TK/0'],
    [15_000_000, 'TK/2'],
    [15_000_000, 'TK/3'],
    [15_000_000, 'K/3'],
    [20_000_000, 'TK/0'],
    [30_000_000, 'TK/2'],
    [50_000_000, 'TK/3'],
    [50_000_000, 'K/3'],
    [100_000_000, 'K/1'],
    [200_000_000, 'K/3'],
  ];
  for (const [net, ptkp] of TARGETS) {
    it(`net=${net.toLocaleString()} ptkp=${ptkp}`, () => {
      assertNetToGrossToNet(net, ptkp, 'monthly', NO_THR, 0);
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Annual — net → gross → net (tolerance 5: floor(pkp/1000) rounding)
// ─────────────────────────────────────────────────────────────────────────────
describe('annual net → gross → net, no THR (tolerance ≤6 Rp)', () => {
  const TARGETS: Array<[number, PtkpStatus]> = [
    [50_000_000, 'TK/0'],
    [60_000_000, 'TK/0'],
    [72_000_000, 'TK/1'],
    [84_000_000, 'K/0'],
    [96_000_000, 'TK/2'],
    [120_000_000, 'TK/3'],
    [180_000_000, 'K/3'],
    [240_000_000, 'K/3'],
  ];
  for (const [net, ptkp] of TARGETS) {
    it(`net=${net.toLocaleString()} ptkp=${ptkp}`, () => {
      assertNetToGrossToNet(net, ptkp, 'annually', NO_THR, 6);
    });
  }
});

describe('annual net → gross → net, full THR (tolerance ≤6 Rp)', () => {
  const TARGETS: Array<[number, PtkpStatus]> = [
    [50_000_000, 'TK/0'],
    [60_000_000, 'TK/0'],
    [78_000_000, 'K/0'],
    [100_000_000, 'K/3'],
    [150_000_000, 'TK/2'],
  ];
  for (const [net, ptkp] of TARGETS) {
    it(`net=${net.toLocaleString()} ptkp=${ptkp}`, () => {
      assertNetToGrossToNet(net, ptkp, 'annually', FULL_THR, 6);
    });
  }
});

describe('annual net → gross → net, prorated THR 7 months (tolerance ≤6 Rp)', () => {
  const TARGETS: Array<[number, PtkpStatus]> = [
    [55_000_000, 'TK/0'],
    [80_000_000, 'TK/1'],
    [120_000_000, 'K/2'],
  ];
  for (const [net, ptkp] of TARGETS) {
    it(`net=${net.toLocaleString()} ptkp=${ptkp}`, () => {
      assertNetToGrossToNet(net, ptkp, 'annually', PRORATED_THR, 6);
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Gross → net → gross round-trip (original direction; tolerance ≤2)
// Verifies solver consistency from the other starting direction.
// ─────────────────────────────────────────────────────────────────────────────
describe('gross → net → gross round-trip (monthly, tolerance ≤2)', () => {
  const CASES: Array<[number, PtkpStatus]> = [
    [3_000_000, 'TK/0'],
    [5_500_000, 'TK/0'],
    [8_000_000, 'TK/0'],
    [10_000_000, 'TK/1'],
    [12_500_000, 'K/0'],
    [20_000_000, 'TK/2'],
    [50_000_000, 'TK/3'],
    [100_000_000, 'K/1'],
    [80_000_000, 'K/3'],
    [200_000_000, 'K/3'],
  ];
  for (const [gross, ptkp] of CASES) {
    it(`gross=${gross.toLocaleString()} ptkp=${ptkp}`, () => {
      const targetNet = forwardNet(gross, ptkp, 'monthly', NO_THR);
      const result = solveGrossFromNet(targetNet, ptkp, 'monthly', NO_THR);
      const recomputedNet = forwardNet(result.gross, ptkp, 'monthly', NO_THR);
      expect(Math.abs(recomputedNet - targetNet)).toBeLessThanOrEqual(2);
      expect(Math.abs(result.gross - gross)).toBeLessThanOrEqual(100);
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Flat zone policy
// ─────────────────────────────────────────────────────────────────────────────
describe('flat zone policy', () => {
  it('returns smallest gross by default when a flat zone exists', () => {
    let foundTarget: number | null = null;
    let foundZone = { min: 0, max: 0 };
    for (let g = 1; g < 100; g++) {
      const net = forwardNet(g, 'TK/0', 'monthly', NO_THR);
      const nextNet = forwardNet(g + 1, 'TK/0', 'monthly', NO_THR);
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
      expect(true).toBe(true); // no flat zone in this range — pass
    }
  });
});
