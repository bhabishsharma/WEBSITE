import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { DEMO_SITES } from "@/lib/demoData";
import type { SiteDetail } from "@/lib/types";

interface PageProps {
  params: { slug: string };
}

async function getSite(slug: string): Promise<SiteDetail | null> {
  try {
    return await api.getSite(slug);
  } catch {
    // Backend not running — fall back to demo data for local development.
    const demo = DEMO_SITES.find((s) => s.slug === slug);
    if (!demo) return null;
    return {
      ...demo,
      description_en: "Full description will load once the backend is connected.",
      description_np: "ब्याकइन्ड जडान भएपछि पूर्ण विवरण देखा पर्नेछ।",
      address: null,
      established_year: null,
      is_published: true,
    };
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const site = await getSite(params.slug);
  if (!site) return {};
  return {
    title: `${site.name_en} — Heritage Lens`,
    description: site.description_en.slice(0, 160),
  };
}

export default async function SiteDetailPage({ params }: PageProps) {
  const site = await getSite(params.slug);
  if (!site) notFound();

  // Schema.org structured data — helps search engines surface this as a
  // landmark with coordinates, not just a generic article.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LandmarksOrHistoricalBuildings",
    name: site.name_en,
    alternateName: site.name_np,
    description: site.description_en,
    address: site.address ?? undefined,
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.location.lat,
      longitude: site.location.lng,
    },
    ...(site.unesco_status === "world_heritage" && {
      isPartOf: {
        "@type": "Organization",
        name: "UNESCO World Heritage Site",
      },
    }),
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <p className="font-data text-xs uppercase tracking-widest text-maroon">
        {site.category.name_en} · {site.province.name_en}
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-ink">{site.name_en}</h1>
      <p className="mt-1 font-display text-xl text-ink/60">{site.name_np}</p>

      {site.unesco_status !== "none" && (
        <span className="mt-4 inline-block rounded-sm bg-marigold px-3 py-1 text-sm font-medium text-ink">
          {site.unesco_status === "world_heritage" ? "UNESCO World Heritage Site" : "UNESCO Tentative List"}
        </span>
      )}

      <p className="mt-6 leading-relaxed text-ink/80">{site.description_en}</p>

      {site.established_year && (
        <p className="mt-4 font-data text-sm text-stone">Established {site.established_year}</p>
      )}

      <div className="mt-10 border-t border-stone/30 pt-6">
        <p className="text-sm text-stone">
          Photo gallery, moderation queue, and "near me" navigation wire up once this page is
          connected to the live FastAPI backend and photo storage provider.
        </p>
      </div>
    </main>
  );
}
