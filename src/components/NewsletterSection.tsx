import { useTranslations } from "next-intl";

const NewsletterSection: React.FC = () => {
  const t = useTranslations("newsletter");

  return (
    <div className="bg-secondary-50/70 py-16 sm:py-24">
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          {t("title")}
        </h2>
        <p className="text-neutral-600 max-w-2xl mx-auto mb-8">
          {t("description")}
        </p>
        <form
          className="max-w-lg mx-auto"
          //   onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex items-center bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-200 hover:border-primary-500 p-1.5">
            <input
              type="email"
              placeholder={t("placeholder")}
              className="flex-1 px-6 py-4 text-base bg-transparent text-neutral-800 placeholder-neutral-500 focus:outline-none focus:placeholder-neutral-400 rounded-l-full rtl:rounded-l-none rtl:rounded-r-full transition-all duration-200"
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-primary-700 to-primary-800 hover:from-primary-800 hover:to-primary-900 text-white font-semibold px-8 py-4 rounded-full shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-4 focus:ring-primary-200"
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
