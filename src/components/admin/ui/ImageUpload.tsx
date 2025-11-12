"use client";
import React, { useState, useRef, useEffect } from "react";
import { UploadCloud } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  label: string;
  description: string;
  currentImage: string;
  onImageChange: (file: File) => void;
  onImageRemove: () => void;
  aspectRatio?: "aspect-square" | "aspect-video";
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  description,
  currentImage,
  onImageChange,
  onImageRemove,
  aspectRatio = "aspect-square",
}) => {
  const [preview, setPreview] = useState<string>(currentImage);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newPreviewUrl = URL.createObjectURL(file);
      setPreview(newPreviewUrl);
      onImageChange(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from triggering file dialog if it's part of a clickable parent
    setPreview("");
    onImageRemove();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    // Clean up the object URL to prevent memory leaks
    const currentPreview = preview;
    if (currentPreview && currentPreview.startsWith("blob:")) {
      return () => URL.revokeObjectURL(currentPreview);
    }
  }, [preview]);

  useEffect(() => {
    setPreview(currentImage);
  }, [currentImage]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
      <div className="sm:col-span-1">
        <h4 className="font-semibold text-neutral-800">{label}</h4>
        <p className="text-sm text-neutral-500">{description}</p>
      </div>
      <div className="sm:col-span-2 flex items-center gap-4">
        <div
          onClick={() => inputRef.current?.click()}
          className={`relative group cursor-pointer rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 flex items-center justify-center text-neutral-400 hover:border-primary-600 transition-colors ${aspectRatio} ${
            label === "Favicon" ? "w-16 h-16" : "w-32 h-32"
          }`}
        >
          {preview ? (
            <Image
              src={preview}
              alt={label}
              fill
              className="object-contain rounded-md"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-center">
              <UploadCloud
                size={label === "Favicon" ? 20 : 32}
                className="group-hover:text-primary-600"
              />
              <span className="text-xs font-semibold text-neutral-500 group-hover:text-primary-600">
                {label === "Favicon" ? "Upload" : "Upload Image"}
              </span>
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*,.ico"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col gap-2 self-center">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="bg-white border border-neutral-300 text-neutral-700 text-sm font-semibold py-2 px-4 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            تغيير
          </button>
          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              className="text-red-600 text-sm font-semibold hover:text-red-800 transition-colors"
            >
              إزالة
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
