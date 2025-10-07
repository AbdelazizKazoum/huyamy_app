import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const paginationRange = useMemo(() => {
    const delta = 1;
    const range: (number | string)[] = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }
    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }
    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);
    return range;
  }, [currentPage, totalPages]);
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-1 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-200 rounded-full"
      >
        <ChevronRight size={20} />
      </button>
      {paginationRange.map((page, index) => {
        if (typeof page === "string") {
          return (
            <span key={`${page}-${index}`} className="px-2 py-2 text-sm">
              ...
            </span>
          );
        }
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-full text-sm font-medium ${
              currentPage === page ? "bg-green-700 text-white" : "bg-gray-200"
            }`}
          >
            {page}
          </button>
        );
      })}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-200 rounded-full"
      >
        <ChevronLeft size={20} />
      </button>
    </div>
  );
};

export default Pagination;
