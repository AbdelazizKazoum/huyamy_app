import React from "react";
import { Star } from "lucide-react";
import { Category, Language, Product } from "@/types";
import { currencies } from "@/data";
import ProductImageGallery from "@/components/ProductImageGallery";
import CheckoutForm from "@/components/forms/CheckoutForm";
import CountdownTimer from "@/components/CountdownTimer";

const categories: Category[] = [
  {
    id: "1",
    name: { ar: "العناية بالبشرة", fr: "Soins de la peau" },
    description: {
      ar: "كل ما تحتاجينه لبشرة نضرة وصحية.",
      fr: "Tout ce dont vous avez besoin pour une peau fraîche et saine.",
    },
    image: "https://placehold.co/200x200/f3e0e6/ffffff?text=بشرة",
  },
];

const product: Product = {
  id: "1",
  name: { ar: "مجموعة بياض الثلج", fr: "Gamme Snow White" },
  slug: "snow-white-set",
  price: 300.0,
  originalPrice: 450.0,
  image:
    "https://cdn.youcan.shop/stores/81bd645d781f70a96fa5476e9326e859/products/dbyuTGDd3D7cX7KXGtTl3VJPBwgQiJYH9dJzfacV_lg.jpg",
  isNew: true,
  description: {
    ar: "مجموعة العناية بالبشرة بياض الثلج للقضاء على التجاعيد والخطوط الرفيعة والكلف والتصبغات. تحتوي المجموعة على أربع منتجات: ماسك بودرة اللؤلؤ، كريم مرطب، وسيروم.",
    fr: "Gamme de soins de la peau Blanche-Neige pour éliminer les rides, ridules, mélasma et pigmentation. La gamme contient quatre produits : un masque en poudre de perle, une crème hydratante et un sérum.",
  },
  category: categories[0],
  subImages: [
    "https://cdn.youcan.shop/stores/81bd645d781f70a96fa5476e9326e859/products/dbyuTGDd3D7cX7KXGtTl3VJPBwgQiJYH9dJzfacV_lg.jpg",
    "https://cdn.youcan.shop/stores/81bd645d781f70a96fa5476e9326e859/products/cci1oaT4i3wWkdjvotZ7QVmlo0VYqgEKO3nQ7Y9N_lg.jpg",
    "https://cdn.youcan.shop/stores/81bd645d781f70a96fa5476e9326e859/products/LeQLhzOVKLCyYJdZQAk6j81siOJmJfi4sy1aDAtP.jpg",
  ],
  keywords: ["snow white", "biyad al thalj", "skincare", "anti-aging"],
};

type Props = {
  params: Promise<{ locale: Language }>;
};
// --- Main Page Component ---
export default async function ProductDetailsPage({ params }: Props) {
  const { locale } = await params;
  const currency = currencies[locale];
  // Set offer to end 3 days from now for demonstration
  const offerEndDate = new Date().getTime() + 3 * 24 * 60 * 60 * 1000;

  return (
    <>
      <style>
        {`
              @keyframes ring {
                0% { transform: rotate(0); }
                1% { transform: rotate(15deg); }
                3% { transform: rotate(-14deg); }
                5% { transform: rotate(17deg); }
                7% { transform: rotate(-16deg); }
                9% { transform: rotate(15deg); }
                11% { transform: rotate(-14deg); }
                13% { transform: rotate(13deg); }
                15% { transform: rotate(-12deg); }
                17% { transform: rotate(12deg); }
                19% { transform: rotate(-10deg); }
                21% { transform: rotate(9deg); }
                23% { transform: rotate(-8deg); }
                25% { transform: rotate(7deg); }
                27% { transform: rotate(-5deg); }
                29% { transform: rotate(5deg); }
                31% { transform: rotate(-4deg); }
                33% { transform: rotate(3deg); }
                35% { transform: rotate(-2deg); }
                37% { transform: rotate(1deg); }
                39% { transform: rotate(-1deg); }
                41% { transform: rotate(1deg); }
                43% { transform: rotate(0); }
                100% { transform: rotate(0); }
              }
              .animate-ring {
                animation: ring 3s ease-in-out 0.7s infinite;
              }

              @keyframes slide-right-left {
                0%, 100% { transform: translateX(5px); }
                50% { transform: translateX(-5px); }
              }
              .animate-slide {
                animation: slide-right-left 2.5s ease-in-out infinite;
              }
              
              @keyframes shiny-effect {
                0% { transform: translateX(-150%) skewX(-25deg); }
                100% { transform: translateX(250%) skewX(-25deg); }
              }
              .animate-shiny::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 50%;
                height: 100%;
                background: linear-gradient(
                  to right,
                  rgba(255, 255, 255, 0) 0%,
                  rgba(255, 255, 255, 0.3) 50%,
                  rgba(255, 255, 255, 0) 100%
                );
                animation: shiny-effect 3s infinite linear;
              }

              input:focus::placeholder {
                color: transparent;
              }
            `}
      </style>
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="bg-white"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        <main className="py-12">
          <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Right Side: Product Gallery */}
              <div>
                <ProductImageGallery product={product} lang={locale} />
              </div>
              {/* Left Side: Product Details & Form */}
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.name[locale]}
                </h1>
                <div className="flex items-center">
                  <p className="text-3xl font-bold text-green-800">
                    {product.price.toFixed(2)} {currency}
                  </p>
                  {product.originalPrice && (
                    <p className="text-xl text-gray-400 line-through ml-4">
                      {product.originalPrice.toFixed(2)} {currency}
                    </p>
                  )}
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-amber-400 fill-current"
                    />
                  ))}
                </div>

                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <CountdownTimer
                      expiryTimestamp={offerEndDate}
                      lang={locale}
                    />
                  )}

                <div className="text-gray-700 space-y-2">
                  <p>{product.description[locale]}</p>
                </div>

                <CheckoutForm lang={locale} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
