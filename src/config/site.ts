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
  name: "Huyamy",
  brandName: "Huyamy",
  title: {
    ar: "هيوامي - زيت الأرغان العضوي والعسل الطبيعي ومنتجات الجمال المغربية",
    fr: "Huyamy - Huile d'Argan Bio, Miel Naturel et Produits de Beauté Marocains",
  },
  titleTemplate: "%s | Huyamy - Argan Oil, Amlou & Moroccan Bio Products",
  description: {
    ar: "اكتشف أفضل المنتجات المغربية الطبيعية في هيوامي. توصيل مجاني.",
    fr: "Découvrez les meilleurs produits marocains naturels chez Huyamy. Livraison gratuite.",
  },
  niche: {
    ar: "منتجات مغربية طبيعية وعضوية",
    fr: "Produits Marocains Bio",
  },
  url: "https://huyamy.com",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://huyamy.com",
  logo: "/images/huyami_logo.jpeg",
  ogImage: "/images/huyami_logo.jpeg", // Default OG image
  keywords: {
    ar: [
      "زيت الأرغان",
      "عسل طبيعي",
      "زيت الأملا",
      "منتجات بيولوجية",
      "مستحضرات طبيعية",
      "جمال مغربي",
      "العناية الطبيعية بالبشرة",
      "الجمال التقليدي",
      "هيوامي",
      "أملو",
      "منتجات طبيعية",
      "منتجات مغربية بيو",
      "تقليدي مغربي",
    ],
    fr: [
      "huile d'argan",
      "miel naturel",
      "huile d'amla",
      "produits bio",
      "cosmétiques naturels",
      "beauté marocaine",
      "soins biologiques",
      "beauté traditionnelle",
      "huyamy",
      "amlou",
      "produits bio marocains",
      "traditionnel marocain",
    ],
  },
  themeColor: "#059669",
  contact: {
    email: "contact@huyamy.com",
    whatsapp: "+212636739071",
  },
  social: {
    twitter: "@huyamy",
  },
  socialLinks: {
    facebook: "https://facebook.com/huyamy",
    instagram: "https://instagram.com/huyamy",
    twitter: "https://twitter.com/huyamy",
  },
  i18n: {
    locales: ["ar", "fr"],
    defaultLocale: "ar",
  },
  authors: [{ name: "Huyamy" }],
  creator: "Huyamy",
  publisher: "Huyamy",
  location: "Morocco",
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
