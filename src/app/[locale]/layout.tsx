import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Locale } from "@/types/common";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/config";
import { Geist, Geist_Mono, Noto_Sans_Arabic, Inter } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Arabic font
const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
});

// French font (Inter works well for French)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

type Props = {
  params: Promise<{ locale: string }>;
};

// Generate metadata based on locale
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale = locale as Locale;

  const isArabic = typedLocale === "ar";

  const titles = {
    ar: "هيوامي - زيت الأرغان العضوي والعسل الطبيعي ومنتجات الجمال المغربية",
    fr: "Huyamy - Huile d'Argan Bio, Miel Naturel et Produits de Beauté Marocains",
  };

  const descriptions = {
    ar: "اكتشف منتجات الجمال المغربية الأصيلة في هيوامي. زيت الأرغان الممتاز، عسل طبيعي، زيت الأملا ومستحضرات عضوية. منتجات العناية بالبشرة التقليدية المغربية.",
    fr: "Découvrez les produits de beauté marocains authentiques chez Huyamy. Huile d'argan premium, miel naturel, huile d'amla et cosmétiques biologiques. Soins traditionnels marocains pour la peau.",
  };

  const keywords = {
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
  };

  return {
    metadataBase: new URL("https://huyamy.com"),
    title: {
      template: "%s | Huyamy - Argan Oil, Amlou & Moroccan Bio Products",
      default: titles[typedLocale],
    },
    description: descriptions[typedLocale],
    keywords: keywords[typedLocale],
    authors: [{ name: "Huyamy" }],
    creator: "Huyamy",
    publisher: "Huyamy",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: isArabic ? "ar_MA" : "fr_MA",
      alternateLocale: isArabic ? "fr_MA" : "ar_MA",
      url: `https://huyamy.com/${typedLocale}`,
      siteName: "Huyamy",
      title: titles[typedLocale],
      description: descriptions[typedLocale],
      images: [
        {
          url: "/images/huyami_logo.jpeg",
          width: 1200,
          height: 630,
          alt: "Huyamy - Organic Moroccan Beauty Products",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titles[typedLocale],
      description: descriptions[typedLocale],
      images: ["/images/huyami_logo.jpeg"],
      creator: "@huyamy",
    },
    alternates: {
      canonical: `https://huyamy.com/${typedLocale}`,
      languages: {
        "ar-MA": "https://huyamy.com/ar",
        "fr-MA": "https://huyamy.com/fr",
      },
    },
    verification: {
      google: "your-google-verification-code",
    },
    category: "e-commerce",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const typedLocale = locale as Locale;

  if (!routing.locales.includes(typedLocale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={typedLocale} dir={typedLocale === "ar" ? "rtl" : "ltr"}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansArabic.variable} ${inter.variable} antialiased`}
      >
        <NextIntlClientProvider locale={typedLocale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
