import type { SiteDetail, SiteFilters, SiteListItem, Taxonomy } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API error ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

function toQueryString(filters: SiteFilters = {}): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const api = {
  listSites: (filters?: SiteFilters) => apiFetch<SiteListItem[]>(`/sites${toQueryString(filters)}`),

  getSite: (slug: string) => apiFetch<SiteDetail>(`/sites/${slug}`),

  listProvinces: () => apiFetch<Taxonomy[]>("/provinces"),

  listCategories: () => apiFetch<Taxonomy[]>("/categories"),

  submitSite: (payload: unknown, token: string) =>
    apiFetch<SiteDetail>("/sites", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }),
};
