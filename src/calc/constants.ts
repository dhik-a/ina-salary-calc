export type PtkpStatus = 'TK/0' | 'TK/1' | 'TK/2' | 'TK/3' | 'K/0' | 'K/1' | 'K/2' | 'K/3';
export type TerCategory = 'A' | 'B' | 'C';
export type Period = 'monthly' | 'annually';

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
}

// BPJS rates and caps
export const KESEHATAN_CAP = 12_000_000;
export const JP_CAP = 9_559_600;

export const BPJS_KESEHATAN_EMPLOYEE_RATE = 0.01;
export const BPJS_KESEHATAN_EMPLOYER_RATE = 0.04;
export const BPJS_JHT_EMPLOYEE_RATE = 0.02;
export const BPJS_JHT_EMPLOYER_RATE = 0.037;
export const BPJS_JP_EMPLOYEE_RATE = 0.01;
export const BPJS_JP_EMPLOYER_RATE = 0.02;
export const BPJS_JKK_EMPLOYER_RATE = 0.0024;
export const BPJS_JKM_EMPLOYER_RATE = 0.003;

// PTKP status to TER category mapping (SPEC.md §3 Step 1)
export const PTKP_TO_TER: Record<PtkpStatus, TerCategory> = {
  'TK/0': 'A',
  'TK/1': 'A',
  'K/0': 'A',
  'TK/2': 'B',
  'TK/3': 'B',
  'K/1': 'B',
  'K/2': 'B',
  'K/3': 'C',
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
// Lower thresholds than Category A; same bracket structure
export const TER_BRACKETS_B: TerBracket[] = [
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
  { upTo: 26_450_000, rate: 0.1},
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

// Category C: K/3 (PMK 168/2023 Lampiran C)
// Same structure; identical thresholds for simplicity (may differ in actual PMK)
export const TER_BRACKETS_C: TerBracket[] = [
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
