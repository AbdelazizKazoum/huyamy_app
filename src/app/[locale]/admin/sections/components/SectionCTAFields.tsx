"use client";

import React from "react";
import FormInput from "@/components/admin/ui/FormInput";
import { useTranslations } from "next-intl";

interface SectionCTAFieldsProps {
  ctaTextAr: string;
  ctaTextFr: string;
  ctaUrl: string;
  onCtaTextArChange: (value: string) => void;
  onCtaTextFrChange: (value: string) => void;
  onCtaUrlChange: (value: string) => void;
}

const SectionCTAFields: React.FC<SectionCTAFieldsProps> = ({
  ctaTextAr,
  ctaTextFr,
  ctaUrl,
  onCtaTextArChange,
  onCtaTextFrChange,
  onCtaUrlChange,
}) => {
  const t = useTranslations("admin.sections.modal");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <FormInput
        label={t("labels.ctaTextAr")}
        id="ctaTextAr"
        value={ctaTextAr}
        onChange={(e) => onCtaTextArChange(e.target.value)}
      />
      <FormInput
        label={t("labels.ctaTextFr")}
        id="ctaTextFr"
        value={ctaTextFr}
        onChange={(e) => onCtaTextFrChange(e.target.value)}
      />
      <FormInput
        label={t("labels.ctaUrl")}
        id="ctaUrl"
        value={ctaUrl}
        onChange={(e) => onCtaUrlChange(e.target.value)}
      />
    </div>
  );
};

export default SectionCTAFields;
