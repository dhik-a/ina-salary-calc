import type { Language } from '../i18n/translations';

interface LanguageToggleProps {
  value: Language;
  onChange: (lang: Language) => void;
}

export function LanguageToggle({ value, onChange }: LanguageToggleProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange('id')}
        className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
          value === 'id'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Indonesia
      </button>
      <button
        onClick={() => onChange('en')}
        className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
          value === 'en'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        English
      </button>
    </div>
  );
}
