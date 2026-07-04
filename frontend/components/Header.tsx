"use client";

import { useLanguage } from "@/context/LanguageContext";
import { LanguageToggle } from "./LanguageToggle";
import { ToranaDivider } from "./ToranaDivider";

export function Header() {
  const { t } = useLanguage();

  return (
    <header>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="font-display text-xl font-semibold tracking-tight text-ink">
          Heritage Lens
        </a>
        <nav className="flex items-center gap-4">
          <LanguageToggle />
          <a
            href="/submit"
            className="hidden text-sm text-prayer hover:underline sm:inline"
          >
            {t("submitASite")}
          </a>
          <a
            href="/login"
            className="rounded-sm bg-maroon px-3.5 py-1.5 text-sm font-medium text-paper hover:bg-maroon/90"
          >
            {t("signIn")}
          </a>
        </nav>
      </div>
      <ToranaDivider className="text-maroon/70" />
    </header>
  );
}
