"use client";
import { Product } from "@/types";
import { Language } from "firebase/ai";
import Image from "next/image";
import { useState } from "react";

const ProductImageGallery: React.FC<{ product: Product; lang: Language }> = ({
  product,
  lang,
}) => {
  const [mainImage, setMainImage] = useState(product.image);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden relative">
        <Image
          src={mainImage}
          alt={product.name[lang as keyof typeof product.name]}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>

      {/* Sub Images Gallery */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-2 gap-2">
        {product.subImages.map((img, index) => (
          <button
            key={index}
            onClick={() => setMainImage(img)}
            className={`aspect-square rounded-md overflow-hidden border-2 relative transition-all duration-200 hover:shadow-md ${
              mainImage === img
                ? "border-green-700 shadow-lg"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Image
              src={img}
              alt={`${product.name[lang as keyof typeof product.name]} ${
                index + 1
              }`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 50vw, 200px"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
