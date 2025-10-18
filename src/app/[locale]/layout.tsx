import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Locale } from "@/types/common";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/config";
import { Geist, Geist_Mono, Noto_Sans_Arabic, Inter } from "next/font/google";
import "../globals.css";
import ToasterProvider from "@/providers/ToasterProvider";
import InstallPrompt from "@/components/InstallPrompt";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { siteConfig } from "@/config/site";

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

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      template: siteConfig.titleTemplate,
      default: siteConfig.title[typedLocale],
    },
    description: siteConfig.description[typedLocale],
    keywords: siteConfig.keywords[typedLocale],
    authors: siteConfig.authors,
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
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
      url: `${siteConfig.url}/${typedLocale}`,
      siteName: siteConfig.name,
      title: siteConfig.title[typedLocale],
      description: siteConfig.description[typedLocale],
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - ${siteConfig.description[typedLocale]}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.title[typedLocale],
      description: siteConfig.description[typedLocale],
      images: [siteConfig.ogImage],
      creator: siteConfig.social.twitter,
    },
    alternates: {
      canonical: `${siteConfig.url}/${typedLocale}`,
      languages: {
        "ar-MA": `${siteConfig.url}/ar`,
        "fr-MA": `${siteConfig.url}/fr`,
      },
    },
    verification: {
      google: siteConfig.verification.google,
    },
    category: siteConfig.category,
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
          <InstallPrompt />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
