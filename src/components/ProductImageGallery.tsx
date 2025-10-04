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
      <div className="flex gap-2">
        {product.subImages.map((img, index) => (
          <button
            key={index}
            onClick={() => setMainImage(img)}
            className={`w-20 h-20 rounded-md overflow-hidden border-2 relative ${
              mainImage === img ? "border-green-700" : "border-transparent"
            }`}
          >
            <Image
              src={img}
              alt={`${product.name[lang as keyof typeof product.name]} ${
                index + 1
              }`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
