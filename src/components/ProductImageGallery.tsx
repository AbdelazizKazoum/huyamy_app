"use client";
import { Product } from "@/types";
import { Language } from "firebase/ai";
import Image from "next/image";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

const ProductImageGallery: React.FC<{ product: Product; lang: Language }> = ({
  product,
  lang,
}) => {
  const [mainImage, setMainImage] = useState(product.image);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  // Split subImages
  const firstTwo = product.subImages.slice(0, 2);
  const rest = product.subImages.slice(2);
  const allImages = [product.image, ...product.subImages];

  const goPrev = () => {
    setModalIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };
  const goNext = () => {
    setModalIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden relative border border-white/60 shadow-lg group">
        <Image
          src={mainImage}
          alt={product.name[lang as keyof typeof product.name]}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>

      {/* First Two Sub Images */}
      <div className="grid grid-cols-2 gap-2">
        {firstTwo.map((img, index) => (
          <button
            key={index}
            onClick={() => setMainImage(img)}
            aria-label={`Show image ${index + 1}`}
            className={`aspect-square rounded-md overflow-hidden border relative transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-700 hover:shadow-md ${
              mainImage === img
                ? "border-green-700 shadow-lg"
                : "border-white/60 hover:border-green-300"
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

      {/* Rest of Sub Images as Small Cards */}
      {rest.length > 0 && (
        <div className="flex gap-2 overflow-x-auto py-1">
          {rest.map((img, index) => (
            <button
              key={index + 2}
              onClick={() => setMainImage(img)}
              aria-label={`Show image ${index + 3}`}
              className={`w-16 h-16 min-w-16 rounded-md overflow-hidden border relative transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-700 hover:shadow-md ${
                mainImage === img
                  ? "border-green-700 shadow-lg"
                  : "border-white/60 hover:border-green-300"
              }`}
            >
              <Image
                src={img}
                alt={`${product.name[lang as keyof typeof product.name]} ${
                  index + 3
                }`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Gallery Modal */}
      <Transition show={modalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClose={() => setModalOpen(false)}
        >
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            aria-hidden="true"
          />
          <div className="relative w-full h-full flex items-center justify-center">
            <Dialog.Panel className="relative bg-white rounded-lg shadow-2xl max-w-5xl w-full mx-auto flex flex-col items-center p-8">
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-gray-700 hover:text-red-600 text-3xl font-bold focus:outline-none"
                onClick={() => setModalOpen(false)}
                aria-label="Close gallery"
                type="button"
              >
                &times;
              </button>
              {/* Main Modal Image with Scroll Buttons */}
              <div className="relative w-full flex items-center justify-center">
                {/* Prev Button */}
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-green-700 hover:text-white rounded-full p-4 shadow-xl focus:outline-none border-2 border-green-700 text-4xl transition-all z-10"
                  onClick={goPrev}
                  aria-label="Previous image"
                  type="button"
                >
                  <svg
                    width="32"
                    height="32"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {/* Main Image */}
                <div className="w-full h-full flex items-center justify-center">
                  <Image
                    src={allImages[modalIndex]}
                    alt={`${
                      product.name[lang as keyof typeof product.name]
                    } gallery`}
                    fill
                    className="object-contain rounded-lg"
                    sizes="(max-width: 1200px) 80vw, 800px"
                  />
                </div>
                {/* Next Button */}
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-green-700 hover:text-white rounded-full p-4 shadow-xl focus:outline-none border-2 border-green-700 text-4xl transition-all z-10"
                  onClick={goNext}
                  aria-label="Next image"
                  type="button"
                >
                  <svg
                    width="32"
                    height="32"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              {/* Thumbnails List */}
              <div className="flex gap-3 mt-8 overflow-x-auto w-full justify-center pb-2 scrollbar-thin scrollbar-thumb-green-700 scrollbar-track-gray-200">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setModalIndex(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none ${
                      modalIndex === idx
                        ? "border-green-700 shadow-lg ring-2 ring-green-700"
                        : "border-gray-300 hover:border-green-300"
                    }`}
                    aria-label={`Show image ${idx + 1}`}
                    type="button"
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className={`object-cover transition-transform duration-200 ${
                        modalIndex === idx ? "scale-105" : "hover:scale-105"
                      }`}
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ProductImageGallery;
