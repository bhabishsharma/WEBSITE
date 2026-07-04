import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import type { SiteListItem } from "@/lib/types";

const UNESCO_LABEL_KEY = {
  world_heritage: "unesco_world_heritage",
  tentative: "unesco_tentative",
  none: "unesco_none",
} as const;

export function SiteCard({ site }: { site: SiteListItem }) {
  const { lang, t } = useLanguage();

  return (
    <a
      href={`/sites/${site.slug}`}
      className="group flex flex-col overflow-hidden border border-stone/30 bg-paper transition-transform hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative h-40 w-full bg-stone/20">
        {site.cover_photo_url ? (
          <Image
            src={site.cover_photo_url}
            alt={lang === "np" ? site.name_np : site.name_en}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone">
            {t("viewDetails")}
          </div>
        )}
        {site.unesco_status !== "none" && (
          <span className="absolute right-2 top-2 rounded-sm bg-marigold px-2 py-0.5 text-xs font-medium text-ink">
            {t(UNESCO_LABEL_KEY[site.unesco_status])}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-display text-base font-semibold text-ink group-hover:text-maroon">
          {lang === "np" ? site.name_np : site.name_en}
        </h3>
        <p className="font-data text-xs text-stone">
          {lang === "np" ? site.category.name_np : site.category.name_en} ·{" "}
          {lang === "np" ? site.province.name_np : site.province.name_en}
        </p>
        {site.distance_km !== null && (
          <p className="font-data text-xs text-prayer">
            {site.distance_km} {t("distanceAway")}
          </p>
        )}
      </div>
    </a>
  );
}
