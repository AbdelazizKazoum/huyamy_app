"use client";
import React, { useState } from "react";
import {
  X,
  Settings,
  CreditCard,
  Puzzle,
  Save,
  MapPin,
  Fingerprint,
  Store,
} from "lucide-react";
import FormInput from "@/components/admin/ui/FormInput";
import ImageUpload from "@/components/admin/ui/ImageUpload";
import { siteConfig as siteConfigData } from "@/config/site";
import { Language } from "@/types";
import { useTranslations, useLocale } from "next-intl";

// --- Type Definitions ---
// Using a simplified type for the page state, derived from the imported config.
type PageSiteConfig = typeof siteConfigData;

// --- Reusable UI Components ---

interface FormTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}
const FormTextArea: React.FC<FormTextAreaProps> = ({
  label,
  id,
  error,
  ...props
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <textarea
      id={id}
      rows={3}
      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-700 focus:border-primary-700 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
      {...props}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

interface TagInputProps {
  label: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
}
const TagInput: React.FC<TagInputProps> = ({
  label,
  tags,
  onTagsChange,
  placeholder,
}) => {
  const [input, setInput] = useState("");

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) {
        onTagsChange([...tags, input.trim()]);
      }
      setInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm flex flex-wrap gap-2 items-center focus-within:ring-1 focus-within:ring-primary-700 focus-within:border-primary-700">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1.5 bg-primary-100 text-primary-800 text-sm font-medium px-2.5 py-1 rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-primary-700 hover:text-red-500"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={addTag}
          className="flex-1 bg-transparent focus:outline-none min-w-[120px] text-sm"
          placeholder={placeholder || "Add a tag and press Enter..."}
        />
      </div>
    </div>
  );
};

interface SettingsCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  icon?: React.ReactNode;
}
const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  description,
  children,
  footer,
  icon,
}) => (
  <div className="bg-white rounded-xl shadow-md border border-neutral-200/80">
    <div className="p-6 border-b border-neutral-200/80 flex items-start gap-4">
      {icon && <div className="text-primary-700 mt-1">{icon}</div>}
      <div>
        <h3 className="text-xl font-semibold text-neutral-900">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
        )}
      </div>
    </div>
    <div className="p-6 space-y-8">{children}</div>
    {footer && (
      <div className="bg-neutral-50 p-4 rounded-b-xl border-t border-neutral-200/80 flex justify-end">
        {footer}
      </div>
    )}
  </div>
);

