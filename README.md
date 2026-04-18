# ina-salary-calc

Indonesian net salary calculator. Enter a gross monthly salary and PTKP status
to see an invoice-style breakdown of PPh 21, BPJS contributions, and net
take-home pay — monthly or annualised.

All calculations run client-side. No data leaves the browser.

## Stack

- Vite 5 + React 18 + TypeScript
- Tailwind CSS 3
- Vitest 1 (124 tests: 87 monthly + 37 annual scenarios across all 8 PTKP statuses)

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

## Architecture

**Domain-driven separation:** All salary calculation logic is pure functions in
`src/calc/` with zero React dependencies. Tax rules, BPJS rates, and caps are
structured data in `constants.ts` (not hardcoded inline). The UI layer
(`src/components/`) is presentational — it receives calculated results and
renders them. This separation makes the domain reusable (frontend, backend,
CLI, etc.) and testable without React.

```
src/
├── calc/
│   ├── calculate.ts      (main entry: (gross, ptkp) → Breakdown)
│   ├── annual.ts         (December reconciliation, progressive tax)
│   ├── bpjs.ts           (BPJS contributions)
│   ├── ter.ts            (TER bracket lookup)
│   ├── constants.ts      (all tax rules as data)
│   ├── calc.test.ts      (87 tests)
│   └── annual.test.ts    (37 tests)
└── components/
    └── (presentational React components)
```

## Scripts

```sh
npm install
npm run dev        # start dev server
npm test           # run vitest
npm run build      # typecheck + production build
npm run preview    # preview production build
```

## Features

- ✅ **Monthly and annual calculations** — annual view includes PMK 168/2023
  December reconciliation (progressive Pasal 17 tax on PKP minus Jan–Nov TER
  withholdings).
- ✅ **Continuous TER brackets** — categories A/B/C upper brackets (27–30% in B,
  26–30% in C) are interpolated from category A's shape to fill gaps.
- ✅ **Employer contributions** — informational view of total cost to company
  (gross + BPJS).
- ✅ **Comprehensive test coverage** — 124 unit tests covering all bracket
  boundaries, PKP rounding, biaya jabatan cap, and reconciliation scenarios.

## Known limitations

- **TER bracket interpolation** — categories B and C upper rows (≥0.27 in B,
  ≥0.26 in C) are interpolated from category A's pattern to avoid
  discontinuities. Full verbatim transcription from the official PMK 168/2023
  PDF is deferred. Cross-check against official sources before using for
  payroll.
- **JKK rate** — fixed at the 0.24% tier (low-risk). Actual rate varies by
  industry risk classification (0.24%–1.74%).
- **Out of scope:** NPWP surcharge (20% for non-NPWP filers), THR (holiday
  allowance), variable JKK tiers, multi-component salary, expatriate PTKP
  rules, scenario simulation.

## Disclaimer

This tool is for informational purposes only and does not constitute tax or
legal advice. Indonesian tax rates, PTKP amounts, BPJS rates, and wage caps
are subject to change — always verify against the latest official sources
before using for payroll decisions.
