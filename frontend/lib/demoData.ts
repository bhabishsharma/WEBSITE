import type { SiteListItem, Taxonomy } from "./types";

// Fallback data only — shown if the FastAPI backend isn't reachable yet, so
// `npm run dev` on the frontend alone still demonstrates the real layout.
// Safe to delete once /sites, /provinces, /categories are live.

const bagmati: Taxonomy = { id: "p1", name_en: "Bagmati", name_np: "बागमती", slug: "bagmati" };
const lumbiniProvince: Taxonomy = {
  id: "p2",
  name_en: "Lumbini",
  name_np: "लुम्बिनी",
  slug: "lumbini",
};

const temple: Taxonomy = { id: "c1", name_en: "Temple", name_np: "मन्दिर", slug: "temple" };
const stupa: Taxonomy = { id: "c2", name_en: "Stupa", name_np: "स्तूप", slug: "stupa" };
const palaceSquare: Taxonomy = {
  id: "c3",
  name_en: "Palace Square",
  name_np: "दरबार क्षेत्र",
  slug: "palace-square",
};

export const DEMO_PROVINCES: Taxonomy[] = [bagmati, lumbiniProvince];
export const DEMO_CATEGORIES: Taxonomy[] = [temple, stupa, palaceSquare];

export const DEMO_SITES: SiteListItem[] = [
  {
    id: "s1",
    slug: "pashupatinath-temple",
    name_en: "Pashupatinath Temple",
    name_np: "पशुपतिनाथ मन्दिर",
    province: bagmati,
    category: temple,
    unesco_status: "world_heritage",
    location: { lat: 27.7106, lng: 85.3487 },
    cover_photo_url: null,
    distance_km: null,
  },
  {
    id: "s2",
    slug: "swayambhunath",
    name_en: "Swayambhunath",
    name_np: "स्वयम्भूनाथ",
    province: bagmati,
    category: stupa,
    unesco_status: "world_heritage",
    location: { lat: 27.7149, lng: 85.2903 },
    cover_photo_url: null,
    distance_km: null,
  },
  {
    id: "s3",
    slug: "bhaktapur-durbar-square",
    name_en: "Bhaktapur Durbar Square",
    name_np: "भक्तपुर दरबार क्षेत्र",
    province: bagmati,
    category: palaceSquare,
    unesco_status: "world_heritage",
    location: { lat: 27.672, lng: 85.4298 },
    cover_photo_url: null,
    distance_km: null,
  },
  {
    id: "s4",
    slug: "lumbini-sacred-garden",
    name_en: "Lumbini Sacred Garden",
    name_np: "लुम्बिनी पवित्र बगैंचा",
    province: lumbiniProvince,
    category: stupa,
    unesco_status: "world_heritage",
    location: { lat: 27.4833, lng: 83.2767 },
    cover_photo_url: null,
    distance_km: null,
  },
];
