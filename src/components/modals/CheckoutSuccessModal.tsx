import { Language } from "@/types";
import { Check, Home, ShoppingCart, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

// Success Modal Component
const SuccessModal = ({
  isOpen,
  onClose,
  message,
  lang,
}: {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  lang: Language;
}) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleContinueShopping = () => {
    onClose();
    router.push(`/${lang}`);
  };

  const handleViewProducts = () => {
    onClose();
    router.push(`/${lang}/products`);
  };

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4 py-20">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg mx-4 overflow-visible animate-in zoom-in-95 duration-300 relative">
        {/* Modern Success Icon at the top */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-10">
          <div className="relative">
            {/* Outer ring with pulse animation */}
            <div className="w-20 h-20 bg-green-100 rounded-full animate-pulse"></div>
            {/* Main success circle */}
            <div className="absolute inset-2 w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
              <Check size={28} className="text-white font-bold stroke-[3]" />
            </div>
            {/* Small decorative circles */}
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full border-2 border-white shadow-md flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6 pt-16 sm:pt-20 text-white relative rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white hover:text-gray-200 transition-colors p-1 hover:bg-white/10 rounded-full"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              {lang === "ar" ? "تم تأكيد طلبكم!" : "Commande confirmée !"}
            </h2>
            <p className="text-green-100 text-xs sm:text-sm">
              {lang === "ar"
                ? "شكراً لاختياركم متجرنا"
                : "Merci d'avoir choisi notre boutique"}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 text-center">
          <div className="mb-4 sm:mb-6">
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-3">
              {message}
            </p>
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>
                {lang === "ar"
                  ? "رقم الطلب: #" +
                    Math.random().toString(36).substr(2, 6).toUpperCase()
                  : "Numéro de commande: #" +
                    Math.random().toString(36).substr(2, 6).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleContinueShopping}
              variant="primary"
              size="md"
              className="w-full text-sm sm:text-base"
            >
              <Home size={18} className={lang === "ar" ? "ml-2" : "mr-2"} />
              {lang === "ar" ? "العودة للصفحة الرئيسية" : "Retour à l'accueil"}
            </Button>

            <Button
              onClick={handleViewProducts}
              variant="ghost"
              size="md"
              className="w-full text-sm sm:text-base"
            >
              <ShoppingCart
                size={18}
                className={lang === "ar" ? "ml-2" : "mr-2"}
              />
              {lang === "ar" ? "تصفح المنتجات" : "Parcourir les produits"}
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-xs sm:text-sm font-medium text-green-700">
                {lang === "ar" ? "معلومة مهمة" : "Information importante"}
              </p>
            </div>
            <p className="text-xs sm:text-sm text-green-600">
              {lang === "ar"
                ? "💡 احتفظ برقم هاتفك مفتوحاً لتأكيد موعد التوصيل"
                : "💡 Gardez votre téléphone à portée pour confirmer la livraison"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
