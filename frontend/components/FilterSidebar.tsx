"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { SiteFilters, Taxonomy, UnescoStatus } from "@/lib/types";

interface Props {
  provinces: Taxonomy[];
  categories: Taxonomy[];
  filters: SiteFilters;
  onChange: (filters: SiteFilters) => void;
  onSearchNearMe: () => void;
}

const UNESCO_OPTIONS: UnescoStatus[] = ["world_heritage", "tentative", "none"];

export function FilterSidebar({ provinces, categories, filters, onChange, onSearchNearMe }: Props) {
  const { lang, t } = useLanguage();

  return (
    <aside className="flex flex-col gap-5 border border-stone/30 bg-paper/60 p-5">
      <h2 className="font-display text-lg font-semibold text-ink">{t("filters")}</h2>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink/80">{t("province")}</span>
        <select
          value={filters.province ?? ""}
          onChange={(e) => onChange({ ...filters, province: e.target.value || undefined })}
          className="rounded-sm border border-stone/40 bg-paper px-2.5 py-1.5 text-ink focus:border-prayer focus:outline-none"
        >
          <option value="">{t("allProvinces")}</option>
          {provinces.map((p) => (
            <option key={p.id} value={p.slug}>
              {lang === "np" ? p.name_np : p.name_en}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink/80">{t("category")}</span>
        <select
          value={filters.category ?? ""}
          onChange={(e) => onChange({ ...filters, category: e.target.value || undefined })}
          className="rounded-sm border border-stone/40 bg-paper px-2.5 py-1.5 text-ink focus:border-prayer focus:outline-none"
        >
          <option value="">{t("allCategories")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {lang === "np" ? c.name_np : c.name_en}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink/80">{t("unescoStatus")}</span>
        <select
          value={filters.unesco_status ?? ""}
          onChange={(e) =>
            onChange({ ...filters, unesco_status: (e.target.value || undefined) as UnescoStatus })
          }
          className="rounded-sm border border-stone/40 bg-paper px-2.5 py-1.5 text-ink focus:border-prayer focus:outline-none"
        >
          <option value="">{t("anyStatus")}</option>
          {UNESCO_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {t(`unesco_${status}` as const)}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink/80">{t("searchPlaceholder")}</span>
        <input
          type="text"
          value={filters.q ?? ""}
          onChange={(e) => onChange({ ...filters, q: e.target.value || undefined })}
          placeholder={t("searchPlaceholder")}
          className="rounded-sm border border-stone/40 bg-paper px-2.5 py-1.5 text-ink placeholder:text-stone focus:border-prayer focus:outline-none"
        />
      </label>

      <button
        type="button"
        onClick={onSearchNearMe}
        className="rounded-sm bg-prayer px-3.5 py-2 text-sm font-medium text-paper hover:bg-prayer/90"
      >
        {t("searchNearMe")}
      </button>
    </aside>
  );
}
