"use client";

import { useState, Fragment } from "react";
import Image from "next/image";
import { X, Maximize } from "lucide-react";
import { Language } from "@/types";
import { Dialog, Transition } from "@headlessui/react";

interface CertificationGalleryProps {
  images: string[];
  productName: string;
  locale: Language;
}

const CertificationGallery: React.FC<CertificationGalleryProps> = ({
  images,
  productName,
  locale,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  if (!images || images.length === 0) {
    return null;
  }

  const title = locale === "ar" ? "شهاداتنا المعتمدة" : "Nos Certifications";
  const altText = locale === "ar" ? "شهادة" : "Certification";

  return (
    <>
      <div className="mt-10 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {title}
        </h2>
        {/* Vertical Stack of Images, Centered with a more refined Max Width */}
        <div className="space-y-8 flex flex-col items-center">
          {images.map((imgUrl, index) => (
            <div
              key={index}
              onClick={() => openModal(imgUrl)}
              className="group relative cursor-pointer overflow-hidden rounded-lg border-2 border-gray-200 shadow-sm transition-all duration-300 hover:border-primary-500 hover:shadow-lg w-full max-w-md"
            >
              <Image
                src={imgUrl}
                alt={`${altText} ${index + 1} - ${productName}`}
                width={1200}
                height={1600}
                className="h-auto w-full object-contain transition-transform duration-300 group-hover:scale-105 bg-white"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <Maximize className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Full-Screen View */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative w-full max-w-4xl transform rounded-lg bg-white p-2 shadow-xl transition-all">
                  <button
                    onClick={closeModal}
                    className="absolute -top-4 -right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-lg transition hover:bg-gray-100 hover:scale-110"
                    aria-label="Close"
                  >
                    <X size={24} />
                  </button>
                  {selectedImage && (
                    <Image
                      src={selectedImage}
                      alt="Certification"
                      width={1000}
                      height={1200}
                      className="h-auto w-full max-h-[85vh] object-contain rounded-md"
                    />
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default CertificationGallery;
