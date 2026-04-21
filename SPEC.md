# Salary Calculator – Phase 1 Spec

## Overview

A single-page frontend app that converts a gross salary offer into take-home (net) pay for Indonesian employees, showing a full invoice-style deduction breakdown.

---

## Inputs

| Field | Type | Notes |
|---|---|---|
| Gross Salary | Number (Rp) | Monthly gross amount |
| Display Period | Toggle | Monthly / Annually |
| PTKP Status | Select | Default: TK/0. Options: TK/0, TK/1, TK/2, TK/3, K/0, K/1, K/2, K/3 |

> PTKP is required for accurate PPh 21 TER lookup. Phase 1 exposes it as a simple select, pre-filled to TK/0.

---

## Calculation Logic

All math runs client-side in a pure function: `calculate(grossMonthly, ptkpStatus) → breakdown`.

### 1. BPJS Kesehatan

| Party | Rate | Salary Cap |
|---|---|---|
| Employee | 1% | Rp 12,000,000 |
| Employer | 4% | Rp 12,000,000 |

```
basisKesehatan = min(grossMonthly, 12_000_000)
employeeKesehatan = basisKesehatan × 1%
employerKesehatan = basisKesehatan × 4%
```

### 2. BPJS Ketenagakerjaan

| Component | Employee | Employer | Salary Cap |
|---|---|---|---|
| JHT (Jaminan Hari Tua) | 2% | 3.7% | None |
| JP (Jaminan Pensiun) | 1% | 2% | Rp 9,559,600 |
| JKK (Jaminan Kecelakaan Kerja) | — | 0.24% | None |
| JKM (Jaminan Kematian) | — | 0.3% | None |

```
basisJP = min(grossMonthly, 9_559_600)

employeeJHT = grossMonthly × 2%
employeeJP  = basisJP × 1%
employerJHT = grossMonthly × 3.7%
employerJP  = basisJP × 2%
employerJKK = grossMonthly × 0.24%
employerJKM = grossMonthly × 0.3%
```

### 3. PPh 21 – TER Method (PMK 168/2023, effective Jan 2024)

TER (Tarif Efektif Rata-rata) applies a flat monthly rate to gross income based on PTKP category.

**Step 1 — Determine TER category from PTKP status:**

| PTKP Status | Annual PTKP (Rp) | TER Category |
|---|---|---|
| TK/0 | 54,000,000 | A |
| TK/1, K/0 | 58,500,000 | A |
| TK/2, K/1 | 63,000,000 | B |
| TK/3, K/2 | 67,500,000 | B |
| K/3 | 72,000,000 | C |

**Step 2 — Look up monthly rate from TER table:**

*Category A* (TK/0, TK/1, K/0):

| Monthly Gross (Rp) | Rate |
|---|---|
| ≤ 5,400,000 | 0% |
| 5,400,001 – 5,650,000 | 0.25% |
| 5,650,001 – 5,950,000 | 0.5% |
| 5,950,001 – 6,300,000 | 0.75% |
| 6,300,001 – 6,750,000 | 1% |
| 6,750,001 – 7,500,000 | 1.25% |
| 7,500,001 – 8,550,000 | 1.5% |
| 8,550,001 – 9,650,000 | 1.75% |
| 9,650,001 – 10,050,000 | 2% |
| 10,050,001 – 10,350,000 | 2.25% |
| 10,350,001 – 10,700,000 | 2.5% |
| 10,700,001 – 11,050,000 | 3% |
| 11,050,001 – 11,600,000 | 3.5% |
| 11,600,001 – 12,500,000 | 4% |
| 12,500,001 – 13,750,000 | 5% |
| 13,750,001 – 15,100,000 | 6% |
| 15,100,001 – 16,950,000 | 7% |
| 16,950,001 – 19,750,000 | 8% |
| 19,750,001 – 24,150,000 | 9% |
| 24,150,001 – 26,450,000 | 10% |
| 26,450,001 – 28,000,000 | 11% |
| 28,000,001 – 30,050,000 | 12% |
| 30,050,001 – 32,400,000 | 13% |
| 32,400,001 – 35,400,000 | 14% |
| 35,400,001 – 39,100,000 | 15% |
| 39,100,001 – 43,850,000 | 16% |
| 43,850,001 – 47,800,000 | 17% |
| 47,800,001 – 51,400,000 | 18% |
| 51,400,001 – 56,300,000 | 19% |
| 56,300,001 – 62,200,000 | 20% |
| 62,200,001 – 68,600,000 | 21% |
| 68,600,001 – 77,500,000 | 22% |
| 77,500,001 – 89,000,000 | 23% |
| 89,000,001 – 103,000,000 | 24% |
| 103,000,001 – 125,000,000 | 25% |
| 125,000,001 – 157,000,000 | 26% |
| 157,000,001 – 206,000,000 | 27% |
| 206,000,001 – 337,000,000 | 28% |
| > 337,000,000 | 30% |

