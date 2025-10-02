import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

const Footer: React.FC = () => {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="bg-neutral-50 text-neutral-800 border-t border-neutral-200">
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${
            locale === "ar" ? "text-right" : "text-left"
          }`}
        >
          <div className="md:col-span-1">
            <a
              href="#"
              className={`flex items-center mb-4 ${
                locale === "ar" ? "justify-start" : "justify-start"
              }`}
            >
              <Image
                src="/images/huyami_logo.jpeg"
                alt="Huyamy Coopérative"
                width={160}
                height={80}
                className="h-16 w-auto object-contain"
              />
            </a>
            <p className="text-neutral-600 mt-4">{t("description")}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-neutral-800">
              {t("customerService.title")}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-neutral-600 hover:text-primary-800 transition-colors"
                >
                  {t("customerService.aboutStore")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-600 hover:text-primary-800 transition-colors"
                >
                  {t("customerService.shipping")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-600 hover:text-primary-800 transition-colors"
                >
                  {t("customerService.contact")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-600 hover:text-primary-800 transition-colors"
                >
                  {t("customerService.callUs")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-neutral-800">
              {t("importantInfo.title")}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-neutral-600 hover:text-primary-800 transition-colors"
                >
                  {t("importantInfo.faq")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-600 hover:text-primary-800 transition-colors"
                >
                  {t("importantInfo.trustWarranty")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-600 hover:text-primary-800 transition-colors"
                >
                  {t("importantInfo.terms")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-600 hover:text-primary-800 transition-colors"
                >
                  {t("importantInfo.privacy")}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-300 mt-12 pt-8 text-center text-neutral-500">
          <p className="mb-4">
            &copy; {new Date().getFullYear()} Huyamy. {t("copyright")}
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#"
              aria-label="Facebook"
              className="group flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-blue-500 hover:scale-110"
            >
              <svg
                className="w-5 h-5 text-blue-600 transition-transform duration-300"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="group flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-pink-500 hover:scale-110"
            >
              <svg
                className="w-5 h-5 text-pink-600 transition-transform duration-300"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
