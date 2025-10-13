import useSortableData from "@/hooks/useSortableData";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

interface DataTableProps<T extends object> {
  columns: {
    key: keyof T;
    label: string;
    sortable: boolean;
    render?: (item: T) => React.ReactNode;
    mobileLabel?: string; // Optional custom label for mobile
    hiddenOnMobile?: boolean; // Hide specific columns on mobile
  }[];
  data: T[];
  renderActions?: (item: T) => React.ReactNode;
  isLoading?: boolean;
  itemsPerPage?: number;
  emptyMessage?: string;
  mobileCardRenderer?: (
    item: T,
    renderActions?: (item: T) => React.ReactNode
  ) => React.ReactNode;
}

const DataTable = <T extends { id: string }>({
  columns,
  data,
  renderActions,
  isLoading = false,
  itemsPerPage = 8,
  emptyMessage = "لا توجد بيانات للعرض",
  mobileCardRenderer,
}: DataTableProps<T>) => {
  const { items: sortedItems, requestSort, sortConfig } = useSortableData(data);

  const getSortIcon = (key: keyof T) => {
    if (!sortConfig || sortConfig.key !== key)
      return <ChevronsUpDown size={14} className="text-gray-400" />;
    return sortConfig.direction === "ascending" ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    );
  };

  const SkeletonRow = () => (
    <tr className="border-t border-neutral-200">
      {columns.map((col) => (
        <td key={col.key as string} className="p-2 sm:p-4">
          <div className="h-4 sm:h-6 bg-gray-200 rounded animate-pulse"></div>
        </td>
      ))}
      {renderActions && (
        <td className="p-2 sm:p-4">
          <div className="h-6 sm:h-8 w-16 sm:w-24 bg-gray-200 rounded animate-pulse"></div>
        </td>
      )}
    </tr>
  );

  const DefaultMobileSkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="space-y-3">
        {columns
          .filter((col) => !col.hiddenOnMobile)
          .map((col) => (
            <div
              key={col.key as string}
              className="flex items-center justify-between py-1"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
            </div>
          ))}
        {renderActions && (
          <div className="flex gap-2 pt-3 border-t border-gray-100 mt-4">
            <div className="h-9 bg-gray-200 rounded-lg animate-pulse flex-1"></div>
            <div className="h-9 bg-gray-200 rounded-lg animate-pulse flex-1"></div>
          </div>
        )}
      </div>
    </div>
  );

  const DefaultMobileCard = ({ item }: { item: T }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
      <div className="space-y-3">
        {columns
          .filter((col) => !col.hiddenOnMobile)
          .map((col) => (
            <div
              key={`${item.id}-${col.key as string}`}
              className="flex items-center justify-between py-1"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-600">
                  {col.mobileLabel || col.label}
                </span>
              </div>
              <div className="text-sm text-gray-900 font-medium text-left max-w-[60%]">
                {col.render ? col.render(item) : String(item[col.key])}
              </div>
            </div>
          ))}
        {renderActions && (
          <div className="flex gap-2 pt-3 border-t border-gray-100 mt-4">
            {renderActions(item)}
          </div>
        )}
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="text-gray-400 text-lg mb-2">📋</div>
      <p className="text-gray-500">{emptyMessage}</p>
    </div>
  );

  return (
    <div className="bg-white/50 rounded-lg shadow-md">
      {/* Mobile Card View */}
      <div className="block sm:hidden">
        <div className="space-y-4 p-3">
          {isLoading ? (
            Array.from({ length: itemsPerPage }).map((_, i) => (
              <DefaultMobileSkeletonCard key={i} />
            ))
          ) : sortedItems.length === 0 ? (
            <EmptyState />
          ) : (
            sortedItems.map((item) => (
              <div key={item.id}>
                {mobileCardRenderer ? (
                  mobileCardRenderer(item, renderActions)
                ) : (
                  <DefaultMobileCard item={item} />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-right min-w-[600px]">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th key={col.key as string} className="p-2 sm:p-4">
                  {col.sortable ? (
                    <button
                      onClick={() => requestSort(col.key)}
                      className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-gray-600"
                    >
                      {col.label} {getSortIcon(col.key)}
                    </button>
                  ) : (
                    <span className="font-semibold text-xs sm:text-sm text-gray-600">
                      {col.label}
                    </span>
                  )}
                </th>
              ))}
              {renderActions && (
                <th className="p-2 sm:p-4 font-semibold text-xs sm:text-sm text-gray-600">
                  إجراءات
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: itemsPerPage }).map((_, i) => (
                <SkeletonRow key={i} />
              ))
            ) : sortedItems.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (renderActions ? 1 : 0)}
                  className="p-8"
                >
                  <EmptyState />
                </td>
              </tr>
            ) : (
              sortedItems.map((item) => (
                <tr key={item.id} className="border-t border-neutral-200">
                  {columns.map((col) => (
                    <td
                      key={`${item.id}-${col.key as string}`}
                      className="p-2 sm:p-4 text-gray-600 text-sm sm:text-base"
                    >
                      {col.render ? col.render(item) : String(item[col.key])}
                    </td>
                  ))}
                  {renderActions && (
                    <td className="p-2 sm:p-4">{renderActions(item)}</td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
