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
          <div className="flex justify-center gap-6">
            <a
              href="#"
              aria-label="Facebook"
              className="text-neutral-500 hover:text-primary-800 transition-transform hover:scale-110"
            >
              <i className="fab fa-facebook-f text-xl"></i>
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="text-neutral-500 hover:text-primary-800 transition-transform hover:scale-110"
            >
              <i className="fab fa-instagram text-xl"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
