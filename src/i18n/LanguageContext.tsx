import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Language } from './translations';

interface LanguageContextValue {
  lang: Language;
  setLang: (l: Language) => void;
}

export const LanguageContext = createContext<LanguageContextValue>({
  lang: 'id',
  setLang: () => {},
});

const STORAGE_KEY = 'lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() =>
    localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'id'
  );

  const setLang = (l: Language) => {
    localStorage.setItem(STORAGE_KEY, l);
    setLangState(l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}
