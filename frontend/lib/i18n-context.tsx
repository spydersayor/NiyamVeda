'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations, SupportedLanguage, Translations } from './translations';

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: keyof Translations) => string;
}

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => translations.en[key] || '',
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('niyamveda_lang') as SupportedLanguage | null;
      if (stored && (stored === 'en' || stored === 'hi' || stored === 'bn')) {
        setLanguageState(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('niyamveda_lang', lang);
    } catch {
      // ignore
    }
  };

  const t = (key: keyof Translations): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || '';
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
