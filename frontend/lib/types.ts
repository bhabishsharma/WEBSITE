export type Lang = "en" | "np";

export type UnescoStatus = "none" | "tentative" | "world_heritage";

export interface Taxonomy {
  id: string;
  name_en: string;
  name_np: string;
  slug: string;
}

export interface Point {
  lat: number;
  lng: number;
}

export interface SiteListItem {
  id: string;
  slug: string;
  name_en: string;
  name_np: string;
  province: Taxonomy;
  category: Taxonomy;
  unesco_status: UnescoStatus;
  location: Point;
  cover_photo_url: string | null;
  distance_km: number | null;
}

export interface SiteDetail extends SiteListItem {
  description_en: string;
  description_np: string;
  address: string | null;
  established_year: number | null;
  is_published: boolean;
}

export interface Photo {
  id: string;
  site_id: string;
  url: string;
  caption_en: string | null;
  caption_np: string | null;
  source: "official" | "user";
  status: "pending" | "approved" | "rejected";
  is_cover: boolean;
  uploaded_by: string | null;
}

export interface SiteFilters {
  province?: string;
  category?: string;
  unesco_status?: UnescoStatus;
  q?: string;
  lat?: number;
  lng?: number;
  radius_km?: number;
}
