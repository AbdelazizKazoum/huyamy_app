import { LocalizedString } from "./common";
import { Product } from "./product";

export type SectionType =
  | "hero"
  | "featured"
  | "popular"
  | "newsletter"
  | "banner"
  | "landing-page";

export type SectionData = {
  title?: LocalizedString;
  subtitle?: LocalizedString;
  description?: LocalizedString;
  ctaProductIds?: string[];
  ctaText?: LocalizedString;
  ctaUrl?: string;
  imageUrl?: string;
  backgroundColor?: string;
  textColor?: string;
};

export type Section = {
  id: string;
  type: SectionType;
  data: SectionData;
  createdAt?: FirebaseFirestore.Timestamp | null;
  updatedAt?: FirebaseFirestore.Timestamp | null;
  isActive?: boolean;
  order?: number;
};

export type SectionWithProducts = Section & {
  products?: Product[];
};
