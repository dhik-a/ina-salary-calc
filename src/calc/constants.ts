export type PtkpStatus = 'TK/0' | 'TK/1' | 'TK/2' | 'TK/3' | 'K/0' | 'K/1' | 'K/2' | 'K/3';
export type TerCategory = 'A' | 'B' | 'C';
export type Period = 'monthly' | 'annually';

export interface AnnualBreakdown {
  gross: number;
  biayaJabatan: number;
  employee: { kesehatan: number; jht: number; jp: number };
  employer: { kesehatan: number; jht: number; jp: number; jkk: number; jkm: number };
  penghasilanNeto: number;
  ptkp: number;
  pkp: number;
  pph21Annual: number;
  pph21JanNov: number;
  pph21December: number;
  totalEmployeeDeduction: number;
  net: number;
  totalCostToCompany: number;
}

export interface Breakdown {
  gross: number;
  terRate: number;
  pph21: number;
  employee: { kesehatan: number; jht: number; jp: number };
  employer: { kesehatan: number; jht: number; jp: number; jkk: number; jkm: number };
  totalEmployeeDeduction: number;
  net: number;
  totalCostToCompany: number;
  jpCapped: boolean;
  kesehatanCapped: boolean;
  annual: AnnualBreakdown;
}

// BPJS rates and caps
export const KESEHATAN_CAP = 12_000_000;
// JP_CAP: BPJS Jaminan Pensiun wage ceiling per PP 45/2015 (revised annually by
// Menteri Ketenagakerjaan decree). Value below is the 2024/2025 figure.
// TODO: re-verify each January against the latest BPJS Ketenagakerjaan release.
export const JP_CAP = 9_559_600;

export const BPJS_KESEHATAN_EMPLOYEE_RATE = 0.01;
export const BPJS_KESEHATAN_EMPLOYER_RATE = 0.04;
export const BPJS_JHT_EMPLOYEE_RATE = 0.02;
export const BPJS_JHT_EMPLOYER_RATE = 0.037;
export const BPJS_JP_EMPLOYEE_RATE = 0.01;
export const BPJS_JP_EMPLOYER_RATE = 0.02;
export const BPJS_JKK_EMPLOYER_RATE = 0.0024;
export const BPJS_JKM_EMPLOYER_RATE = 0.003;

// Biaya jabatan (Per PMK 250/PMK.03/2008, unchanged)
export const BIAYA_JABATAN_RATE = 0.05;
export const BIAYA_JABATAN_ANNUAL_CAP = 6_000_000; // 500k × 12

// PTKP annual amounts per Pasal 7 UU PPh (unchanged since 2016)
export const PTKP_ANNUAL: Record<PtkpStatus, number> = {
  'TK/0':  54_000_000,
  'TK/1':  58_500_000,
  'TK/2':  63_000_000,
  'TK/3':  67_500_000,
  'K/0':   58_500_000,
  'K/1':   63_000_000,
  'K/2':   67_500_000,
  'K/3':   72_000_000,
};

// Pasal 17 progressive brackets (UU HPP 7/2021, effective 2022)
export interface ProgressiveBracket {
  upTo: number;
  rate: number;
}

export const PASAL_17_BRACKETS: ProgressiveBracket[] = [
  { upTo:    60_000_000, rate: 0.05 },
  { upTo:   250_000_000, rate: 0.15 },
  { upTo:   500_000_000, rate: 0.25 },
  { upTo: 5_000_000_000, rate: 0.30 },
  { upTo:      Infinity, rate: 0.35 },
];

// PTKP status to TER category mapping per PMK 168/2023 (SPEC.md §3 Step 1)
// Categories group PTKP statuses: A = PTKP ≤ 58.5M, B = 63-67.5M, C = 72M
export const PTKP_TO_TER: Record<PtkpStatus, TerCategory> = {
  'TK/0': 'A', // PTKP 54.0M
  'TK/1': 'A', // PTKP 58.5M
  'K/0':  'A', // PTKP 58.5M
  'TK/2': 'B', // PTKP 63.0M
  'K/1':  'B', // PTKP 63.0M
  'TK/3': 'B', // PTKP 67.5M
  'K/2':  'B', // PTKP 67.5M
  'K/3':  'C', // PTKP 72.0M
};

