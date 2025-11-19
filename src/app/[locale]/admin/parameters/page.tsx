/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  useForm,
  UseFormRegister,
  FieldError,
  Controller,
  FieldErrorsImpl,
  Merge,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "@/components/admin/ui/FormInput";
import ImageUpload from "@/components/admin/ui/ImageUpload";
import { siteConfig as siteConfigData } from "@/config/site";
import { Language } from "@/types";
import { useTranslations, useLocale } from "next-intl";
import { useConfigStore } from "@/store/useConfigStore";
import { uploadImageToR2 } from "@/lib/services/R2Service";

// --- Type Definitions ---
// Using a simplified type for the page state, derived from the imported config.
type PageSiteConfig = typeof siteConfigData;

// --- Reusable UI Components ---

interface FormTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  register?: UseFormRegister<any>;
  name?: string;
}
const FormTextArea: React.FC<FormTextAreaProps> = ({
  label,
  id,
  error,
  register,
  name,
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
      {...(register && name ? register(name) : {})}
      {...props}
    />
    {error && typeof error.message === "string" && (
      <p className="text-red-500 text-xs mt-1">{error.message}</p>
    )}
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
  formId?: string;
  onSubmit?: (data: any) => void;
  form?: any;
}
const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  description,
  children,
  footer,
  icon,
  formId,
  onSubmit,
  form,
}) => {
  const handleSubmit = form
    ? form.handleSubmit(onSubmit)
    : (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) onSubmit({});
      };

  return (
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
      <form id={formId} onSubmit={handleSubmit}>
        <div className="p-6 space-y-8">{children}</div>
        {footer && (
          <div className="bg-neutral-50 p-4 rounded-b-xl border-t border-neutral-200/80 flex justify-end">
            {footer}
          </div>
        )}
      </form>
    </div>
  );
};

