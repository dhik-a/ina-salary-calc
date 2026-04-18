interface RegulationLink {
  label: string;
  url: string;
  description: string;
}

const REGULATIONS: RegulationLink[] = [
  {
    label: 'PMK 168/2023',
    url: 'https://peraturan.bpk.go.id/Details/276089/pmk-no-168-tahun-2023',
    description: 'PPh 21 TER method',
  },
  {
    label: 'Perpres 64/2020',
    url: 'https://peraturan.bpk.go.id/Details/135972/perpres-no-64-tahun-2020',
    description: 'BPJS Kesehatan',
  },
  {
    label: 'PP 44/2015',
    url: 'https://peraturan.bpk.go.id/Details/5709/pp-no-44-tahun-2015',
    description: 'JKK & JKM',
  },
  {
    label: 'PP 45/2015',
    url: 'https://peraturan.bpk.go.id/Details/5710/pp-no-45-tahun-2015',
    description: 'Jaminan Pensiun (JP)',
  },
  {
    label: 'PP 46/2015',
    url: 'https://peraturan.bpk.go.id/Details/5711/pp-no-46-tahun-2015',
    description: 'Jaminan Hari Tua (JHT)',
  },
];

export function Footer() {
  return (
    <footer className="max-w-2xl mx-auto mt-6 text-xs text-gray-500 space-y-3 px-2">
      <p className="leading-relaxed">
        <span className="font-semibold text-gray-700">Disclaimer:</span> TER bracket values
        are based on a best-effort reading of PMK 168/2023. Tax rates, PTKP amounts, BPJS
        rates, and wage caps are <span className="font-semibold">subject to change</span> as
        Indonesian regulations are updated — always verify against the latest official sources
        before using for payroll decisions. This tool is for informational purposes only and
        does not constitute tax or legal advice.
      </p>
      <p className="leading-relaxed">
        <span className="font-semibold text-gray-700">Annual figures</span> are monthly × 12.
        The <span className="font-semibold">December reconciliation</span> required by PMK
        168/2023 (annual progressive Pasal 17 tax on PKP after biaya jabatan and PTKP, minus
        Jan–Nov TER withholdings) is not modeled — actual year-end PPh 21 may differ from
        the displayed figure.
      </p>
      <div>
        <div className="font-semibold text-gray-700 mb-1">Regulations referenced:</div>
        <ul className="space-y-1">
          {REGULATIONS.map((reg) => (
            <li key={reg.label}>
              <a
                href={reg.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {reg.label}
              </a>
              {' — '}
              <span>{reg.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
