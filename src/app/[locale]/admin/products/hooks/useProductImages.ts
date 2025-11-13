import { useState, useEffect, ChangeEvent } from "react";
import { Product } from "@/types";
import {
  handleImageArrayChange,
  removeImageFromArray,
} from "../utils/productFormUtils";

/**
 * Custom hook for managing product images (main, sub, and certification)
 */
export const useProductImages = (product: Product | null, isOpen: boolean) => {
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [subImages, setSubImages] = useState<File[]>([]);
  const [subImagePreviews, setSubImagePreviews] = useState<string[]>([]);
  const [deletedSubImageUrls, setDeletedSubImageUrls] = useState<string[]>([]);
  const [certificationImages, setCertificationImages] = useState<File[]>([]);
  const [certificationImagePreviews, setCertificationImagePreviews] = useState<
    string[]
  >([]);
  const [deletedCertificationImageUrls, setDeletedCertificationImageUrls] =
    useState<string[]>([]);

  // Initialize images from product or reset for new product
  useEffect(() => {
    if (product) {
      setMainImage(null);
      setMainImagePreview(product.image);
      setSubImages([]);
      setSubImagePreviews(product.subImages || []);
      setDeletedSubImageUrls([]);
      setCertificationImages([]);
      setCertificationImagePreviews(product.certificationImages || []);
      setDeletedCertificationImageUrls([]);
    } else {
      setMainImage(null);
      setMainImagePreview(null);
      setSubImages([]);
      setSubImagePreviews([]);
      setDeletedSubImageUrls([]);
      setCertificationImages([]);
      setCertificationImagePreviews([]);
      setDeletedCertificationImageUrls([]);
    }
  }, [product, isOpen]);

  const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleImageArrayChange(e, setSubImages, setSubImagePreviews);
  };

  const handleCertificationImagesChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    handleImageArrayChange(
      e,
      setCertificationImages,
      setCertificationImagePreviews
    );
  };

  const removeSubImage = (index: number, previewUrl: string) => {
    removeImageFromArray(
      index,
      previewUrl,
      subImagePreviews,
      subImages,
      setSubImages,
      setSubImagePreviews,
      setDeletedSubImageUrls
    );
  };

  const removeCertificationImage = (index: number, previewUrl: string) => {
    removeImageFromArray(
      index,
      previewUrl,
      certificationImagePreviews,
      certificationImages,
      setCertificationImages,
      setCertificationImagePreviews,
      setDeletedCertificationImageUrls
    );
  };

  return {
    mainImage,
    mainImagePreview,
    subImages,
    subImagePreviews,
    deletedSubImageUrls,
    certificationImages,
    certificationImagePreviews,
    deletedCertificationImageUrls,
    handleMainImageChange,
    handleSubImagesChange,
    handleCertificationImagesChange,
    removeSubImage,
    removeCertificationImage,
  };
};
