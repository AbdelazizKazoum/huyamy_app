import React from "react";
import { SketchPicker, ColorResult } from "react-color";
import CancelButton from "../ui/CancelButton";
import SubmitButton from "../ui/SubmitButton";

interface ColorPickerModalProps {
  isOpen: boolean;
  color: string;
  onChange: (color: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

const presetColors = [
  "#D0021B",
  "#F5A623",
  "#F8E71C",
  "#8B572A",
  "#7ED321",
  "#4A90E2",
  "#BD10E0",
  "#9013FE",
  "#4A4A4A",
  "#000000",
  "#FFFFFF",
  "#B8E986",
  "#50E3C2",
  "#E8FFB1",
];

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  isOpen,
  color,
  onChange,
  onCancel,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-[60] flex justify-center items-center p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-lg shadow-xl p-6 space-y-4 w-full max-w-sm"
      >
        <h3 className="text-lg font-medium text-center">اختر لون</h3>
        <div className="w-full">
          <SketchPicker
            color={color}
            onChange={(c: ColorResult) => onChange(c.hex)}
            presetColors={presetColors}
            styles={{
              default: {
                picker: {
                  width: "100% !important",
                  boxSizing: "border-box",
                },
              },
            }}
          />
        </div>
        <div className="flex justify-end gap-3 pt-3 border-t">
          <CancelButton onClick={onCancel}>إلغاء</CancelButton>
          <SubmitButton onClick={onSubmit} isSubmitting={false}>
            إضافة اللون
          </SubmitButton>
        </div>
      </div>
    </div>
  );
};

export default ColorPickerModal;
