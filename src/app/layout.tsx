import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Arabic, Inter } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://huyamy.com"), // Replace with your actual domain
  title: {
    template: "%s | Huyamy - Argan Oil, Amlou & Moroccan Bio Products",
    default: "Huyamy - Argan Oil, Amlou (أملو), Honey & Moroccan Bio Products",
  },
  description:
    "Discover authentic Moroccan bio products at Huyamy. Premium argan oil, traditional amlou (أملو), natural honey (عسل) and organic cosmetics. Traditional Moroccan bio essentials first, beauty products second.",
  keywords: [
    "argan oil",
    "زيت الأرغان",
    "huile d'argan",
    "amlou",
    "أملو",
    "honey",
    "عسل",
    "miel naturel",
    "bio products",
    "منتجات طبيعية",
    "produits bio",
    "moroccan bio",
    "منتجات مغربية بيو",
    "produits bio marocains",
    "natural cosmetics",
    "مستحضرات طبيعية",
    "cosmétiques naturels",
    "moroccan beauty",
    "جمال مغربي",
    "beauté marocaine",
    "traditional moroccan",
    "تقليدي مغربي",
    "traditionnel marocain",
    "huyamy",
  ],
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
    locale: "ar_MA",
    alternateLocale: ["fr_MA"],
    url: "https://huyamy.com",
    siteName: "Huyamy",
    title: "Huyamy - Argan Oil, Amlou (أملو), Honey & Moroccan Bio Products",
    description:
      "Discover authentic Moroccan bio products. Premium argan oil, traditional amlou, natural honey and organic cosmetics from Morocco.",
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
    title: "Huyamy - Argan Oil, Amlou & Moroccan Bio Products",
    description:
      "Discover authentic Moroccan bio products. Premium argan oil, traditional amlou (أملو), natural honey and organic cosmetics.",
    images: ["/images/huyami_logo.jpeg"],
    creator: "@huyamy", // Replace with your actual Twitter handle
  },
  alternates: {
    canonical: "https://huyamy.com",
    languages: {
      "ar-MA": "https://huyamy.com/ar",
      "fr-MA": "https://huyamy.com/fr",
    },
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
  category: "e-commerce",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansArabic.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