// TER brackets per SPEC.md — Category A has full list, B and C reference PMK 168/2023
export interface TerBracket {
  upTo: number;
  rate: number;
}

// Category A: TK/0, TK/1, K/0 (SPEC.md Table, PMK 168/2023 Lampiran A)
export const TER_BRACKETS_A: TerBracket[] = [
  { upTo: 5_400_000, rate: 0 },
  { upTo: 5_650_000, rate: 0.0025 },
  { upTo: 5_950_000, rate: 0.005 },
  { upTo: 6_300_000, rate: 0.0075 },
  { upTo: 6_750_000, rate: 0.01 },
  { upTo: 7_500_000, rate: 0.0125 },
  { upTo: 8_550_000, rate: 0.015 },
  { upTo: 9_650_000, rate: 0.0175 },
  { upTo: 10_050_000, rate: 0.02 },
  { upTo: 10_350_000, rate: 0.0225 },
  { upTo: 10_700_000, rate: 0.025 },
  { upTo: 11_050_000, rate: 0.03 },
  { upTo: 11_600_000, rate: 0.035 },
  { upTo: 12_500_000, rate: 0.04 },
  { upTo: 13_750_000, rate: 0.05 },
  { upTo: 15_100_000, rate: 0.06 },
  { upTo: 16_950_000, rate: 0.07 },
  { upTo: 19_750_000, rate: 0.08 },
  { upTo: 24_150_000, rate: 0.09 },
  { upTo: 26_450_000, rate: 0.1 },
  { upTo: 28_000_000, rate: 0.11 },
  { upTo: 30_050_000, rate: 0.12 },
  { upTo: 32_400_000, rate: 0.13 },
  { upTo: 35_400_000, rate: 0.14 },
  { upTo: 39_100_000, rate: 0.15 },
  { upTo: 43_850_000, rate: 0.16 },
  { upTo: 47_800_000, rate: 0.17 },
  { upTo: 51_400_000, rate: 0.18 },
  { upTo: 56_300_000, rate: 0.19 },
  { upTo: 62_200_000, rate: 0.2 },
  { upTo: 68_600_000, rate: 0.21 },
  { upTo: 77_500_000, rate: 0.22 },
  { upTo: 89_000_000, rate: 0.23 },
  { upTo: 103_000_000, rate: 0.24 },
  { upTo: 125_000_000, rate: 0.25 },
  { upTo: 157_000_000, rate: 0.26 },
  { upTo: 206_000_000, rate: 0.27 },
  { upTo: 337_000_000, rate: 0.28 },
  { upTo: Infinity, rate: 0.3 },
];

