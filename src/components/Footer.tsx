import { useLang } from '../i18n/useLang';

interface RegulationLink {
  labelKey: 'regPmk168' | 'regPerpres64' | 'regPp44' | 'regPp45' | 'regPp46';
  label: string;
  url: string;
}

const REGULATIONS: RegulationLink[] = [
  {
    labelKey: 'regPmk168',
    label: 'PMK 168/2023',
    url: 'https://peraturan.bpk.go.id/Details/276089/pmk-no-168-tahun-2023',
  },
  {
    labelKey: 'regPerpres64',
    label: 'Perpres 64/2020',
    url: 'https://peraturan.bpk.go.id/Details/135972/perpres-no-64-tahun-2020',
  },
  {
    labelKey: 'regPp44',
    label: 'PP 44/2015',
    url: 'https://peraturan.bpk.go.id/Details/5709/pp-no-44-tahun-2015',
  },
  {
    labelKey: 'regPp45',
    label: 'PP 45/2015',
    url: 'https://peraturan.bpk.go.id/Details/5710/pp-no-45-tahun-2015',
  },
  {
    labelKey: 'regPp46',
    label: 'PP 46/2015',
    url: 'https://peraturan.bpk.go.id/Details/5711/pp-no-46-tahun-2015',
  },
];

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="max-w-2xl mx-auto mt-6 text-xs text-gray-500 space-y-3 px-2">
      <p className="leading-relaxed">
        <span className="font-semibold text-gray-700">{t('disclaimerLabel')}</span>{' '}
        {t('disclaimerText1')}
        <span className="font-semibold">{t('disclaimerBold')}</span>
        {t('disclaimerText2')}
      </p>
      <p className="leading-relaxed">
        <span className="font-semibold text-gray-700">{t('annualLabel')}</span>
        {t('annualText')}
      </p>
      <div>
        <div className="font-semibold text-gray-700 mb-1">{t('regulationsLabel')}</div>
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
              <span>{t(reg.labelKey)}</span>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
