# ina-salary-calc

Indonesian net salary calculator. Enter a gross monthly salary and PTKP status
to see an invoice-style breakdown of PPh 21, BPJS contributions, and net
take-home pay — monthly or annualised.

All calculations run client-side. No data leaves the browser.

## Stack

- Vite 5 + React 18 + TypeScript
- Tailwind CSS 3
- Vitest 1 (87 parametric tests across all 8 PTKP statuses)

## What it calculates

| Item | Reference | Notes |
|---|---|---|
| PPh 21 | PMK 168/2023 (TER method) | 3 categories (A/B/C) grouping the 8 PTKP statuses |
| BPJS Kesehatan | Perpres 64/2020 | 1% employee, 4% employer, wage cap Rp 12,000,000 |
| BPJS JHT | PP 46/2015 | 2% employee, 3.7% employer |
| BPJS JP | PP 45/2015 | 1% employee, 2% employer, wage cap Rp 9,559,600 |
| BPJS JKK | PP 44/2015 | 0.24% employer (assumed risk tier) |
| BPJS JKM | PP 44/2015 | 0.3% employer |

### PTKP → TER category mapping (PMK 168/2023)

| PTKP | Annual PTKP | Category |
|---|---|---|
| TK/0 | 54,000,000 | A |
| TK/1, K/0 | 58,500,000 | A |
| TK/2, K/1 | 63,000,000 | B |
| TK/3, K/2 | 67,500,000 | B |
| K/3 | 72,000,000 | C |

Statuses within the same category produce identical results by design of the
TER system — this is not a bug. See `src/calc/calc.test.ts` for the full
behavioural spec.

## Scripts

```sh
npm install
npm run dev        # start dev server
npm test           # run vitest
npm run build      # typecheck + production build
npm run preview    # preview production build
```

## Known limitations

- **TER bracket values** are a best-effort reading of PMK 168/2023 Lampiran
  A/B/C. Exact transcription from the official PDF is tracked as Phase 2
  work — cross-check against official sources before using for payroll.
- **Annual figures = monthly × 12.** The December reconciliation required by
  PMK 168/2023 (annual progressive Pasal 17 tax on PKP after biaya jabatan
  and PTKP, minus Jan–Nov TER withholdings) is not modelled — actual
  year-end PPh 21 may differ slightly from the displayed figure.
- **JKK rate** is fixed at the 0.24% tier (low-risk). Actual rate varies by
  industry risk classification (0.24%–1.74%).
- **Out of scope:** NPWP surcharge, THR, variable JKK tiers, expatriate
  PTKP rules.

## Disclaimer

This tool is for informational purposes only and does not constitute tax or
legal advice. Indonesian tax rates, PTKP amounts, BPJS rates, and wage caps
are subject to change — always verify against the latest official sources
before using for payroll decisions.
