import {
  Period,
  PtkpStatus,
  ThrOptions,
  PTKP_TO_TER,
  TER_BRACKETS_A,
  TER_BRACKETS_B,
  TER_BRACKETS_C,
  KESEHATAN_CAP,
  JP_CAP,
} from './constants';
import { calculate } from './calculate';

export type FlatZonePolicy = 'smallest' | 'largest' | 'midpoint';

export class UnreachableNetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnreachableNetError';
  }
}

export interface SolveResult {
  gross: number;
  flatZone: { min: number; max: number };
  exact: boolean;
  computedNet: number;
}

const MAX_GROSS = 10_000_000_000;
const FLAT_ZONE_SCAN_LIMIT = 1_000;

function netFromGross(
  gross: number,
  ptkp: PtkpStatus,
  period: Period,
  thrOpts: ThrOptions,
): number {
  const b = calculate(gross, ptkp, thrOpts);
  return period === 'monthly' ? b.net : b.annual.net;
}

// Segment boundaries for monthly mode. The forward function is monotonic non-
// decreasing within each segment (TER rate fixed, BPJS slopes fixed), but has
// a downward jump at each TER bracket boundary. We split the gross axis at
// every TER bracket upTo, plus the BPJS caps, to get monotonic segments.
function getMonthlySegmentBoundaries(ptkp: PtkpStatus): number[] {
  const cat = PTKP_TO_TER[ptkp];
  const brackets =
    cat === 'A' ? TER_BRACKETS_A : cat === 'B' ? TER_BRACKETS_B : TER_BRACKETS_C;
  const set = new Set<number>();
  for (const b of brackets) {
    if (Number.isFinite(b.upTo)) set.add(b.upTo);
  }
  set.add(JP_CAP);
  set.add(KESEHATAN_CAP);
  return [...set].sort((a, b) => a - b);
}

// Bisect within [low, high] for smallest g such that netFromGross(g) >= target.
// Returns null if no such g exists in the range. Assumes the function is
// monotonic non-decreasing on this interval.
function bisectSmallestGEQ(
  target: number,
  low: number,
  high: number,
  ptkp: PtkpStatus,
  period: Period,
  thrOpts: ThrOptions,
): number | null {
  const highNet = netFromGross(high, ptkp, period, thrOpts);
  if (highNet < target) return null;
  const lowNet = netFromGross(low, ptkp, period, thrOpts);
  if (lowNet >= target) return low;
  while (high - low > 1) {
    const mid = Math.floor((low + high) / 2);
    if (netFromGross(mid, ptkp, period, thrOpts) >= target) {
      high = mid;
    } else {
      low = mid;
    }
  }
  return high;
}

function solveMonthlyCandidate(
  targetNet: number,
  ptkp: PtkpStatus,
  thrOpts: ThrOptions,
): number {
  const boundaries = getMonthlySegmentBoundaries(ptkp);
  let segLow = 0;
  for (const segHigh of boundaries) {
    if (segLow > segHigh) {
      segLow = segHigh + 1;
      continue;
    }
    const candidate = bisectSmallestGEQ(targetNet, segLow, segHigh, ptkp, 'monthly', thrOpts);
    if (candidate !== null) return candidate;
    segLow = segHigh + 1;
  }
  // Final unbounded segment
  const tail = bisectSmallestGEQ(targetNet, segLow, MAX_GROSS, ptkp, 'monthly', thrOpts);
  if (tail !== null) return tail;
  // Should not reach here — caller checks feasibility upfront.
  return MAX_GROSS;
}

// Scan limit for post-bisection refinement in annual mode. Annual net has small
// dips (~150 Rp) every ~91 Rp of monthly gross caused by floor(pkpRaw/1000)*1000
// rounding in the progressive tax calculation. A 200-step backward scan covers
// two full rounding cycles and finds the closest (or exact) gross.
const ANNUAL_SCAN_BACK = 200;

