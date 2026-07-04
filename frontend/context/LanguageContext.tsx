"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { t as translate, type DictionaryKey } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: DictionaryKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, t: (key) => translate(lang, key) }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