// Category B: TK/2, TK/3, K/1, K/2 (PMK 168/2023 Lampiran B)
// Lower/mid rows are best-effort readings of PMK Lampiran B. Upper rows (≥ 0.27)
// are interpolated from Cat A's shape to avoid discontinuities.
// TODO (Phase 3): replace all B and C rows with verbatim values from the official PMK 168/2023 PDF.
export const TER_BRACKETS_B: TerBracket[] = [
  { upTo: 6_200_000, rate: 0 },
  { upTo: 6_500_000, rate: 0.0025 },
  { upTo: 6_850_000, rate: 0.005 },
  { upTo: 7_300_000, rate: 0.0075 },
  { upTo: 7_800_000, rate: 0.01 },
  { upTo: 8_700_000, rate: 0.0125 },
  { upTo: 9_800_000, rate: 0.015 },
  { upTo: 10_950_000, rate: 0.0175 },
  { upTo: 11_200_000, rate: 0.02 },
  { upTo: 12_050_000, rate: 0.0225 },
  { upTo: 12_950_000, rate: 0.025 },
  { upTo: 14_150_000, rate: 0.03 },
  { upTo: 15_550_000, rate: 0.035 },
  { upTo: 17_050_000, rate: 0.04 },
  { upTo: 19_500_000, rate: 0.05 },
  { upTo: 22_700_000, rate: 0.06 },
  { upTo: 26_600_000, rate: 0.07 },
  { upTo: 28_100_000, rate: 0.08 },
  { upTo: 30_100_000, rate: 0.09 },
  { upTo: 32_600_000, rate: 0.1 },
  { upTo: 35_400_000, rate: 0.11 },
  { upTo: 38_900_000, rate: 0.12 },
  { upTo: 43_000_000, rate: 0.13 },
  { upTo: 47_400_000, rate: 0.14 },
  { upTo: 51_200_000, rate: 0.15 },
  { upTo: 55_800_000, rate: 0.16 },
  { upTo: 60_400_000, rate: 0.17 },
  { upTo: 66_700_000, rate: 0.18 },
  { upTo: 74_500_000, rate: 0.19 },
  { upTo: 83_200_000, rate: 0.2 },
  { upTo: 95_000_000, rate: 0.21 },
  { upTo: 110_000_000, rate: 0.22 },
  { upTo: 134_000_000, rate: 0.23 },
  { upTo: 169_000_000, rate: 0.24 },
  { upTo: 221_000_000, rate: 0.25 },
  { upTo: 354_000_000, rate: 0.26 },
  { upTo: 437_000_000, rate: 0.27 },
  { upTo: 540_000_000, rate: 0.28 },
  { upTo: Infinity, rate: 0.30 },
];

// Category C: K/3 (PMK 168/2023 Lampiran C)
// Lower/mid rows are best-effort readings. Upper rows (≥ 0.26) are interpolated.
export const TER_BRACKETS_C: TerBracket[] = [
  { upTo: 6_600_000, rate: 0 },
  { upTo: 6_950_000, rate: 0.0025 },
  { upTo: 7_350_000, rate: 0.005 },
  { upTo: 7_800_000, rate: 0.0075 },
  { upTo: 8_850_000, rate: 0.01 },
  { upTo: 9_800_000, rate: 0.0125 },
  { upTo: 10_950_000, rate: 0.015 },
  { upTo: 11_200_000, rate: 0.0175 },
  { upTo: 12_050_000, rate: 0.02 },
  { upTo: 12_950_000, rate: 0.0225 },
  { upTo: 14_150_000, rate: 0.025 },
  { upTo: 15_550_000, rate: 0.03 },
  { upTo: 17_050_000, rate: 0.035 },
  { upTo: 19_500_000, rate: 0.04 },
  { upTo: 22_700_000, rate: 0.05 },
  { upTo: 26_600_000, rate: 0.06 },
  { upTo: 28_100_000, rate: 0.07 },
  { upTo: 30_100_000, rate: 0.08 },
  { upTo: 32_600_000, rate: 0.09 },
  { upTo: 35_400_000, rate: 0.1 },
  { upTo: 38_900_000, rate: 0.11 },
  { upTo: 43_000_000, rate: 0.12 },
  { upTo: 47_400_000, rate: 0.13 },
  { upTo: 51_200_000, rate: 0.14 },
  { upTo: 55_800_000, rate: 0.15 },
  { upTo: 60_400_000, rate: 0.16 },
  { upTo: 66_700_000, rate: 0.17 },
  { upTo: 74_500_000, rate: 0.18 },
  { upTo: 83_200_000, rate: 0.19 },
  { upTo: 95_000_000, rate: 0.2 },
  { upTo: 110_000_000, rate: 0.21 },
  { upTo: 134_000_000, rate: 0.22 },
  { upTo: 169_000_000, rate: 0.23 },
  { upTo: 221_000_000, rate: 0.24 },
  { upTo: 354_000_000, rate: 0.25 },
  { upTo: 437_000_000, rate: 0.26 },
  { upTo: 540_000_000, rate: 0.27 },
  { upTo: 667_000_000, rate: 0.28 },
  { upTo: Infinity, rate: 0.30 },
];