*Category B* (TK/2, TK/3, K/1, K/2): same bracket structure with different lower thresholds (implementation detail — use official PMK 168/2023 Lampiran B table).

*Category C* (K/3): same bracket structure with different lower thresholds (use PMK 168/2023 Lampiran C table).

**Step 3 — Compute PPh 21:**
```
pph21Monthly = grossMonthly × terRate
```

> Note: This TER rate applies Jan–Nov. In December, employer must reconcile against the annual progressive rate method. Phase 1 does not model the December reconciliation.

### 4. Net Salary

```
totalEmployeeDeduction = employeeKesehatan + employeeJHT + employeeJP + pph21Monthly
netMonthly = grossMonthly − totalEmployeeDeduction
```

---

## Output – Invoice-Style Breakdown

Display two columns: **Monthly** and **Annual** (annual = monthly × 12), controlled by the toggle. Show both simultaneously, with the selected period highlighted, OR switch the display entirely — either is acceptable.

### Layout

```
┌──────────────────────────────────────────────────────┐
│  SALARY BREAKDOWN                  [Monthly][Annual] │
├──────────────────────────────────────────────────────┤
│  Gross Salary                          Rp XX,XXX,XXX │
├──────────────────────────────────────────────────────┤
│  DEDUCTIONS (Employee)                               │
│  ─ PPh 21 (TER X.XX%)               −Rp X,XXX,XXX  │
│  ─ BPJS Kesehatan (1%)              −Rp   XXX,XXX  │
│  ─ BPJS JHT (2%)                   −Rp   XXX,XXX  │
│  ─ BPJS JP (1%)                    −Rp   XXX,XXX  │
│  Total Deductions                   −Rp X,XXX,XXX  │
├──────────────────────────────────────────────────────┤
│  NET TAKE-HOME                         Rp XX,XXX,XXX │
├──────────────────────────────────────────────────────┤
│  EMPLOYER CONTRIBUTIONS (informational)              │
│  ─ BPJS Kesehatan (4%)               Rp X,XXX,XXX  │
│  ─ BPJS JHT (3.7%)                  Rp   XXX,XXX  │
│  ─ BPJS JP (2%)                     Rp   XXX,XXX  │
│  ─ BPJS JKK (0.24%)                 Rp    XX,XXX  │
│  ─ BPJS JKM (0.3%)                  Rp    XX,XXX  │
│  Total Cost to Company               Rp XX,XXX,XXX  │
└──────────────────────────────────────────────────────┘
```

- All amounts formatted as `Rp X.XXX.XXX` (Indonesian dot-separator)
- Negative values shown in red with `−` prefix
- Employer contributions shown as informational, not deducted from net
- PPh 21 row shows the applied TER rate inline (e.g., `PPh 21 (TER 5%)`)
- BPJS JP shows if salary was capped: `BPJS JP — 1% (cap Rp 9.559.600)`

---

## Assumptions & Constraints (Phase 1)

- Salary input is **fixed monthly gross** — no allowances, bonuses, or variable pay
- No December reconciliation for PPh 21
- JKK rate fixed at 0.24% (middle-risk category); variable risk not modeled
- NPWP status not modeled (no 20% PPh 21 surcharge for non-NPWP holders)
- No THR (holiday allowance) calculation
- Currency: IDR only
- All logic is stateless, client-side, no backend

