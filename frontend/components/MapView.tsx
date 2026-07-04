"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { SiteListItem } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";

// Leaflet's default marker icons reference image paths that don't resolve
// under Next.js's bundler — rebuild the icon from the CDN instead of relying
// on the package's bundled assets.
const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const NEPAL_CENTER: [number, number] = [28.3949, 84.124];

export function MapView({ sites }: { sites: SiteListItem[] }) {
  const { lang, t } = useLanguage();

  return (
    <MapContainer
      center={NEPAL_CENTER}
      zoom={7}
      scrollWheelZoom
      className="h-full w-full rounded-sm"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {sites.map((site) => (
        <Marker
          key={site.id}
          position={[site.location.lat, site.location.lng]}
          icon={markerIcon}
        >
          <Popup>
            <div className="font-body">
              <p className="font-display font-semibold text-ink">
                {lang === "np" ? site.name_np : site.name_en}
              </p>
              <p className="text-xs text-stone">
                {site.category.name_en} · {site.province.name_en}
              </p>
              <a
                href={`/sites/${site.slug}`}
                className="mt-1 inline-block text-xs text-prayer hover:underline"
              >
                {t("viewDetails")}
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
