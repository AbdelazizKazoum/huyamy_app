import React from "react";
import { Phone, Mail, Instagram, Facebook } from "lucide-react";
import MapWrapper from "@/components/MapWrapper";
import { getTranslations } from "next-intl/server";
import { Language } from "@/types";
import { siteConfig } from "@/config/site";

// --- Type Definitions ---

interface ContactPageProps {
  params: Promise<{ locale: Language }>;
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
      className="group block p-6 bg-neutral-50 rounded-xl border border-neutral-200 transition-all duration-300 hover:border-primary-700 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="flex items-center gap-5">
        <div className="text-primary-800 bg-primary-100 p-4 rounded-full transition-colors duration-300 group-hover:bg-primary-200">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-lg text-neutral-800">{title}</h3>
          <p className="text-neutral-600 transition-colors duration-300 group-hover:text-primary-800">
            {value}
          </p>
        </div>
      </div>
    </a>
  );
};

// --- Main Page Component ---
export default async function ContactPage({ params }: ContactPageProps) {
  const t = await getTranslations("contact");
  const { locale } = await params;

  // Get contact info from siteConfig
  const { contact, socialLinks, location } = siteConfig;

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="bg-background-primary"
      style={{ fontFamily: "'Cairo', sans-serif" }}
    >
      <main className="py-12 sm:py-16">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
              {t("title")}
            </h1>
            <p className="mt-2 text-sm leading-6 text-text-secondary max-w-xl mx-auto">
              {t("description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left Column: Contact Info */}
            <div className="space-y-6">
              {location && location.trim() !== "" && (
                <ContactItem
                  icon={
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
                      <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  }
                  title={t("location") || "Location"}
                  value={location}
                  href="#"
                />
              )}
              <ContactItem
                icon={<Phone size={28} />}
                title={t("phone")}
                value={contact.phone}
                href={`tel:${contact.phone.replace(/\s+/g, "")}`}
              />
              <ContactItem
                icon={<Mail size={28} />}
                title={t("email")}
                value={contact.email}
                href={`mailto:${contact.email}`}
              />
              <ContactItem
                icon={<WhatsAppIcon />}
                title="WhatsApp"
                value={contact.whatsapp}
                href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
              />
              <div className="text-center pt-8">
                <h3 className="font-bold text-xl text-neutral-800 mb-6">
                  {t("followUs")}
                </h3>
                <div className="flex justify-center gap-8">
                  {socialLinks.facebook && (
                    <a
                      href={socialLinks.facebook}
                      aria-label="Facebook"
                      className="text-[#1877F2] hover:text-[#1450A3] transition-all duration-300 hover:scale-110"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Facebook size={36} />
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a
                      href={socialLinks.instagram}
                      aria-label="Instagram"
                      className="text-[#E4405F] hover:text-[#C13584] transition-all duration-300 hover:scale-110"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram size={36} />
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a
                      href={socialLinks.twitter}
                      aria-label="Twitter"
                      className="text-[#1DA1F2] hover:text-[#0d8ddb] transition-all duration-300 hover:scale-110"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.43.36a9.09 9.09 0 01-2.88 1.1A4.52 4.52 0 0016.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.11 1.03C7.69 5.4 4.07 3.67 1.64.9c-.38.65-.6 1.4-.6 2.2 0 1.52.77 2.86 1.94 3.65A4.48 4.48 0 01.96 6.1v.06c0 2.13 1.52 3.91 3.54 4.31-.37.1-.76.16-1.16.16-.28 0-.55-.03-.81-.08.55 1.72 2.16 2.97 4.07 3A9.06 9.06 0 010 21.54a12.8 12.8 0 006.92 2.03c8.3 0 12.85-6.88 12.85-12.85 0-.2 0-.39-.01-.58A9.22 9.22 0 0023 3z"
                          fill="currentColor"
                        />
                      </svg>
                    </a>
                  )}
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
