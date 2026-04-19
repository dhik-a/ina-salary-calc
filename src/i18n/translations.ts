export type Language = 'id' | 'en';

export type TranslationKey =
  // App
  | 'appTitle' | 'appSubtitle' | 'inputHeading' | 'breakdownHeading' | 'emptyState'
  // SalaryForm
  | 'grossSalaryLabel' | 'ptkpStatusLabel' | 'displayPeriodLabel'
  | 'includeThrLabel' | 'monthsWorkedLabel'
  // PeriodToggle
  | 'monthly' | 'annually'
  // ThrToggle
  | 'thrFull' | 'thrProrated'
  // Breakdown — gross section
  | 'grossSalaryAnnual' | 'thr' | 'totalAnnualGross' | 'grossSalary'
  // Breakdown — deductions
  | 'deductionsHeading'
  | 'pph21JanNov'
  | 'pph21December' | 'pph21AnnualTotal'
  | 'pph21Monthly'
  | 'bpjsKesehatan1' | 'bpjsJht2' | 'bpjsJp1'
  | 'jpCap'
  | 'totalDeductions' | 'netTakeHome'
  // Breakdown — employer
  | 'employerHeading'
  | 'bpjsKesehatan4' | 'bpjsJht37' | 'bpjsJp2' | 'bpjsJkk' | 'bpjsJkm'
  | 'totalCostToCompany'
  // Footer
  | 'disclaimerLabel' | 'disclaimerText1' | 'disclaimerBold' | 'disclaimerText2'
  | 'annualLabel' | 'annualText'
  | 'regulationsLabel'
  | 'regPmk168' | 'regPerpres64' | 'regPp44' | 'regPp45' | 'regPp46';

type Translations = Record<Language, Record<TranslationKey, string>>;