function solveAnnualCandidate(
  targetNet: number,
  ptkp: PtkpStatus,
  thrOpts: ThrOptions,
): number {
  // Bisection gives the smallest gross with annual.net >= target. Due to small
  // dips from PKP floor-rounding, the exact target may sit just below this
  // candidate. Scan backward to minimise the absolute difference.
  const bisectResult = bisectSmallestGEQ(targetNet, 0, MAX_GROSS, ptkp, 'annually', thrOpts);
  const candidate = bisectResult ?? MAX_GROSS;
  const candidateNet = netFromGross(candidate, ptkp, 'annually', thrOpts);

  if (candidateNet === targetNet) return candidate;

  let bestGross = candidate;
  let bestDiff = Math.abs(candidateNet - targetNet);

  for (let g = candidate - 1; g >= Math.max(0, candidate - ANNUAL_SCAN_BACK); g--) {
    const gNet = netFromGross(g, ptkp, 'annually', thrOpts);
    const diff = Math.abs(gNet - targetNet);
    if (diff < bestDiff) {
      bestGross = g;
      bestDiff = diff;
      if (diff === 0) break;
    } else if (gNet < targetNet && diff > bestDiff) {
      // Heading away from target going down; no improvement possible.
      break;
    }
  }
  return bestGross;
}

export function solveGrossFromNet(
  targetNet: number,
  ptkp: PtkpStatus,
  period: Period,
  thrOpts: ThrOptions,
  flatZonePolicy: FlatZonePolicy = 'smallest',
): SolveResult {
  if (!Number.isFinite(targetNet) || targetNet < 0) {
    throw new UnreachableNetError(
      `Target net must be a non-negative finite number; got ${targetNet}`,
    );
  }

  if (targetNet === 0) {
    return { gross: 0, flatZone: { min: 0, max: 0 }, exact: true, computedNet: 0 };
  }

  const maxAchievableNet = netFromGross(MAX_GROSS, ptkp, period, thrOpts);
  if (targetNet > maxAchievableNet) {
    throw new UnreachableNetError(
      `Target net ${targetNet} exceeds maximum achievable net ${maxAchievableNet}`,
    );
  }

  const candidate =
    period === 'monthly'
      ? solveMonthlyCandidate(targetNet, ptkp, thrOpts)
      : solveAnnualCandidate(targetNet, ptkp, thrOpts);

  let computedNet = netFromGross(candidate, ptkp, period, thrOpts);
  let chosenCandidate = candidate;

  // If the candidate overshot due to a TER-boundary dip lying in the search
  // path, the previous gross may produce a closer net. Check one step back.
  if (computedNet !== targetNet) {
    const prev = chosenCandidate - 1;
    if (prev >= 0) {
      const prevNet = netFromGross(prev, ptkp, period, thrOpts);
      if (Math.abs(prevNet - targetNet) < Math.abs(computedNet - targetNet)) {
        chosenCandidate = prev;
        computedNet = prevNet;
      }
    }
  }

  const exact = computedNet === targetNet;

  // Flat zone detection — typically tiny (1–2 rupiah) due to rounding.
  let zoneMin = chosenCandidate;
  let zoneMax = chosenCandidate;
  if (exact) {
    while (
      zoneMin > 0 &&
      chosenCandidate - (zoneMin - 1) <= FLAT_ZONE_SCAN_LIMIT &&
      netFromGross(zoneMin - 1, ptkp, period, thrOpts) === targetNet
    ) {
      zoneMin -= 1;
    }
    while (
      zoneMax < MAX_GROSS &&
      zoneMax + 1 - chosenCandidate <= FLAT_ZONE_SCAN_LIMIT &&
      netFromGross(zoneMax + 1, ptkp, period, thrOpts) === targetNet
    ) {
      zoneMax += 1;
    }
  }

  let chosen: number;
  switch (flatZonePolicy) {
    case 'largest':
      chosen = zoneMax;
      break;
    case 'midpoint':
      chosen = Math.round((zoneMin + zoneMax) / 2);
      break;
    case 'smallest':
    default:
      chosen = zoneMin;
      break;
  }

  return {
    gross: chosen,
    flatZone: { min: zoneMin, max: zoneMax },
    exact,
    computedNet: netFromGross(chosen, ptkp, period, thrOpts),
  };
}
