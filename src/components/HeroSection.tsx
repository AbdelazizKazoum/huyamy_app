import { Clock, HandCoins, Truck } from "lucide-react";
import Image from "next/image";
import React from "react";

const HeroSection: React.FC = () => {
  const features = [
    {
      icon: <Truck size={40} className="text-green-800 mb-4" />,
      title: "شحن مجاني",
      description: "لجميع الطلبات في المغرب",
    },
    {
      icon: <Clock size={40} className="text-green-800 mb-4" />,
      title: "توصيل في الوقت المحدد",
      description: "خلال 24 إلى 48 ساعة",
    },
    {
      icon: <HandCoins size={40} className="text-green-800 mb-4" />,
      title: "الدفع عند الاستلام",
      description: "الدفع نقداً عند وصول طلبك",
    },
  ];

  return (
    <section className="relative">
      {/* Promotional Banner */}
      <div className="w-full bg-[#f7f6f2]">
        <a href="#" className="block">
          <Image
            src="https://placehold.co/1600x450/f7f6f2/166534?text=منتجات+طبيعية+بجودة+عالية"
            alt="عرض ترويجي"
            width={1600}
            height={450}
            className="w-full h-auto object-cover"
            priority
          />
        </a>
      </div>

      {/* Feature Cards */}
      <div className="bg-white">
        <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 md:-mt-16 relative z-10">
          {/* Desktop View: Grid */}
          <div className="hidden md:grid md:grid-cols-3 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-lg text-center flex flex-col items-center border border-gray-100"
              >
                {feature.icon}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
          {/* Mobile View: Single compact card */}
          <div className="md:hidden bg-white p-4 rounded-lg shadow-lg border border-gray-100">
            <div className="flex justify-around items-start text-center">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center px-1 w-1/3"
                >
                  {React.cloneElement(feature.icon, {
                    size: 32,
                    className: "text-green-800 mb-2",
                  })}
                  <h3 className="text-xs sm:text-sm font-bold text-gray-800 leading-tight">
                    {feature.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
