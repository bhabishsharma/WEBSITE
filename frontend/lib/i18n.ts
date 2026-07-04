import type { Lang } from "./types";

export const dictionary = {
  en: {
    tagline: "7 provinces. 1 lens.",
    heading: "Every temple, stupa, and palace square Nepal has to offer.",
    subheading:
      "A living map of Nepal's heritage sites — official photo galleries, community-submitted images, and the stories behind each place.",
    searchNearMe: "Search near me",
    browseMap: "Browse the map",
    filters: "Filters",
    province: "Province",
    category: "Category",
    unescoStatus: "UNESCO status",
    allProvinces: "All provinces",
    allCategories: "All categories",
    anyStatus: "Any status",
    searchPlaceholder: "Search a site by name…",
    unesco_world_heritage: "World Heritage",
    unesco_tentative: "Tentative list",
    unesco_none: "Not listed",
    signIn: "Sign in",
    submitASite: "Submit a site",
    noResults: "No sites match these filters yet.",
    distanceAway: "km away",
    establishedIn: "Established",
    viewDetails: "View details",
  },
  np: {
    tagline: "७ प्रदेश। एक झलक।",
    heading: "नेपालका हरेक मन्दिर, स्तूप र दरबार क्षेत्रहरू।",
    subheading:
      "नेपालका सम्पदा स्थलहरूको जीवित नक्सा — आधिकारिक फोटो ग्यालरी, सामुदायिक तस्बिरहरू, र प्रत्येक स्थानको कथा।",
    searchNearMe: "नजिकैका स्थान खोज्नुहोस्",
    browseMap: "नक्सा हेर्नुहोस्",
    filters: "फिल्टरहरू",
    province: "प्रदेश",
    category: "श्रेणी",
    unescoStatus: "युनेस्को स्थिति",
    allProvinces: "सबै प्रदेश",
    allCategories: "सबै श्रेणी",
    anyStatus: "कुनै पनि स्थिति",
    searchPlaceholder: "नाम अनुसार खोज्नुहोस्…",
    unesco_world_heritage: "विश्व सम्पदा",
    unesco_tentative: "प्रस्तावित सूची",
    unesco_none: "सूचीकृत छैन",
    signIn: "साइन इन",
    submitASite: "स्थान पेश गर्नुहोस्",
    noResults: "यी फिल्टरसँग मिल्ने कुनै स्थान भेटिएन।",
    distanceAway: "कि.मि. टाढा",
    establishedIn: "स्थापना",
    viewDetails: "विवरण हेर्नुहोस्",
  },
} as const;

export type DictionaryKey = keyof typeof dictionary.en;

export function t(lang: Lang, key: DictionaryKey): string {
  return dictionary[lang][key] ?? dictionary.en[key];
}
