import { LocalizedString } from "./common";
import { Category } from "./category";

export type Product = {
  id: number;
  name: LocalizedString;
  price: number;
  originalPrice?: number;
  image: string;
  isNew: boolean;
  description: LocalizedString;
  category: Category;
  subImages: string[];
  keywords: string[];
};
