"use client";

import React from "react";

// --- Feature list for the Pro version ---
const proFeatures: string[] = [
  "عرض الدخل الشهري والسنوي",
  "عدد المنتجات المباعة والطلبات",
  "إحصائيات الزوار والمبيعات",
  "تقارير مفصلة عن أداء المتجر",
  "تسجيل دخول العملاء وحفظ سلة المشتريات على الخادم ليتمكن العميل من الوصول إليها من أي جهاز",
  "إمكانية إضافة أي عدد من المتغيرات للمنتجات مثل الألوان، المقاسات، الوزن، السعة، أو إنشاء متغيرات خاصة بك",
  "إدارة المخزون وتتبع الكميات المتوفرة لكل منتج",
  "الحصول على إشعارات عبر البريد الإلكتروني أو الرسائل القصيرة عند إجراء طلب جديد",
];

// --- SVG Icon Components ---
// Using components for icons makes the main return statement cleaner.

const CrownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
  </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);

const DashboardUpgradePage: React.FC = () => {
  return (
    // Main container with a subtle background color
    <div
      className="flex items-center justify-center p-4"
      dir="rtl"
      style={{ minHeight: "calc(100vh - 6rem)" }} // 6rem = header height, adjust if needed
    >
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left Side: Feature Highlights */}
          <div className="p-8 md:p-12 order-2 md:order-1">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              أطلق العنان لقوة متجرك الكاملة
            </h2>
            <p className="text-slate-500 mb-8 text-base">
              الترقية إلى النسخة الاحترافية تمنحك أدوات تحليلية وإدارية متقدمة
              لمساعدتك على النمو.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {proFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="w-5 h-5 text-indigo-500 mt-1" />
                  </div>
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Call to Action */}
          <div className="bg-slate-100/70 p-8 md:p-12 flex flex-col items-center justify-center text-center order-1 md:order-2">
            {/* Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
              <CrownIcon className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              الترقية إلى Pro
            </h1>

            <p className="text-slate-600 mb-8 max-w-sm">
              احصل على لوحة تحكم متكاملة مع إحصائيات دقيقة وتقارير مفصلة لإدارة
              متجرك باحترافية.
            </p>

            {/* CTA Button */}
            <a
              href="https://wa.me/212636739071?text=أرغب%20في%20الترقية%20إلى%20النسخة%20الاحترافية%20من%20لوحة%20التحكم"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              <span>الترقية الآن</span>
              <ArrowLeftIcon className="w-6 h-6" />
            </a>

            <p className="text-xs text-slate-500 mt-4">
              سيتم توجيهك إلى واتساب للتواصل معنا.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardUpgradePage;