// --- Settings Page Component ---
export default function SettingsPage() {
  const t = useTranslations("admin.parameters");
  const locale = useLocale() as Language;

  // Use Zustand store
  const {
    config,
    isLoading,
    updateBasicInfo,
    updateBrandAssets,
    updateStoreSettings,
    updateTranslatedContent,
    updateLocationVerification,
    updateContactInfo,
    updateSocialMedia,
  } = useConfigStore();

  const [langTab, setLangTab] = useState<Language>("ar");
  const [selectedFiles, setSelectedFiles] = useState<{
    logo?: File;
    banner?: File;
    favicon?: File;
  }>({});

  // Fallback to static config if store config is not loaded
  const currentConfig = config || siteConfigData;

  // Define schemas with translations
  const basicInfoSchema = z.object({
    name: z.string().min(1, t("validation.storeNameRequired")).optional(),
    brandName: z.string().min(1, t("validation.brandNameRequired")).optional(),
    url: z.string().url(t("validation.invalidUrl")).optional(),
  });

  const brandAssetsSchema = z.object({
    logo: z.string().optional(),
    banner: z.string().optional(),
    favicon: z.string().optional(),
  });

  const storeSettingsSchema = z.object({
    category: z.string().min(1, t("validation.categoryRequired")).optional(),
    defaultLocale: z.enum(["ar", "fr"]).optional(),
    currencies: z
      .object({
        ar: z
          .string()
          .min(1, t("validation.arabicCurrencyRequired"))
          .optional(),
        fr: z
          .string()
          .min(1, t("validation.frenchCurrencyRequired"))
          .optional(),
      })
      .optional(),
  });

  const translatedContentSchema = z.object({
    titleTemplate: z
      .string()
      .min(1, t("validation.titleTemplateRequired"))
      .optional(),
    title: z.record(z.enum(["ar", "fr"]), z.string().optional()).optional(),
    description: z
      .record(z.enum(["ar", "fr"]), z.string().optional())
      .optional(),
    niche: z.record(z.enum(["ar", "fr"]), z.string().optional()).optional(),
    keywords: z
      .record(z.enum(["ar", "fr"]), z.array(z.string()).optional())
      .optional(),
  });

  const locationVerificationSchema = z.object({
    location: z.string().min(1, t("validation.locationRequired")).optional(),
    locationCoordinates: z
      .object({
        lat: z.coerce.number().min(-90).max(90).optional(),
        lng: z.coerce.number().min(-180).max(180).optional(),
      })
      .optional(),
    verification: z
      .object({
        google: z.string().optional(),
      })
      .optional(),
  });

  const contactInfoSchema = z.object({
    contact: z
      .object({
        email: z.string().email(t("validation.invalidEmail")).optional(),
        phone: z.string().min(1, t("validation.phoneRequired")).optional(),
        whatsapp: z
          .string()
          .min(1, t("validation.whatsappRequired"))
          .optional(),
      })
      .optional(),
  });

  const socialMediaSchema = z.object({
    social: z
      .object({
        twitter: z
          .string()
          .min(1, t("validation.twitterHandleRequired"))
          .optional(),
      })
      .optional(),
    socialLinks: z
      .object({
        facebook: z
          .string()
          .url(t("validation.invalidFacebookUrl"))
          .optional()
          .or(z.literal("")),
        instagram: z
          .string()
          .url(t("validation.invalidInstagramUrl"))
          .optional()
          .or(z.literal("")),
        twitter: z
          .string()
          .url(t("validation.invalidTwitterUrl"))
          .optional()
          .or(z.literal("")),
      })
      .optional(),
  });

  // Forms for each section
  const basicInfoForm = useForm({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: currentConfig.name,
      brandName: currentConfig.brandName,
      url: currentConfig.url,
    },
  });

  const brandAssetsForm = useForm({
    resolver: zodResolver(brandAssetsSchema),
    defaultValues: {
      logo: currentConfig.logo || "",
      banner: (currentConfig as any).banner || "",
      favicon: (currentConfig as any).favicon || "",
    },
  });

  const storeSettingsForm = useForm({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      category: currentConfig.category,
      defaultLocale: currentConfig.i18n?.defaultLocale || "ar",
      currencies: currentConfig.currencies,
    },
  });

  const translatedContentForm = useForm({
    resolver: zodResolver(translatedContentSchema),
    defaultValues: {
      titleTemplate: currentConfig.titleTemplate,
      title: currentConfig.title,
      description: currentConfig.description,
      niche: currentConfig.niche,
      keywords: currentConfig.keywords,
    },
  });

  const locationVerificationForm = useForm({
    resolver: zodResolver(locationVerificationSchema),
    defaultValues: {
      location: currentConfig.location,
      locationCoordinates: currentConfig.locationCoordinates,
      verification: currentConfig.verification,
    },
  });

  const contactInfoForm = useForm({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      contact: currentConfig.contact,
    },
  });

  const socialMediaForm = useForm({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      social: currentConfig.social,
      socialLinks: currentConfig.socialLinks,
    },
  });

  // Submit handlers
  const onBasicInfoSubmit = async (data: any) => {
    try {
      await updateBasicInfo(data);
    } catch (error) {
      console.error("Error updating basic info:", error);
    }
  };

  const onBrandAssetsSubmit = async (data: any) => {
    try {
      const updateData: { logo?: string; banner?: string; favicon?: string } =
        {};

      // Upload files if selected
      if (selectedFiles.logo) {
        const logoUrl = await uploadImageToR2(selectedFiles.logo);
        updateData.logo = logoUrl;
      } else if (data.logo) {
        updateData.logo = data.logo;
      }

      if (selectedFiles.banner) {
        const bannerUrl = await uploadImageToR2(selectedFiles.banner);
        updateData.banner = bannerUrl;
      } else if (data.banner) {
        updateData.banner = data.banner;
      }

      if (selectedFiles.favicon) {
        const faviconUrl = await uploadImageToR2(selectedFiles.favicon);
        updateData.favicon = faviconUrl;
      } else if (data.favicon) {
        updateData.favicon = data.favicon;
      }

      await updateBrandAssets(updateData);

      // Clear selected files after successful upload
      setSelectedFiles({});
    } catch (error) {
      console.error("Error updating brand assets:", error);
    }
  };

  const onStoreSettingsSubmit = async (data: any) => {
    try {
      await updateStoreSettings(data);
    } catch (error) {
      console.error("Error updating store settings:", error);
    }
  };

  const onTranslatedContentSubmit = async (data: any) => {
    try {
      await updateTranslatedContent(data);
    } catch (error) {
      console.error("Error updating translated content:", error);
    }
  };

  const onLocationVerificationSubmit = async (data: any) => {
    try {
      await updateLocationVerification(data);
    } catch (error) {
      console.error("Error updating location verification:", error);
    }
  };

  const onContactInfoSubmit = async (data: any) => {
    try {
      await updateContactInfo(data);
    } catch (error) {
      console.error("Error updating contact info:", error);
    }
  };

  const onSocialMediaSubmit = async (data: any) => {
    try {
      await updateSocialMedia(data);
    } catch (error) {
      console.error("Error updating social media:", error);
    }
  };

  const handleImageChange = (
    name: "logo" | "banner" | "favicon",
    file: File
  ) => {
    // Store the selected file for upload when form is submitted
    setSelectedFiles((prev) => ({ ...prev, [name]: file }));
  };

  const handleImageRemove = (name: "logo" | "banner" | "favicon") => {
    // Remove the asset by setting it to empty string
    updateBrandAssets({ [name]: "" });
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

  const SaveButton = ({ formId }: { formId: string }) => (
    <button
      type="submit"
      form={formId}
      className="bg-primary-700 text-white font-bold py-2.5 px-5 rounded-lg hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-700 transition-colors flex items-center gap-2"
    >
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
              footer={<SaveButton formId="basic-info-form" />}
              formId="basic-info-form"
              onSubmit={onBasicInfoSubmit}
              form={basicInfoForm}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label={t("cards.basicInfo.labels.storeName")}
                  register={basicInfoForm.register}
                  name="name"
                  error={basicInfoForm.formState.errors.name}
                />
                <FormInput
                  label={t("cards.basicInfo.labels.brandName")}
                  register={basicInfoForm.register}
                  name="brandName"
                  error={basicInfoForm.formState.errors.brandName}
                />
              </div>
              <FormInput
                label={t("cards.basicInfo.labels.siteUrl")}
                register={basicInfoForm.register}
                name="url"
                type="url"
                error={basicInfoForm.formState.errors.url}
              />
            </SettingsCard>

            <SettingsCard
              icon={<Store size={24} />}
              title={t("cards.brandAssets.title")}
              description={t("cards.brandAssets.description")}
              footer={<SaveButton formId="brand-assets-form" />}
              formId="brand-assets-form"
              onSubmit={onBrandAssetsSubmit}
              form={brandAssetsForm}
            >
              <ImageUpload
                label={t("cards.brandAssets.labels.storeLogo")}
                description={t("cards.brandAssets.descriptions.logo")}
                currentImage={currentConfig.logo || ""}
                onImageChange={(file) => handleImageChange("logo", file)}
                onImageRemove={() => handleImageRemove("logo")}
              />
              <ImageUpload
                label={t("cards.brandAssets.labels.storeBanner")}
                description={t("cards.brandAssets.descriptions.banner")}
                currentImage={(currentConfig as any).banner || ""}
                onImageChange={(file) => handleImageChange("banner", file)}
                onImageRemove={() => handleImageRemove("banner")}
                aspectRatio="aspect-video"
              />
              <ImageUpload
                label={t("cards.brandAssets.labels.favicon")}
                description={t("cards.brandAssets.descriptions.favicon")}
                currentImage={(currentConfig as any).favicon || ""}
                onImageChange={(file) => handleImageChange("favicon", file)}
                onImageRemove={() => handleImageRemove("favicon")}
              />
            </SettingsCard>

            <SettingsCard
              icon={<Store size={24} />}
              title={t("cards.storeSettings.title")}
              description={t("cards.storeSettings.description")}
              footer={<SaveButton formId="store-settings-form" />}
              formId="store-settings-form"
              onSubmit={onStoreSettingsSubmit}
              form={storeSettingsForm}
            >
              <FormInput
                label={t("cards.storeSettings.labels.storeCategory")}
                register={storeSettingsForm.register}
                name="category"
                error={storeSettingsForm.formState.errors.category}
              />
              <Controller
                name="defaultLocale"
                control={storeSettingsForm.control}
                render={({ field }) => (
                  <div>
                    <label
                      htmlFor="i18n.defaultLocale"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t("cards.storeSettings.labels.defaultLanguage")}
                    </label>
                    <select
                      {...field}
                      id="i18n.defaultLocale"
                      className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-700 focus:border-primary-700 border-gray-300"
                    >
                      {currentConfig.i18n?.locales.map((loc) => (
                        <option key={loc} value={loc}>
                          {t(`cards.storeSettings.languages.${loc}`)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label={t("cards.storeSettings.labels.currencyAr")}
                  register={storeSettingsForm.register}
                  name="currencies.ar"
                  error={storeSettingsForm.formState.errors.currencies?.ar}
                />
                <FormInput
                  label={t("cards.storeSettings.labels.currencyFr")}
                  register={storeSettingsForm.register}
                  name="currencies.fr"
                  error={storeSettingsForm.formState.errors.currencies?.fr}
                />
              </div>
            </SettingsCard>

            <SettingsCard
              title={t("cards.translatedContent.title")}
              description={t("cards.translatedContent.description")}
              footer={<SaveButton formId="translated-content-form" />}
              formId="translated-content-form"
              onSubmit={onTranslatedContentSubmit}
              form={translatedContentForm}
            >
              <FormInput
                label={t("cards.translatedContent.labels.titleTemplate")}
                register={translatedContentForm.register}
                name="titleTemplate"
                error={translatedContentForm.formState.errors.titleTemplate}
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
                      register={translatedContentForm.register}
                      name="title.ar"
                      error={translatedContentForm.formState.errors.title?.ar}
                    />
                    <FormTextArea
                      label={t(
                        "cards.translatedContent.labels.siteDescriptionAr"
                      )}
                      register={translatedContentForm.register}
                      name="description.ar"
                      error={
                        translatedContentForm.formState.errors.description?.ar
                      }
                    />
                    <FormInput
                      label={t("cards.translatedContent.labels.storeNicheAr")}
                      register={translatedContentForm.register}
                      name="niche.ar"
                      error={translatedContentForm.formState.errors.niche?.ar}
                    />
                    <Controller
                      name="keywords.ar"
                      control={translatedContentForm.control}
                      render={({ field }) => (
                        <TagInput
                          label={t("cards.translatedContent.labels.keywordsAr")}
                          tags={field.value || []}
                          onTagsChange={field.onChange}
                          placeholder={t(
                            "cards.translatedContent.placeholders.addKeywordAr"
                          )}
                        />
                      )}
                    />
                  </>
                ) : (
                  <>
                    <FormInput
                      label={t("cards.translatedContent.labels.siteTitleFr")}
                      register={translatedContentForm.register}
                      name="title.fr"
                      error={translatedContentForm.formState.errors.title?.fr}
                    />
                    <FormTextArea
                      label={t(
                        "cards.translatedContent.labels.siteDescriptionFr"
                      )}
                      register={translatedContentForm.register}
                      name="description.fr"
                      error={
                        translatedContentForm.formState.errors.description?.fr
                      }
                    />
                    <FormInput
                      label={t("cards.translatedContent.labels.storeNicheFr")}
                      register={translatedContentForm.register}
                      name="niche.fr"
                      error={translatedContentForm.formState.errors.niche?.fr}
                    />
                    <Controller
                      name="keywords.fr"
                      control={translatedContentForm.control}
                      render={({ field }) => (
                        <TagInput
                          label={t("cards.translatedContent.labels.keywordsFr")}
                          tags={field.value || []}
                          onTagsChange={field.onChange}
                          placeholder={t(
                            "cards.translatedContent.placeholders.addKeywordFr"
                          )}
                        />
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
              footer={<SaveButton formId="location-verification-form" />}
              formId="location-verification-form"
              onSubmit={onLocationVerificationSubmit}
              form={locationVerificationForm}
            >
              <FormInput
                label={t("cards.locationVerification.labels.location")}
                register={locationVerificationForm.register}
                name="location"
                error={locationVerificationForm.formState.errors.location}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label={t("cards.locationVerification.labels.latitude")}
                  register={locationVerificationForm.register}
                  name="locationCoordinates.lat"
                  type="number"
                  error={
                    locationVerificationForm.formState.errors
                      .locationCoordinates?.lat
                  }
                />
                <FormInput
                  label={t("cards.locationVerification.labels.longitude")}
                  register={locationVerificationForm.register}
                  name="locationCoordinates.lng"
                  type="number"
                  error={
                    locationVerificationForm.formState.errors
                      .locationCoordinates?.lng
                  }
                />
              </div>
              <FormInput
                label={t(
                  "cards.locationVerification.labels.googleVerification"
                )}
                register={locationVerificationForm.register}
                name="verification.google"
                error={
                  locationVerificationForm.formState.errors.verification?.google
                }
              />
            </SettingsCard>

            <SettingsCard
              icon={<Fingerprint size={24} />}
              title={t("cards.contactInfo.title")}
              description={t("cards.contactInfo.description")}
              footer={<SaveButton formId="contact-info-form" />}
              formId="contact-info-form"
              onSubmit={onContactInfoSubmit}
              form={contactInfoForm}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label={t("cards.contactInfo.labels.email")}
                  register={contactInfoForm.register}
                  name="contact.email"
                  type="email"
                  error={contactInfoForm.formState.errors.contact?.email}
                />
                <FormInput
                  label={t("cards.contactInfo.labels.phone")}
                  register={contactInfoForm.register}
                  name="contact.phone"
                  type="tel"
                  error={contactInfoForm.formState.errors.contact?.phone}
                />
                <FormInput
                  label={t("cards.contactInfo.labels.whatsapp")}
                  register={contactInfoForm.register}
                  name="contact.whatsapp"
                  type="tel"
                  error={contactInfoForm.formState.errors.contact?.whatsapp}
                />
              </div>
            </SettingsCard>

            <SettingsCard
              title={t("cards.socialMedia.title")}
              description={t("cards.socialMedia.description")}
              footer={<SaveButton formId="social-media-form" />}
              formId="social-media-form"
              onSubmit={onSocialMediaSubmit}
              form={socialMediaForm}
            >
              <FormInput
                label={t("cards.socialMedia.labels.twitterHandle")}
                register={socialMediaForm.register}
                name="social.twitter"
                error={socialMediaForm.formState.errors.social?.twitter}
              />
              <FormInput
                label={t("cards.socialMedia.labels.facebookLink")}
                register={socialMediaForm.register}
                name="socialLinks.facebook"
                type="url"
                error={socialMediaForm.formState.errors.socialLinks?.facebook}
              />
              <FormInput
                label={t("cards.socialMedia.labels.instagramLink")}
                register={socialMediaForm.register}
                name="socialLinks.instagram"
                type="url"
                error={socialMediaForm.formState.errors.socialLinks?.instagram}
              />
              <FormInput
                label={t("cards.socialMedia.labels.twitterLink")}
                register={socialMediaForm.register}
                name="socialLinks.twitter"
                type="url"
                error={socialMediaForm.formState.errors.socialLinks?.twitter}
              />
            </SettingsCard>
          </main>
        </div>
      </div>
    </div>
  );
}
