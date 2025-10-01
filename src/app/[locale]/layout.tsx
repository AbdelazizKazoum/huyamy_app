import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Locale } from "@/types/common";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/config";

type Props = {
  params: { locale: Locale };
};

// Generate metadata based on locale
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params;

  const isArabic = locale === "ar";

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
    ],
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    keywords: keywords[locale],
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      locale: isArabic ? "ar_MA" : "fr_MA",
      alternateLocale: isArabic ? "fr_MA" : "ar_MA",
      url: `https://huyamy.com/${locale}`,
    },
    twitter: {
      title: titles[locale],
      description: descriptions[locale],
    },
    alternates: {
      canonical: `https://huyamy.com/${locale}`,
      languages: {
        "ar-MA": "https://huyamy.com/ar",
        "fr-MA": "https://huyamy.com/fr",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: Locale };
}>) {
  const { locale } = params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
