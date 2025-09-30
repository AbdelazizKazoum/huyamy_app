"use client";
import React, { useState, Fragment, useEffect } from "react";
import { ShoppingCart, Star } from "lucide-react";

// --- Type Definitions ---

type LocalizedString = {
  ar: string;
  fr: string;
};

type Language = "ar" | "fr";

type Currency = {
  ar: string;
  fr: string;
};

type Category = {
  id: number;
  name: LocalizedString;
  description: LocalizedString;
  image: string;
};

type Product = {
  id: number;
  name: LocalizedString;
  price: number;
  originalPrice?: number;
  image: string;
  isNew: boolean;
  description: LocalizedString;
  category: Category;
  subImages: string[];
  keywords: string[];
};

// --- Mock Data ---

const currencies: Currency = {
  ar: "د.م.",
  fr: "DHS",
};

const categories: Category[] = [
  {
    id: 1,
    name: { ar: "العناية بالبشرة", fr: "Soins de la peau" },
    description: {
      ar: "كل ما تحتاجينه لبشرة نضرة وصحية.",
      fr: "Tout ce dont vous avez besoin pour une peau fraîche et saine.",
    },
    image: "https://placehold.co/200x200/f3e0e6/ffffff?text=بشرة",
  },
];

const product: Product = {
  id: 1,
  name: { ar: "مجموعة بياض الثلج", fr: "Gamme Snow White" },
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

// --- Components ---

const ProductImageGallery: React.FC<{ product: Product; lang: Language }> = ({
  product,
  lang,
}) => {
  const [mainImage, setMainImage] = useState(product.image);

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        <img
          src={mainImage}
          alt={product.name[lang]}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex gap-2">
        {product.subImages.map((img, index) => (
          <button
            key={index}
            onClick={() => setMainImage(img)}
            className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
              mainImage === img ? "border-green-700" : "border-transparent"
            }`}
          >
            <img
              src={img}
              alt={`${product.name[lang]} ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

const CheckoutForm: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl border-[5px] border-green-700 dark:border-green-600 space-y-4">
        <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray-200">
          {lang === "ar" ? "معلومات الزبون" : "Informations client"}
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            name="first_name"
            placeholder={
              lang === "ar" ? "الاسم الكامل 🧑🏻‍" : "Prénom et Nom 🧑🏻‍"
            }
            className="w-full p-3 rounded-xl bg-transparent border-2 border-dashed border-green-700 dark:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 text-center"
          />
          <input
            type="text"
            name="phone"
            placeholder={lang === "ar" ? "الهاتف 📞" : "Téléphone 📞"}
            className="w-full p-3 rounded-xl bg-transparent border-2 border-dashed border-green-700 dark:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 text-center"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="city"
            placeholder={lang === "ar" ? "العنوان 🏡" : "Adresse 🏡"}
            className="w-full p-3 rounded-xl bg-transparent border-2 border-dashed border-green-700 dark:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 text-center"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-green-800 text-white font-bold py-4 px-6 rounded-full text-lg hover:bg-green-900 dark:bg-green-600 dark:hover:bg-green-700 transition-all duration-300 animate-slide"
      >
        <span className="flex items-center justify-center">
          {lang === "ar"
            ? "إشتر الآن و إدفع عند الإستلام"
            : "Achetez maintenant et payez à la livraison"}
          <ShoppingCart
            className={
              lang === "ar" ? "mr-3 animate-ring" : "ml-3 animate-ring"
            }
            size={24}
          />
        </span>
      </button>
    </form>
  );
};

const CountdownTimer: React.FC<{ expiryTimestamp: number; lang: Language }> = ({
  expiryTimestamp,
  lang,
}) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(expiryTimestamp) - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const labels = {
    ar: { days: "أيام", hours: "ساعات", minutes: "دقائق", seconds: "ثواني" },
    fr: { days: "Jours", hours: "Heures", minutes: "Min", seconds: "Sec" },
  };

  const TimeSlot: React.FC<{ value: number; label: string }> = ({
    value,
    label,
  }) => (
    <div className="text-center">
      <span className="text-3xl font-bold text-green-800 dark:text-green-300">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400 block">
        {label}
      </span>
    </div>
  );

  if (!Object.values(timeLeft).some((v) => v > 0)) {
    return null;
  }

  return (
    <div className="bg-green-50 dark:bg-gray-800 p-4 rounded-lg my-4 flex items-center justify-between">
      <h3 className="font-bold text-green-800 dark:text-green-300 text-sm md:text-base">
        {lang === "ar" ? "العرض ينتهي في:" : "L'offre se termine dans :"}
      </h3>
      <div className="flex justify-center items-center gap-3" dir="ltr">
        <TimeSlot value={timeLeft.days} label={labels[lang].days} />
        <span className="text-3xl font-bold text-green-800 dark:text-green-300">
          :
        </span>
        <TimeSlot value={timeLeft.hours} label={labels[lang].hours} />
        <span className="text-3xl font-bold text-green-800 dark:text-green-300">
          :
        </span>
        <TimeSlot value={timeLeft.minutes} label={labels[lang].minutes} />
        <span className="text-3xl font-bold text-green-800 dark:text-green-300">
          :
        </span>
        <TimeSlot value={timeLeft.seconds} label={labels[lang].seconds} />
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function ProductDetailsPage() {
  const [lang, setLang] = useState<Language>("ar");
  const currency = currencies[lang];
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

              input:focus::placeholder {
                color: transparent;
              }
            `}
      </style>
      <div
        dir={lang === "ar" ? "rtl" : "ltr"}
        className="bg-white dark:bg-gray-900"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        <main className="py-12">
          <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Right Side: Product Gallery */}
              <div>
                <ProductImageGallery product={product} lang={lang} />
              </div>
              {/* Left Side: Product Details & Form */}
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {product.name[lang]}
                </h1>
                <div className="flex items-center">
                  <p className="text-3xl font-bold text-green-800 dark:text-green-400">
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
                      lang={lang}
                    />
                  )}

                <div className="text-gray-700 dark:text-gray-300 space-y-2">
                  <p>{product.description[lang]}</p>
                </div>

                <CheckoutForm lang={lang} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
