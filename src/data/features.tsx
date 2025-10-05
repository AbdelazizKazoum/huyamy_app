import { HandCoins, ShieldCheck, Truck } from "lucide-react";
import React from "react";

export const features = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-brand-accent" />,
    title: {
      ar: "منتج أصلي 100%",
      fr: "Produit 100% Authentique",
    },
    description: {
      ar: "نضمن جودة وأصالة جميع منتجاتنا.",
      fr: "Qualité et authenticité garanties.",
    },
  },
  {
    icon: <Truck className="w-8 h-8 text-brand-accent" />,
    title: {
      ar: "توصيل مجاني",
      fr: "Livraison Gratuite",
    },
    description: {
      ar: "توصيل سريع ومجاني لجميع الطلبات.",
      fr: "Livraison rapide et gratuite pour tous.",
    },
  },
  {
    icon: <HandCoins className="w-8 h-8 text-brand-accent" />,
    title: {
      ar: "دفع عند الاستلام",
      fr: "Paiement à la Livraison",
    },
    description: {
      ar: "ادفع بأمان عند استلام طلبك.",
      fr: "Payez en toute sécurité à la réception.",
    },
  },
];
