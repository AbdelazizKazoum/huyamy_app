import { LocalizedString } from "./common";

export type Category = {
  id: string; // Changed from number to string for Firestore compatibility
  name: LocalizedString;
  description: LocalizedString;
  image: string;
};