---

## December Reconciliation (Implemented)

The app now models the December PPh 21 reconciliation required by PMK 168/2023:

**Formula:**
```
Biaya Jabatan = min(5% × annual gross, Rp 6,000,000)
Penghasilan Neto = annual gross − biaya jabatan − employee JHT − employee JP
PKP = max(0, penghasilan neto − PTKP), rounded down to nearest 1,000
PPh 21 Annual = applyProgressive(PKP, Pasal 17 brackets)
PPh 21 January–November = monthly TER rate × 11
PPh 21 December = PPh 21 Annual − PPh 21 January–November
```

**Pasal 17 Progressive Brackets (UU HPP 7/2021):**

| PKP (Annual, Rp) | Rate |
|---|---|
| 0 – 60,000,000 | 5% |
| 60,000,001 – 250,000,000 | 15% |
| 250,000,001 – 500,000,000 | 25% |
| 500,000,001 – 5,000,000,000 | 30% |
| > 5,000,000,000 | 35% |

**Annual View:**
- Gross Salary (annualized)
- PPh 21 Jan–Nov (TER × 11)
- PPh 21 December (reconciliation delta; may be negative/refund)
- PPh 21 Annual Total
- BPJS (annualized)
- Net Take-Home

**Example:** Gross Rp 10M/month, TK/0:
- Annual gross: Rp 120M
- Biaya jabatan: Rp 6M (capped)
- Employee JHT: Rp 480k
- Employee JP: Rp 1,147.152k (capped)
- Penghasilan neto: Rp 112.372.848k
- PTKP: Rp 54M
- PKP: Rp 58.372.000k (rounded)
- Progressive annual: Rp 2.918.600k
- TER Jan–Nov: Rp 200k × 11 = Rp 2.2M
- December: +Rp 718.600k (additional tax owed)

**BPJS Kesehatan treatment:** Employee contribution (1%) is **not deductible** for PPh 21 calculation per conservative DJP interpretation (Per-Dirjen PER-16/PJ/2016).

---

## THR (Tunjangan Hari Raya) — Implemented

The app now models **THR** (religious holiday allowance), required by Permenaker 6/2016.

**Regulation:**
- Employees with ≥12 months tenure: 1× monthly salary.
- Employees with <12 months tenure: (months_worked / 12) × 1 monthly salary.

**Tax treatment:**
- THR is subject to PPh 21 but **not** to BPJS (BPJS wage basis excludes non-recurring bonuses).
- PPh 21 on THR is calculated via the **marginal method** (per PMK 168/2023 intent for non-periodic income):
  - `pph21Thr = Pasal17(PKP_with_THR) − Pasal17(PKP_without_THR)`
  - This is the amount withheld at the time of THR payment.
  - `pph21December` covers **salary reconciliation only** = `Pasal17(PKP_without_THR) − pph21JanNov`
  - Total invariant: `pph21Annual = pph21JanNov + pph21December + pph21Thr`

**UI:**
- THR controls appear **only** in the annual view
- Checkbox: "Include THR"
- Type selector: Full (≥12 months) or Pro-rated (<12 months)
- When pro-rated: numeric input for months worked (1–11)

**Example:** Gross 10M/mo TK/0 with THR full:
- Annual gross: 120M + 10M = 130M
- Biaya jabatan: 6M (capped)
- Penghasilan neto, PKP, progressive annual tax all reflect the higher income
- PPh 21 Annual is ≈1.3M higher than without THR (due to progressive brackets)

---

## Out of Scope (Next Phases)

- **TER Lampiran B & C full transcription** — Category B and C brackets are interpolated for upper rates (27–29% in B; 26–29% in C) to avoid discontinuities. Full verbatim values from official PMK 168/2023 PDF deferred.
- **PTKP detail editing beyond status code**
- **NPWP vs non-NPWP surcharge** (20% surcharge for non-filers)
- **Variable JKK rates by industry** (currently fixed at 0.24%, low-risk tier)
- **Multi-component salary** (base + allowances, separate deductions)
- **Year-end bonuses beyond THR** (performance bonus, 13th month, etc.)
- **PDF export, save/share results**
