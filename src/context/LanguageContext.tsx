"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import ru from "@/locales/ru.json";
import en from "@/locales/en.json";
import kk from "@/locales/kk.json";
import sr from "@/locales/sr.json";

export type Lang = "ru" | "en" | "kk" | "sr";

const translations: Record<Lang, Record<string, unknown>> = { ru, en, kk, sr };

const LANG_KEY = "navigator-lang";

function getNestedValue(obj: unknown, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");
  const langRef = useRef<Lang>("ru");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === "ru" || saved === "en" || saved === "kk" || saved === "sr") {
        setLangState(saved);
        langRef.current = saved;
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    langRef.current = l;
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const dict = translations[langRef.current] ?? translations.ru;
      let value = getNestedValue(dict, key);
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          value = value.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), String(v));
        }
      }
      return value;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang]
  );

  const value = useRef<LanguageContextValue>({ lang, setLang, t });
  value.current = { lang, setLang, t };

  return (
    <LanguageContext.Provider value={value.current}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
