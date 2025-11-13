import { VariantOption } from "@/types/product";
import { ChangeEvent } from "react";

/**
 * Generates all possible combinations of variant options.
 * Used to create product variants from selected options.
 *
 * @param options - Array of variant options with their values
 * @returns Array of combination objects where keys are option names and values are selected values
 */
export const generateCombinations = (
  options: VariantOption[]
): { [key: string]: string }[] => {
  if (options.length === 0 || options.some((o) => o.values.length === 0)) {
    return [];
  }

  let combinations: { [key: string]: string }[] = [{}];

  for (const option of options) {
    const newCombinations: { [key: string]: string }[] = [];
    for (const combination of combinations) {
      for (const value of option.values) {
        newCombinations.push({ ...combination, [option.name.fr]: value });
      }
    }
    combinations = newCombinations;
  }

  return combinations;
};

/**
 * Utility function to handle adding new images to an image array.
 * Creates file objects and preview URLs for display.
 *
 * @param e - File input change event
 * @param setImages - State setter for the images array
 * @param setImagePreviews - State setter for the preview URLs array
 */
export const handleImageArrayChange = (
  e: ChangeEvent<HTMLInputElement>,
  setImages: React.Dispatch<React.SetStateAction<File[]>>,
  setImagePreviews: React.Dispatch<React.SetStateAction<string[]>>
) => {
  if (e.target.files) {
    const newFiles = Array.from(e.target.files);
    setImages((prev) => [...prev, ...newFiles]);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  }
};

/**
 * Utility function to remove an image from an image array.
 * Handles both new (blob URLs) and existing images appropriately.
 *
 * @param index - Index of the image to remove in the previews array
 * @param previewUrl - URL of the image preview to remove
 * @param imagePreviews - Current array of image preview URLs
 * @param images - Current array of image files
 * @param setImages - State setter for the images array
 * @param setImagePreviews - State setter for the preview URLs array
 * @param setDeletedImageUrls - State setter for deleted image URLs (for existing images)
 */
export const removeImageFromArray = (
  index: number,
  previewUrl: string,
  imagePreviews: string[],
  images: File[],
  setImages: React.Dispatch<React.SetStateAction<File[]>>,
  setImagePreviews: React.Dispatch<React.SetStateAction<string[]>>,
  setDeletedImageUrls: React.Dispatch<React.SetStateAction<string[]>>
) => {
  if (previewUrl.startsWith("blob:")) {
    const fileIndexToRemove = imagePreviews
      .slice(imagePreviews.length - images.length)
      .findIndex((p) => p === previewUrl);

    if (fileIndexToRemove !== -1) {
      setImages((prev) => prev.filter((_, i) => i !== fileIndexToRemove));
    }
  } else {
    setDeletedImageUrls((prev) => [...prev, previewUrl]);
  }
  setImagePreviews((prev) => prev.filter((_, i) => i !== index));
};
