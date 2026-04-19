import { useContext } from 'react';
import { LanguageContext } from './LanguageContext';
import { translations } from './translations';
import type { TranslationKey } from './translations';

export function useLang() {
  const { lang, setLang } = useContext(LanguageContext);

  function t(key: TranslationKey, replacements?: Record<string, string>): string {
    let str = translations[lang][key];
    if (replacements) {
      for (const [k, v] of Object.entries(replacements)) {
        str = str.replace(`{${k}}`, v);
      }
    }
    return str;
  }

  return { t, lang, setLang };
}
