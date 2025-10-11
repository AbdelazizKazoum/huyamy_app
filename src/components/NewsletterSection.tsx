import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

const NewsletterSection: React.FC = () => {
  const t = useTranslations("newsletter");
  const locale = useLocale(); // Get current locale
  const isRTL = locale === "ar"; // Adjust if you have other RTL languages

  return (
    <div
      className="py-10 sm:py-16"
      style={{
        background:
          "linear-gradient(135deg, var(--color-primary-100) 0%, var(--color-secondary-50) 100%)",
        borderRadius: "1.5rem",
        boxShadow: "0 4px 24px var(--color-shadow-light)",
        margin: "0 1rem",
      }}
    >
      <div className="container max-w-screen-md mx-auto px-4 sm:px-8 text-center">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-800 mb-3 sm:mb-4"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          {t("title")}
        </h2>
        <p className="text-neutral-600 max-w-2xl mx-auto mb-6 sm:mb-8 text-base sm:text-lg">
          {t("description")}
        </p>
        <form className="max-w-md mx-auto">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-0 items-stretch bg-white rounded-2xl shadow-lg border border-neutral-200 p-2 sm:p-1">
            <input
              type="email"
              placeholder={t("placeholder")}
              className={`flex-1 px-5 py-3 text-base bg-transparent text-neutral-800 placeholder-neutral-500 focus:outline-none focus:placeholder-neutral-400 rounded-xl transition-all duration-200 border border-neutral-200 sm:border-none ${
                isRTL
                  ? "sm:rounded-r-2xl sm:rounded-l-none"
                  : "sm:rounded-l-2xl sm:rounded-r-none"
              }`}
              required
            />
            <button
              type="submit"
              className={`w-full sm:w-auto bg-gradient-to-r from-primary-700 to-primary-800 hover:from-primary-800 hover:to-primary-900 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-4 focus:ring-primary-200 ${
                isRTL
                  ? "sm:rounded-l-2xl sm:rounded-r-none"
                  : "sm:rounded-r-2xl sm:rounded-l-none"
              }`}
            >
              {t("subscribe")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsletterSection;
