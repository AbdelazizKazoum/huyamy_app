import { Category } from "../types";

export const categories: Category[] = [
  {
    id: 1,
    name: { ar: "العناية بالبشرة", fr: "Soins de la peau" },
    description: {
      ar: "كل ما تحتاجينه لبشرة نضرة وصحية.",
      fr: "Tout ce dont vous avez besoin pour une peau fraîche et saine.",
    },
    image: "https://placehold.co/200x200/f3e0e6/ffffff?text=بشرة",
  },
  {
    id: 2,
    name: { ar: "العناية بالشعر", fr: "Soins des cheveux" },
    description: {
      ar: "منتجات طبيعية لتقوية وتغذية شعرك.",
      fr: "Produits naturels pour renforcer et nourrir vos cheveux.",
    },
    image: "https://placehold.co/200x200/f0e6d3/ffffff?text=شعر",
  },
  {
    id: 3,
    name: { ar: "العطور", fr: "Parfums" },
    description: {
      ar: "تشكيلة فاخرة من العطور الشرقية والغربية.",
      fr: "Une sélection luxueuse de parfums orientaux et occidentaux.",
    },
    image: "https://placehold.co/200x200/e4d8c8/ffffff?text=عطور",
  },
  {
    id: 4,
    name: { ar: "المكياج", fr: "Maquillage" },
    description: {
      ar: "أبرزي جمالك مع مجموعتنا من المكياج.",
      fr: "Mettez en valeur votre beauté avec notre collection de maquillage.",
    },
    image: "https://placehold.co/200x200/d6c2b1/ffffff?text=مكياج",
  },
  {
    id: 5,
    name: { ar: "العناية بالجسم", fr: "Soins du corps" },
    description: {
      ar: "دللي جسمك بمنتجاتنا المرطبة والمغذية.",
      fr: "Prenez soin de votre corps avec nos produits hydratants et nourrissants.",
    },
    image: "https://placehold.co/200x200/c7b7a7/ffffff?text=جسم",
  },
  {
    id: 6,
    name: { ar: "منتجات عضوية", fr: "Produits bio" },
    description: {
      ar: "منتجات طبيعية 100% وخالية من المواد الكيميائية.",
      fr: "Produits 100% naturels et sans produits chimiques.",
    },
    image: "https://placehold.co/200x200/d1e4d1/ffffff?text=عضوي",
  },
];