export const translations: Translations = {
  id: {
    appTitle: 'Kalkulator Gaji',
    appSubtitle: 'Kalkulator gaji bersih karyawan Indonesia',
    inputHeading: 'Masukan',
    breakdownHeading: 'Rincian',
    emptyState: 'Masukkan gaji bruto untuk melihat rincian',
    grossSalaryLabel: 'Gaji Bruto (Bulanan)',
    ptkpStatusLabel: 'Status PTKP',
    displayPeriodLabel: 'Periode Tampilan',
    includeThrLabel: 'Tambahkan THR (Tunjangan Hari Raya)',
    monthsWorkedLabel: 'Bulan bekerja (1–11)',
    monthly: 'Bulanan',
    annually: 'Tahunan',
    thrFull: 'Penuh (≥12 bulan)',
    thrProrated: 'Pro-rata (<12 bulan)',
    grossSalaryAnnual: 'Gaji Bruto (×12)',
    thr: 'THR',
    totalAnnualGross: 'Total Gaji Bruto Tahunan',
    grossSalary: 'Gaji Bruto',
    deductionsHeading: 'Potongan (Karyawan)',
    pph21JanNov: 'PPh 21 Jan–Nov (TER {rate}%)',
    pph21December: 'PPh 21 Desember (rekonsiliasi)',
    pph21AnnualTotal: 'Total PPh 21 Tahunan',
    pph21Monthly: 'PPh 21 (TER {rate}%)',
    bpjsKesehatan1: 'BPJS Kesehatan (1%)',
    bpjsJht2: 'BPJS JHT (2%)',
    bpjsJp1: 'BPJS JP (1%)',
    jpCap: ' (batas {cap})',
    totalDeductions: 'Total Potongan',
    netTakeHome: 'Gaji Bersih',
    employerHeading: 'Kontribusi Pemberi Kerja (Informasi)',
    bpjsKesehatan4: 'BPJS Kesehatan (4%)',
    bpjsJht37: 'BPJS JHT (3,7%)',
    bpjsJp2: 'BPJS JP (2%)',
    bpjsJkk: 'BPJS JKK (0,24%)',
    bpjsJkm: 'BPJS JKM (0,3%)',
    totalCostToCompany: 'Total Biaya Perusahaan',
    disclaimerLabel: 'Penafian:',
    disclaimerText1: 'Nilai tarif TER didasarkan pada pembacaan terbaik PMK 168/2023. Tarif pajak, PTKP, tarif BPJS, dan batas upah ',
    disclaimerBold: 'dapat berubah',
    disclaimerText2: ' seiring pembaruan peraturan Indonesia — selalu verifikasi dengan sumber resmi terbaru sebelum digunakan untuk keputusan penggajian. Alat ini hanya untuk tujuan informasi dan bukan merupakan nasihat pajak atau hukum.',
    annualLabel: 'Angka tahunan',
    annualText: ' mencakup rekonsiliasi Desember PMK 168/2023: PPh 21 Jan–Nov menggunakan tarif TER bulanan; Desember menunjukkan selisih antara pajak tahunan progresif Pasal 17 (atas PKP = bruto − biaya jabatan − JHT karyawan − JP karyawan − PTKP, dibulatkan ke bawah ke kelipatan Rp 1.000) dan total pemotongan TER Jan–Nov. Iuran BPJS Kesehatan karyawan diperlakukan tidak dapat dikurangkan untuk PPh 21 sesuai interpretasi konservatif DJP.',
    regulationsLabel: 'Peraturan yang dirujuk:',
    regPmk168: 'Metode TER PPh 21',
    regPerpres64: 'BPJS Kesehatan',
    regPp44: 'JKK & JKM',
    regPp45: 'Jaminan Pensiun (JP)',
    regPp46: 'Jaminan Hari Tua (JHT)',
  },
  en: {
    appTitle: 'Salary Calculator',
    appSubtitle: 'Indonesian net salary calculator',
    inputHeading: 'Input',
    breakdownHeading: 'Breakdown',
    emptyState: 'Enter a gross salary to see the breakdown',
    grossSalaryLabel: 'Gross Salary (Monthly)',
    ptkpStatusLabel: 'PTKP Status',
    displayPeriodLabel: 'Display Period',
    includeThrLabel: 'Include THR (religious holiday allowance)',
    monthsWorkedLabel: 'Months worked (1–11)',
    monthly: 'Monthly',
    annually: 'Annually',
    thrFull: 'Full (≥12 months)',
    thrProrated: 'Pro-rated (<12 months)',
    grossSalaryAnnual: 'Gross Salary (×12)',
    thr: 'THR',
    totalAnnualGross: 'Total Annual Gross',
    grossSalary: 'Gross Salary',
    deductionsHeading: 'Deductions (Employee)',
    pph21JanNov: 'PPh 21 Jan–Nov (TER {rate}%)',
    pph21December: 'PPh 21 December (reconciliation)',
    pph21AnnualTotal: 'PPh 21 Annual Total',
    pph21Monthly: 'PPh 21 (TER {rate}%)',
    bpjsKesehatan1: 'BPJS Kesehatan (1%)',
    bpjsJht2: 'BPJS JHT (2%)',
    bpjsJp1: 'BPJS JP (1%)',
    jpCap: ' (cap {cap})',
    totalDeductions: 'Total Deductions',
    netTakeHome: 'Net Take-Home',
    employerHeading: 'Employer Contributions (Informational)',
    bpjsKesehatan4: 'BPJS Kesehatan (4%)',
    bpjsJht37: 'BPJS JHT (3.7%)',
    bpjsJp2: 'BPJS JP (2%)',
    bpjsJkk: 'BPJS JKK (0.24%)',
    bpjsJkm: 'BPJS JKM (0.3%)',
    totalCostToCompany: 'Total Cost to Company',
    disclaimerLabel: 'Disclaimer:',
    disclaimerText1: 'TER bracket values are based on a best-effort reading of PMK 168/2023. Tax rates, PTKP amounts, BPJS rates, and wage caps are ',
    disclaimerBold: 'subject to change',
    disclaimerText2: ' as Indonesian regulations are updated — always verify against the latest official sources before using for payroll decisions. This tool is for informational purposes only and does not constitute tax or legal advice.',
    annualLabel: 'Annual figures',
    annualText: ' include the PMK 168/2023 December reconciliation: Jan–Nov PPh 21 uses the monthly TER rate; December shows the difference between the progressive Pasal 17 annual tax (on PKP = gross − biaya jabatan − JHT employee − JP employee − PTKP, rounded down to the nearest Rp 1,000) and the sum of Jan–Nov TER withholdings. BPJS Kesehatan employee contribution is treated as non-deductible for PPh 21 per the conservative DJP interpretation.',
    regulationsLabel: 'Regulations referenced:',
    regPmk168: 'PPh 21 TER method',
    regPerpres64: 'BPJS Kesehatan',
    regPp44: 'JKK & JKM',
    regPp45: 'Jaminan Pensiun (JP)',
    regPp46: 'Jaminan Hari Tua (JHT)',
  },
};
