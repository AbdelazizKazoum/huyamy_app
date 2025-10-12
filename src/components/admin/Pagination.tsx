import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasMore?: boolean; // Optional for server-side pagination
  loading?: boolean; // Optional for server-side pagination
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  hasMore,
  loading = false,
}) => {
  // For server-side pagination, disable navigation when loading
  const isDisabled = loading;

  const paginationRange = useMemo(() => {
    const delta = 2;
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
    <div className="flex items-center justify-center gap-2 mt-6">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isDisabled}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={20} />
      </button>

      {/* Page numbers */}
      {paginationRange.map((page, index) => {
        if (typeof page === "string") {
          return (
            <span key={`${page}-${index}`} className="px-3 py-2 text-sm">
              ...
            </span>
          );
        }
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={isDisabled}
            className={`px-3 py-2 text-sm font-medium rounded-md disabled:cursor-not-allowed ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            }`}
          >
            {loading && currentPage === page ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              page
            )}
          </button>
        );
      })}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={
          currentPage === totalPages || isDisabled || hasMore === false
        }
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Loading indicator for server-side pagination */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          جاري التحميل...
        </div>
      )}
    </div>
  );
};

export default Pagination;
