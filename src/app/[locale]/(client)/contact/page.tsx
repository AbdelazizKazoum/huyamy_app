import React from "react";
import { Phone, Mail, Instagram, Facebook } from "lucide-react";
import MapWrapper from "./components/MapWrapper";

// --- Type Definitions ---

type Language = "ar" | "fr";

interface ContactPageProps {
  params: {
    locale: Language;
  };
}

// --- SVG Icon Components ---
const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

// --- Components ---

const ContactItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  href: string;
}> = ({ icon, title, value, href }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700 transition-all duration-300 hover:border-primary-700 dark:hover:border-primary-500 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="flex items-center gap-5">
        <div className="text-primary-800 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 p-4 rounded-full transition-colors duration-300 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/50">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-200">
            {title}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 transition-colors duration-300 group-hover:text-primary-800 dark:group-hover:text-primary-300">
            {value}
          </p>
        </div>
      </div>
    </a>
  );
};

// --- Main Page Component ---
export default function ContactPage({ params }: ContactPageProps) {
  const lang = params.locale;

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="bg-background-primary dark:bg-neutral-900"
      style={{ fontFamily: "'Cairo', sans-serif" }}
    >
      <main className="py-12 sm:py-16">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-neutral-100">
              {lang === "ar" ? "تواصل معنا" : "Contactez-nous"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-text-secondary dark:text-neutral-400 max-w-xl mx-auto">
              {lang === "ar"
                ? "يسعدنا التواصل معك! سواء كان لديك سؤال حول منتجاتنا أو خدماتنا أو الأسعار أو أي شيء آخر، فريقنا جاهز للإجابة على جميع استفساراتك."
                : "Nous sommes ravis de vous entendre ! Que vous ayez une question sur nos produits, nos services, nos prix ou toute autre chose, notre équipe est prête à répondre à toutes vos demandes."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left Column: Contact Info */}
            <div className="space-y-6">
              <ContactItem
                icon={<Phone size={28} />}
                title={lang === "ar" ? "الهاتف" : "Téléphone"}
                value="+212 5 00 00 00 00"
                href="tel:+212500000000"
              />
              <ContactItem
                icon={<Mail size={28} />}
                title={lang === "ar" ? "البريد الإلكتروني" : "Email"}
                value="contact@huyamy.ma"
                href="mailto:contact@huyamy.ma"
              />
              <ContactItem
                icon={<WhatsAppIcon />}
                title="WhatsApp"
                value="+212 6 00 00 00 00"
                href="https://wa.me/212600000000"
              />
              <div className="text-center pt-8">
                <h3 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 mb-6">
                  {lang === "ar" ? "تابعنا على" : "Suivez-nous sur"}
                </h3>
                <div className="flex justify-center gap-8">
                  <a
                    href="#"
                    aria-label="Facebook"
                    className="text-[#1877F2] hover:text-[#1450A3] transition-all duration-300 hover:scale-110"
                  >
                    <Facebook size={36} />
                  </a>
                  <a
                    href="#"
                    aria-label="Instagram"
                    className="text-[#E4405F] hover:text-[#C13584] transition-all duration-300 hover:scale-110"
                  >
                    <Instagram size={36} />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Lazy Loaded Map */}
            <MapWrapper />
          </div>
        </div>
      </main>
    </div>
  );
}
