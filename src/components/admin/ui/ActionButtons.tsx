"use client";

import { Edit, Trash2 } from "lucide-react";

interface ActionButtonsProps<T> {
  t: (key: string, values?: Record<string, string | number>) => string;
  item: T;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  getId: (item: T) => string;
}

export default function ActionButtons<T>({
  t,
  item,
  onEdit,
  onDelete,
  getId,
}: ActionButtonsProps<T>) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onEdit(item)}
        className="flex items-center gap-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm transition-colors justify-center"
        title={t("actions.edit")}
      >
        <Edit size={14} />
        <span>{t("actions.edit")}</span>
      </button>
      <button
        onClick={() => onDelete(getId(item))}
        className="flex items-center gap-1 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm transition-colors justify-center"
        title={t("actions.delete")}
      >
        <Trash2 size={14} />
        <span>{t("actions.delete")}</span>
      </button>
    </div>
  );
}