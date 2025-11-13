import { useState, useEffect } from "react";
import { Product } from "@/types";

/**
 * Custom hook for managing basic product form state
 */
export const useProductFormState = (
  product: Product | null,
  isOpen: boolean
) => {
  const [nameAr, setNameAr] = useState("");
  const [nameFr, setNameFr] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [descriptionFr, setDescriptionFr] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [originalPrice, setOriginalPrice] = useState<number | string>("");
  const [selectedCategoryJSON, setSelectedCategoryJSON] = useState("");
  const [isNew, setIsNew] = useState(true);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordsInput, setKeywordsInput] = useState("");
  const [allowDirectPurchase, setAllowDirectPurchase] = useState(true);
  const [allowAddToCart, setAllowAddToCart] = useState(true);

  // Initialize form with product data or reset for new product
  useEffect(() => {
    if (product) {
      setNameAr(product.name.ar);
      setNameFr(product.name.fr);
      setDescriptionAr(product.description.ar);
      setDescriptionFr(product.description.fr);
      setPrice(product.price);
      setOriginalPrice(product.originalPrice || "");
      setSelectedCategoryJSON(
        product.category ? JSON.stringify(product.category) : ""
      );
      setIsNew(product.isNew);
      setKeywords(product.keywords || []);
      setAllowDirectPurchase(product.allowDirectPurchase ?? true);
      setAllowAddToCart(product.allowAddToCart ?? true);
    } else {
      setNameAr("");
      setNameFr("");
      setDescriptionAr("");
      setDescriptionFr("");
      setPrice("");
      setOriginalPrice("");
      setSelectedCategoryJSON("");
      setIsNew(true);
      setKeywords([]);
      setKeywordsInput("");
      setAllowDirectPurchase(true);
      setAllowAddToCart(true);
    }
  }, [product, isOpen]);

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      const newKeyword = keywordsInput.trim();
      if (newKeyword && !keywords.includes(newKeyword)) {
        setKeywords([...keywords, newKeyword]);
      }
      setKeywordsInput("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter((keyword) => keyword !== keywordToRemove));
  };

  return {
    nameAr,
    setNameAr,
    nameFr,
    setNameFr,
    descriptionAr,
    setDescriptionAr,
    descriptionFr,
    setDescriptionFr,
    price,
    setPrice,
    originalPrice,
    setOriginalPrice,
    selectedCategoryJSON,
    setSelectedCategoryJSON,
    isNew,
    setIsNew,
    keywords,
    setKeywords,
    keywordsInput,
    setKeywordsInput,
    allowDirectPurchase,
    setAllowDirectPurchase,
    allowAddToCart,
    setAllowAddToCart,
    handleKeywordKeyDown,
    removeKeyword,
  };
};
