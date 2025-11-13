import React, { ChangeEvent } from "react";
import Image from "next/image";
import { X, PlusCircle } from "lucide-react";

interface CertificationImagesUploadProps {
  imagePreviews: string[];
  onImagesChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number, previewUrl: string) => void;
  label: string;
  addImageText: string;
}

/**
 * Component for uploading and managing certification images
 */
export const CertificationImagesUpload: React.FC<
  CertificationImagesUploadProps
> = ({ imagePreviews, onImagesChange, onRemoveImage, label, addImageText }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {imagePreviews.map((src, index) => (
          <div key={index} className="relative group">
            <Image
              src={src}
              alt={`certification-image ${index}`}
              width={100}
              height={100}
              className="h-24 w-24 object-cover rounded-md"
            />
            <button
              type="button"
              onClick={() => onRemoveImage(index, src)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <label
          htmlFor="certification-images-upload"
          className="flex flex-col items-center justify-center w-24 h-24 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
        >
          <PlusCircle size={24} className="text-gray-400" />
          <span className="text-xs text-gray-500 mt-1">{addImageText}</span>
          <input
            id="certification-images-upload"
            type="file"
            multiple
            className="sr-only"
            onChange={onImagesChange}
            accept="image/*"
          />
        </label>
      </div>
    </div>
  );
};
