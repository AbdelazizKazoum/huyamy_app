import React, { ChangeEvent } from "react";
import Image from "next/image";
import { UploadCloud } from "lucide-react";

interface MainImageUploadProps {
  mainImagePreview: string | null;
  onImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  isEditMode: boolean;
  label: string;
  uploadText: string;
  changeText: string;
  formatHint: string;
}

/**
 * Component for uploading and previewing the main product image
 */
export const MainImageUpload: React.FC<MainImageUploadProps> = ({
  mainImagePreview,
  onImageChange,
  error,
  isEditMode,
  label,
  uploadText,
  changeText,
  formatHint,
}) => {
  return (
    <div id="main-image">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <div className="space-y-1 text-center">
          {mainImagePreview ? (
            <Image
              src={mainImagePreview}
              alt="Preview"
              width={200}
              height={200}
              className="mx-auto h-32 w-32 object-cover rounded-md"
            />
          ) : (
            <UploadCloud
              className="mx-auto h-12 w-12 text-gray-400"
              strokeWidth={1}
            />
          )}
          <div className="flex text-sm text-gray-600 justify-center">
            <label
              htmlFor="main-image-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none"
            >
              <span>{isEditMode ? changeText : uploadText}</span>
              <input
                id="main-image-upload"
                name="main-image-upload"
                type="file"
                className="sr-only"
                onChange={onImageChange}
                accept="image/*"
              />
            </label>
          </div>
          <p className="text-xs text-gray-500">{formatHint}</p>
        </div>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
