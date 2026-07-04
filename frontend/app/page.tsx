"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Header } from "@/components/Header";
import { SiteCard } from "@/components/SiteCard";
import { ToranaDivider } from "@/components/ToranaDivider";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import { DEMO_CATEGORIES, DEMO_PROVINCES, DEMO_SITES } from "@/lib/demoData";
import type { SiteFilters, SiteListItem, Taxonomy } from "@/lib/types";

// Leaflet touches window/document at import time — must load client-only.
const MapView = dynamic(() => import("@/components/MapView").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-stone/10 text-sm text-stone">
      Loading map…
    </div>
  ),
});

export default function HomePage() {
  const { t } = useLanguage();

  const [provinces, setProvinces] = useState<Taxonomy[]>(DEMO_PROVINCES);
  const [categories, setCategories] = useState<Taxonomy[]>(DEMO_CATEGORIES);
  const [sites, setSites] = useState<SiteListItem[]>(DEMO_SITES);
  const [filters, setFilters] = useState<SiteFilters>({});
  const [usingDemoData, setUsingDemoData] = useState(true);

  useEffect(() => {
    Promise.all([api.listProvinces(), api.listCategories(), api.listSites()])
      .then(([p, c, s]) => {
        setProvinces(p);
        setCategories(c);
        setSites(s);
        setUsingDemoData(false);
      })
      .catch(() => {
        // Backend not running yet — keep demo data so the page still works.
        setUsingDemoData(true);
      });
  }, []);

  useEffect(() => {
    if (usingDemoData) return; // filtering demo data server-side isn't wired up
    api.listSites(filters).then(setSites).catch(() => {});
  }, [filters, usingDemoData]);

  const filteredDemoSites = useMemo(() => {
    if (!usingDemoData) return sites;
    return DEMO_SITES.filter((site) => {
      if (filters.province && site.province.slug !== filters.province) return false;
      if (filters.category && site.category.slug !== filters.category) return false;
      if (filters.unesco_status && site.unesco_status !== filters.unesco_status) return false;
      if (filters.q && !site.name_en.toLowerCase().includes(filters.q.toLowerCase())) return false;
      return true;
    });
  }, [usingDemoData, sites, filters]);

  function handleSearchNearMe() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      setFilters((prev) => ({
        ...prev,
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        radius_km: prev.radius_km ?? 25,
      }));
    });
  }

  return (
    <main className="min-h-screen bg-paper">
      <Header />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <p className="font-data text-xs uppercase tracking-widest text-maroon">{t("tagline")}</p>
        <h1 className="mt-2 max-w-2xl font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          {t("heading")}
        </h1>
        <p className="mt-4 max-w-xl text-ink/70">{t("subheading")}</p>
        {usingDemoData && (
          <p className="mt-4 max-w-xl rounded-sm border border-marigold/60 bg-marigold/10 px-3 py-2 text-sm text-ink/80">
            Showing sample sites — start the FastAPI backend to load real data.
          </p>
        )}
      </section>

      <ToranaDivider className="text-stone/50" />

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-10 lg:grid-cols-[280px_1fr]">
        <FilterSidebar
          provinces={provinces}
          categories={categories}
          filters={filters}
          onChange={setFilters}
          onSearchNearMe={handleSearchNearMe}
        />
        <div className="h-[420px] overflow-hidden rounded-sm border border-stone/30">
          <MapView sites={usingDemoData ? filteredDemoSites : sites} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        {filteredDemoSites.length === 0 ? (
          <p className="text-stone">{t("noResults")}</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(usingDemoData ? filteredDemoSites : sites).map((site) => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