// --- Settings Page Component ---
export default function SettingsPage() {
  const t = useTranslations("admin.parameters");
  const locale = useLocale() as Language;

  const [config, setConfig] = useState<PageSiteConfig>(siteConfigData);
  const [langTab, setLangTab] = useState<Language>("ar");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    setConfig((prev) => {
      const newState = JSON.parse(JSON.stringify(prev)); // Deep copy
      let currentLevel = newState;

      for (let i = 0; i < keys.length - 1; i++) {
        currentLevel = currentLevel[keys[i]];
      }

      currentLevel[keys[keys.length - 1]] = value;
      return newState;
    });
  };

  const handleImageChange = (
    name: "logo" | "banner" | "favicon",
    file: File
  ) => {
    // In a real app, you'd upload the file and get a URL from your storage service.
    // For this mock, we'll use a blob URL for instant preview.
    // This blob URL will replace the existing path or URL in the state.
    setConfig((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
  };

  const handleImageRemove = (name: "logo" | "banner" | "favicon") => {
    setConfig((prev) => ({ ...prev, [name]: "" }));
  };

  const handleLocalizedChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const key = name.split(".")[0] as keyof PageSiteConfig;

    setConfig((prev) => ({
      ...prev,
      [key]: {
        ...(typeof prev[key] === "object" && prev[key] !== null
          ? prev[key]
          : {}),
        [langTab]: value,
      },
    }));
  };

  const handleKeywordsChange = (lang: Language, newKeywords: string[]) => {
    setConfig((prev) => ({
      ...prev,
      keywords: {
        ...prev.keywords,
        [lang]: newKeywords,
      },
    }));
  };

  const NavButton = ({
    icon,
    label,
    isActive,
  }: {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
  }) => (
    <button
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-right ${
        isActive
          ? "bg-primary-100 text-primary-700"
          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  const SaveButton = () => (
    <button className="bg-primary-700 text-white font-bold py-2.5 px-5 rounded-lg hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-700 transition-colors flex items-center gap-2">
      <Save size={16} />
      <span>{t("buttons.saveChanges")}</span>
    </button>
  );

  return (
    <div className="bg-neutral-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-neutral-900">
            {t("header.title")}
          </h1>
          <p className="mt-2 text-neutral-600">{t("header.description")}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Settings Navigation */}
          <aside className="lg:col-span-1">
            <nav className="flex flex-col space-y-1.5 sticky top-8">
              <NavButton
                icon={<Settings size={20} />}
                label={t("navigation.siteSettings")}
                isActive={true}
              />
              <NavButton
                icon={<CreditCard size={20} />}
                label={t("navigation.shippingPayment")}
                isActive={false}
              />
              <NavButton
                icon={<Puzzle size={20} />}
                label={t("navigation.integrations")}
                isActive={false}
              />
            </nav>
          </aside>

          {/* Settings Form */}
          <main className="lg:col-span-3 space-y-8">
            <SettingsCard
              icon={<Settings size={24} />}
              title={t("cards.basicInfo.title")}
              description={t("cards.basicInfo.description")}
              footer={<SaveButton />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label={t("cards.basicInfo.labels.storeName")}
                  id="name"
                  name="name"
                  value={config.name}
                  onChange={handleInputChange}
                />
                <FormInput
                  label={t("cards.basicInfo.labels.brandName")}
                  id="brandName"
                  name="brandName"
                  value={config.brandName}
                  onChange={handleInputChange}
                />
              </div>
              <FormInput
                label={t("cards.basicInfo.labels.siteUrl")}
                id="url"
                name="url"
                type="url"
                value={config.url}
                onChange={handleInputChange}
              />
            </SettingsCard>

            <SettingsCard
              icon={<Store size={24} />}
              title={t("cards.brandAssets.title")}
              description={t("cards.brandAssets.description")}
              footer={<SaveButton />}
            >
              <ImageUpload
                label={t("cards.brandAssets.labels.storeLogo")}
                description={t("cards.brandAssets.descriptions.logo")}
                currentImage={config.logo}
                onImageChange={(file) => handleImageChange("logo", file)}
                onImageRemove={() => handleImageRemove("logo")}
              />
              <ImageUpload
                label={t("cards.brandAssets.labels.storeBanner")}
                description={t("cards.brandAssets.descriptions.banner")}
                currentImage={""} // Assuming banner is not in site.ts, add it if needed
                onImageChange={(file) => handleImageChange("banner", file)}
                onImageRemove={() => handleImageRemove("banner")}
                aspectRatio="aspect-video"
              />
              <ImageUpload
                label={t("cards.brandAssets.labels.favicon")}
                description={t("cards.brandAssets.descriptions.favicon")}
                currentImage={""} // Assuming favicon is not in site.ts, add it if needed
                onImageChange={(file) => handleImageChange("favicon", file)}
                onImageRemove={() => handleImageRemove("favicon")}
              />
            </SettingsCard>

            <SettingsCard
              icon={<Store size={24} />}
              title={t("cards.storeSettings.title")}
              description={t("cards.storeSettings.description")}
              footer={<SaveButton />}
            >
              <FormInput
                label={t("cards.storeSettings.labels.storeCategory")}
                id="category"
                name="category"
                value={config.category}
                onChange={handleInputChange}
              />
              <div>
                <label
                  htmlFor="i18n.defaultLocale"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("cards.storeSettings.labels.defaultLanguage")}
                </label>
                <select
                  id="i18n.defaultLocale"
                  name="i18n.defaultLocale"
                  value={config.i18n.defaultLocale}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-700 focus:border-primary-700 border-gray-300"
                >
                  {config.i18n.locales.map((loc) => (
                    <option key={loc} value={loc}>
                      {t(`cards.storeSettings.languages.${loc}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label={t("cards.storeSettings.labels.currencyAr")}
                  id="currencies.ar"
                  name="currencies.ar"
                  value={config.currencies.ar}
                  onChange={handleInputChange}
                />
                <FormInput
                  label={t("cards.storeSettings.labels.currencyFr")}
                  id="currencies.fr"
                  name="currencies.fr"
                  value={config.currencies.fr}
                  onChange={handleInputChange}
                />
              </div>
            </SettingsCard>

            <SettingsCard
              title={t("cards.translatedContent.title")}
              description={t("cards.translatedContent.description")}
              footer={<SaveButton />}
            >
              <FormInput
                label={t("cards.translatedContent.labels.titleTemplate")}
                id="titleTemplate"
                name="titleTemplate"
                value={config.titleTemplate}
                onChange={handleInputChange}
              />
              <div className="border-b border-neutral-200/80">
                <nav
                  className="flex gap-2 p-1 bg-neutral-100 rounded-lg w-min"
                  dir="rtl"
                >
                  <button
                    onClick={() => setLangTab("ar")}
                    className={`py-1.5 px-4 rounded-md text-sm font-semibold transition-colors ${
                      langTab === "ar"
                        ? "bg-white text-primary-700 shadow-sm"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    {t("cards.translatedContent.tabs.ar")}
                  </button>
                  <button
                    onClick={() => setLangTab("fr")}
                    className={`py-1.5 px-4 rounded-md text-sm font-semibold transition-colors ${
                      langTab === "fr"
                        ? "bg-white text-primary-700 shadow-sm"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    {t("cards.translatedContent.tabs.fr")}
                  </button>
                </nav>
              </div>
              <div className="pt-4 space-y-6">
                {langTab === "ar" ? (
                  <>
                    <FormInput
                      label={t("cards.translatedContent.labels.siteTitleAr")}
                      id="title.ar"
                      name="title"
                      value={config.title.ar}
                      onChange={handleLocalizedChange}
                    />
                    <FormTextArea
                      label={t(
                        "cards.translatedContent.labels.siteDescriptionAr"
                      )}
                      id="description.ar"
                      name="description"
                      value={config.description.ar}
                      onChange={handleLocalizedChange}
                    />
                    <FormInput
                      label={t("cards.translatedContent.labels.storeNicheAr")}
                      id="niche.ar"
                      name="niche"
                      value={config.niche.ar}
                      onChange={handleLocalizedChange}
                    />
                    <TagInput
                      label={t("cards.translatedContent.labels.keywordsAr")}
                      tags={config.keywords.ar}
                      onTagsChange={(tags) => handleKeywordsChange("ar", tags)}
                      placeholder={t(
                        "cards.translatedContent.placeholders.addKeywordAr"
                      )}
                    />
                  </>
                ) : (
                  <>
                    <FormInput
                      label={t("cards.translatedContent.labels.siteTitleFr")}
                      id="title.fr"
                      name="title"
                      value={config.title.fr}
                      onChange={handleLocalizedChange}
                    />
                    <FormTextArea
                      label={t(
                        "cards.translatedContent.labels.siteDescriptionFr"
                      )}
                      id="description.fr"
                      name="description"
                      value={config.description.fr}
                      onChange={handleLocalizedChange}
                    />
                    <FormInput
                      label={t("cards.translatedContent.labels.storeNicheFr")}
                      id="niche.fr"
                      name="niche"
                      value={config.niche.fr}
                      onChange={handleLocalizedChange}
                    />
                    <TagInput
                      label={t("cards.translatedContent.labels.keywordsFr")}
                      tags={config.keywords.fr}
                      onTagsChange={(tags) => handleKeywordsChange("fr", tags)}
                      placeholder={t(
                        "cards.translatedContent.placeholders.addKeywordFr"
                      )}
                    />
                  </>
                )}
              </div>
            </SettingsCard>

            <SettingsCard
              icon={<MapPin size={24} />}
              title={t("cards.locationVerification.title")}
              description={t("cards.locationVerification.description")}
              footer={<SaveButton />}
            >
              <FormInput
                label={t("cards.locationVerification.labels.location")}
                id="location"
                name="location"
                value={config.location}
                onChange={handleInputChange}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label={t("cards.locationVerification.labels.latitude")}
                  id="locationCoordinates.lat"
                  name="locationCoordinates.lat"
                  type="number"
                  value={config.locationCoordinates?.lat}
                  onChange={handleInputChange}
                />
                <FormInput
                  label={t("cards.locationVerification.labels.longitude")}
                  id="locationCoordinates.lng"
                  name="locationCoordinates.lng"
                  type="number"
                  value={config.locationCoordinates?.lng}
                  onChange={handleInputChange}
                />
              </div>
              <FormInput
                label={t(
                  "cards.locationVerification.labels.googleVerification"
                )}
                id="verification.google"
                name="verification.google"
                value={config.verification?.google}
                onChange={handleInputChange}
              />
            </SettingsCard>

            <SettingsCard
              icon={<Fingerprint size={24} />}
              title={t("cards.contactInfo.title")}
              description={t("cards.contactInfo.description")}
              footer={<SaveButton />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label={t("cards.contactInfo.labels.email")}
                  id="contact.email"
                  name="contact.email"
                  type="email"
                  value={config.contact.email}
                  onChange={handleInputChange}
                />
                <FormInput
                  label={t("cards.contactInfo.labels.phone")}
                  id="contact.phone"
                  name="contact.phone"
                  type="tel"
                  value={config.contact.phone}
                  onChange={handleInputChange}
                />
                <FormInput
                  label={t("cards.contactInfo.labels.whatsapp")}
                  id="contact.whatsapp"
                  name="contact.whatsapp"
                  type="tel"
                  value={config.contact.whatsapp}
                  onChange={handleInputChange}
                />
              </div>
            </SettingsCard>

            <SettingsCard
              title={t("cards.socialMedia.title")}
              description={t("cards.socialMedia.description")}
              footer={<SaveButton />}
            >
              <FormInput
                label={t("cards.socialMedia.labels.twitterHandle")}
                id="social.twitter"
                name="social.twitter"
                value={config.social.twitter}
                onChange={handleInputChange}
              />
              <FormInput
                label={t("cards.socialMedia.labels.facebookLink")}
                id="socialLinks.facebook"
                name="socialLinks.facebook"
                type="url"
                value={config.socialLinks.facebook}
                onChange={handleInputChange}
              />
              <FormInput
                label={t("cards.socialMedia.labels.instagramLink")}
                id="socialLinks.instagram"
                name="socialLinks.instagram"
                type="url"
                value={config.socialLinks.instagram}
                onChange={handleInputChange}
              />
              <FormInput
                label={t("cards.socialMedia.labels.twitterLink")}
                id="socialLinks.twitter"
                name="socialLinks.twitter"
                type="url"
                value={config.socialLinks.twitter}
                onChange={handleInputChange}
              />
            </SettingsCard>
          </main>
        </div>
      </div>
    </div>
  );
}
