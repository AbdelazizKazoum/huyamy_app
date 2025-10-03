import { LocalizedString } from "./common";
import { Category } from "./category";

export type Product = {
  id: string; // Changed from number to string for Firestore compatibility
  name: LocalizedString;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  isNew: boolean;
  description: LocalizedString;
  category: Category;
  subImages: string[];
  keywords: string[];
};
