import { Language } from "@/types";
import { Loader2, ShoppingCart } from "lucide-react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "use-intl";

// A separate component for the button to use the `useFormStatus` hook.
const SubmitButton = ({ lang }: { lang: Language }) => {
  const { pending } = useFormStatus();
  const t = useTranslations("checkout");

  return (
    <>
      {/* Add the animations styles */}
      <style jsx>{`
        @keyframes ring {
          0% {
            transform: rotate(0);
          }
          1% {
            transform: rotate(15deg);
          }
          3% {
            transform: rotate(-14deg);
          }
          5% {
            transform: rotate(17deg);
          }
          7% {
            transform: rotate(-16deg);
          }
          9% {
            transform: rotate(15deg);
          }
          11% {
            transform: rotate(-14deg);
          }
          13% {
            transform: rotate(13deg);
          }
          15% {
            transform: rotate(-12deg);
          }
          17% {
            transform: rotate(12deg);
          }
          19% {
            transform: rotate(-10deg);
          }
          21% {
            transform: rotate(9deg);
          }
          23% {
            transform: rotate(-8deg);
          }
          25% {
            transform: rotate(7deg);
          }
          27% {
            transform: rotate(-5deg);
          }
          29% {
            transform: rotate(5deg);
          }
          31% {
            transform: rotate(-4deg);
          }
          33% {
            transform: rotate(3deg);
          }
          35% {
            transform: rotate(-2deg);
          }
          37% {
            transform: rotate(1deg);
          }
          39% {
            transform: rotate(-1deg);
          }
          41% {
            transform: rotate(1deg);
          }
          43% {
            transform: rotate(0);
          }
          100% {
            transform: rotate(0);
          }
        }
        .animate-ring {
          animation: ring 3s ease-in-out 0.7s infinite;
        }

        @keyframes slide-right-left {
          0%,
          100% {
            transform: translateX(5px);
          }
          50% {
            transform: translateX(-5px);
          }
        }
        .animate-slide {
          animation: slide-right-left 2.5s ease-in-out infinite;
        }

        @keyframes shiny-effect {
          0% {
            transform: translateX(-150%) skewX(-25deg);
          }
          100% {
            transform: translateX(250%) skewX(-25deg);
          }
        }
        .animate-shiny::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shiny-effect 3s infinite linear;
        }
      `}</style>

      <button
        type="submit"
        disabled={pending}
        className={`w-full cursor-pointer bg-primary-800 text-white font-bold py-4 px-6 rounded-full text-lg hover:bg-primary-900 transition-all duration-300 relative overflow-hidden disabled:bg-gray-500 disabled:cursor-not-allowed ${
          !pending ? "animate-slide animate-shiny" : ""
        }`}
      >
        <span className="flex items-center justify-center">
          {pending ? (
            <>
              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
              {t("processing")}
            </>
          ) : (
            <>
              {t("buyNowButton")}
              <ShoppingCart
                className={
                  lang === "ar" ? "mr-3 animate-ring" : "ml-3 animate-ring"
                }
                size={24}
              />
            </>
          )}
        </span>
      </button>
    </>
  );
};

export default SubmitButton;
