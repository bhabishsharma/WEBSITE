"use client";

import { useLanguage } from "@/context/LanguageContext";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="inline-flex items-center rounded-sm border border-stone/40 text-sm font-data">
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`px-2.5 py-1 transition-colors ${
          lang === "en" ? "bg-ink text-paper" : "text-ink/70 hover:text-ink"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("np")}
        aria-pressed={lang === "np"}
        className={`px-2.5 py-1 transition-colors ${
          lang === "np" ? "bg-ink text-paper" : "text-ink/70 hover:text-ink"
        }`}
      >
        नेपा
      </button>
    </div>
  );
}
