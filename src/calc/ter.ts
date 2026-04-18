import { PTKP_TO_TER, TER_BRACKETS_A, TER_BRACKETS_B, TER_BRACKETS_C, TerBracket, TerCategory, PtkpStatus } from './constants';

export function lookupTerRate(grossMonthly: number, ptkpStatus: PtkpStatus): number {
  const category = PTKP_TO_TER[ptkpStatus];
  const brackets = getBracketsForCategory(category);

  for (const bracket of brackets) {
    if (grossMonthly <= bracket.upTo) {
      return bracket.rate;
    }
  }

  return brackets[brackets.length - 1].rate;
}

function getBracketsForCategory(category: TerCategory): TerBracket[] {
  switch (category) {
    case 'A':
      return TER_BRACKETS_A;
    case 'B':
      return TER_BRACKETS_B;
    case 'C':
      return TER_BRACKETS_C;
  }
}
