"use client";

import Pagination from "@/components/admin/Pagination";

interface CategoriesPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function CategoriesPagination({
  currentPage,
  totalPages,
  onPageChange,
}: CategoriesPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
