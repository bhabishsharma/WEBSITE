import type { Config } from "tailwindcss";

// Design tokens for Heritage Lens.
// Palette is grounded in Kathmandu Valley heritage materials, not a generic
// AI-default cream+terracotta pairing: carved grey stone, oxide-red pagoda
// wood, marigold garlands, and prayer-flag blue.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#22282B", // stone-charcoal — primary text & dark surfaces
        paper: "#EFE9DC", // weathered plaster — page background
        marigold: "#E2A63B", // marigold garland — primary accent / CTAs
        maroon: "#7A3B34", // oxidized pagoda wood/brick — secondary accent
        prayer: "#2F5D62", // prayer-flag blue-teal — links, cool counterpoint
        stone: "#A79C87", // muted borders & secondary text
      },
      fontFamily: {
        display: ["Fraunces", "Noto Serif Devanagari", "serif"],
        body: ["Noto Sans", "Noto Sans Devanagari", "sans-serif"],
        data: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        sm: "2px", // deliberately tight — this is carved-stone/wood, not soft SaaS
      },
    },
  },
  plugins: [],
};

export default config;
