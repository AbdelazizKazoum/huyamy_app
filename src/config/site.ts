import { Language } from "@/types";

type SiteConfig = {
  name: string;
  brandName: string;
  title: {
    [key in Language]: string;
  };
  titleTemplate: string;
  description: {
    [key in Language]: string;
  };
  niche: {
    [key in Language]: string;
  };
  url: string;
  baseUrl: string;
  logo: string;
  ogImage: string;
  keywords: {
    [key in Language]: string[];
  };
  themeColor: string;
  contact: {
    email: string;
    whatsapp: string;
    phone: string;
  };
  social: {
    twitter: string;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  i18n: {
    locales: Language[];
    defaultLocale: Language;
  };
  authors: { name: string; url?: string }[];
  creator: string;
  publisher: string;
  location: string;
  locationCoordinates?: {
    lat: number;
    lng: number;
  };
  manifest: string;
  verification: {
    google?: string;
  };
  category: string;
  currencies: {
    [key in Language]: string;
  };
};

export const siteConfig: SiteConfig = {
  name: "MY GLASS",
  brandName: "MY GLASS",
  title: {
    ar: "MY GLASS - نظارات شمسية، طبية، رياضية وأكثر",
    fr: "MY GLASS - Lunettes de soleil, médicales, sport et plus",
  },
  titleTemplate: "%s | MY GLASS - Lunettes de soleil, médicales & sport",
  description: {
    ar: "اكتشف أفضل تشكيلة من النظارات الشمسية، الطبية، الرياضية وأكثر في MY GLASS. جودة عالية وأسعار مناسبة.",
    fr: "Découvrez la meilleure sélection de lunettes de soleil, médicales, sport et plus chez MY GLASS. Qualité supérieure et prix abordables.",
  },
  niche: {
    ar: "نظارات شمسية وطبية ورياضية",
    fr: "Lunettes de soleil, médicales et sport",
  },
  url: "https://mpyglass.com",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://mpyglass.com",
  logo: "/images/logo.png",
  ogImage: "/images/logo.png",
  keywords: {
    ar: [
      "نظارات شمسية",
      "نظارات طبية",
      "نظارات رياضية",
      "إطارات نظارات",
      "عدسات",
      "شون أوبتيكال",
      "نظارات أصلية",
      "موضة النظارات",
      "حماية العين",
      "نظارات للرجال",
      "نظارات للنساء",
      "نظارات للأطفال",
      "عدسات طبية",
      "عدسات شمسية",
      "اكسسوارات النظارات",
    ],
    fr: [
      "lunettes de soleil",
      "lunettes médicales",
      "lunettes de sport",
      "montures",
      "verres",
      "Shawn Optical",
      "lunettes originales",
      "mode lunettes",
      "protection des yeux",
      "lunettes homme",
      "lunettes femme",
      "lunettes enfant",
      "verres médicaux",
      "verres solaires",
      "accessoires lunettes",
    ],
  },
  themeColor: "#2563eb",
  contact: {
    email: "contact@shawnoptical.com",
    whatsapp: "+212600000000",
    phone: "+212600000000",
  },
  social: {
    twitter: "@shawnoptical",
  },
  socialLinks: {
    facebook: "https://facebook.com/myglass",
    instagram: "https://instagram.com/myglass",
    twitter: "https://twitter.com/myglass",
  },
  i18n: {
    locales: ["ar", "fr"],
    defaultLocale: "ar",
  },
  authors: [{ name: "Shawn Optical" }],
  creator: "Shawn Optical",
  publisher: "Shawn Optical",
  location: "Casablanca, Morocco",
  locationCoordinates: {
    lat: 33.57311,
    lng: -7.589843,
  },
  manifest: "/manifest.json",
  verification: {
    google: "your-google-verification-code",
  },
  category: "e-commerce",
  currencies: {
    ar: "د.م.",
    fr: "MAD",
  },
};
