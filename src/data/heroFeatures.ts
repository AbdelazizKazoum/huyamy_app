import { Clock, HandCoins, Truck } from "lucide-react";
import React from "react";

export interface HeroFeature {
  id: string;
  iconName: "truck" | "clock" | "handCoins";
  title: {
    ar: string;
    fr: string;
  };
  description: {
    ar: string;
    fr: string;
  };
}

export const heroFeatures: HeroFeature[] = [
  {
    id: "free-shipping",
    iconName: "truck",
    title: {
      ar: "شحن مجاني",
      fr: "Livraison gratuite",
    },
    description: {
      ar: "لجميع الطلبات في المغرب",
      fr: "Pour toutes les commandes au Maroc",
    },
  },
  {
    id: "fast-delivery",
    iconName: "clock",
    title: {
      ar: "توصيل في الوقت المحدد",
      fr: "Livraison ponctuelle",
    },
    description: {
      ar: "خلال 24 إلى 48 ساعة",
      fr: "Dans 24 à 48 heures",
    },
  },
  {
    id: "cash-on-delivery",
    iconName: "handCoins",
    title: {
      ar: "الدفع عند الاستلام",
      fr: "Paiement à la livraison",
    },
    description: {
      ar: "الدفع نقداً عند وصول طلبك",
      fr: "Paiement en espèces à la réception",
    },
  },
];

// Icon component mapping function
export const getFeatureIcon = (
  iconName: string,
  size: number = 40,
  className: string = "text-primary-800 mb-4"
): React.ReactElement | null => {
  const iconProps = { size, className };

  switch (iconName) {
    case "truck":
      return React.createElement(Truck, iconProps);
    case "clock":
      return React.createElement(Clock, iconProps);
    case "handCoins":
      return React.createElement(HandCoins, iconProps);
    default:
      return null;
  }
};
