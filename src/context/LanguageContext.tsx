"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import ru from '@/locales/ru.json';
import en from '@/locales/en.json';
import kk from '@/locales/kk.json';
import sr from '@/locales/sr.json';

export type Lang = 'ru' | 'en' | 'kk' | 'sr';

const translations: Record<Lang, Record<string, string>> = { ru, en, kk, sr };

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>('ru');

  useEffect(() => {
    const stored = localStorage.getItem('language') as Lang;
    if (stored && translations[stored]) {
      setLangState(stored);
    }
  }, []);

  const t = useMemo(() => {
    return (key: string, params?: Record<string, string | number>): string => {
      let text = translations[lang]?.[key] || key;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        });
      }
      return text;
    };
  }, [lang]);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
