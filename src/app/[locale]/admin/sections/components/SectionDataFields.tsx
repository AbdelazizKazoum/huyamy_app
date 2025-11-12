"use client";

import React from "react";
import FormInput from "@/components/admin/ui/FormInput";
import { useTranslations } from "next-intl";

interface SectionDataFieldsProps {
  titleAr: string;
  titleFr: string;
  subtitleAr: string;
  subtitleFr: string;
  onTitleArChange: (value: string) => void;
  onTitleFrChange: (value: string) => void;
  onSubtitleArChange: (value: string) => void;
  onSubtitleFrChange: (value: string) => void;
}

const SectionDataFields: React.FC<SectionDataFieldsProps> = ({
  titleAr,
  titleFr,
  subtitleAr,
  subtitleFr,
  onTitleArChange,
  onTitleFrChange,
  onSubtitleArChange,
  onSubtitleFrChange,
}) => {
  const t = useTranslations("admin.sections.modal");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormInput
        label={t("labels.titleAr")}
        id="titleAr"
        value={titleAr}
        onChange={(e) => onTitleArChange(e.target.value)}
      />
      <FormInput
        label={t("labels.titleFr")}
        id="titleFr"
        value={titleFr}
        onChange={(e) => onTitleFrChange(e.target.value)}
      />
      <FormInput
        label={t("labels.subtitleAr")}
        id="subtitleAr"
        value={subtitleAr}
        onChange={(e) => onSubtitleArChange(e.target.value)}
      />
      <FormInput
        label={t("labels.subtitleFr")}
        id="subtitleFr"
        value={subtitleFr}
        onChange={(e) => onSubtitleFrChange(e.target.value)}
      />
    </div>
  );
};

export default SectionDataFields;