import useSortableData from "@/hooks/useSortableData";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

interface DataTableProps<T extends object> {
  columns: {
    key: keyof T;
    label: string;
    sortable: boolean;
    render?: (item: T) => React.ReactNode;
  }[];
  data: T[];
  renderActions?: (item: T) => React.ReactNode;
  isLoading?: boolean;
  itemsPerPage?: number;
  emptyMessage?: string;
}

const DataTable = <T extends { id: string }>({
  columns,
  data,
  renderActions,
  isLoading = false,
  itemsPerPage = 8,
  emptyMessage = "لا توجد بيانات للعرض",
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
        <td key={col.key as string} className="p-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        </td>
      ))}
      {renderActions && (
        <td className="p-4">
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
        </td>
      )}
    </tr>
  );

  const MobileSkeletonCard = () => (
    <div className="bg-white rounded-lg border border-neutral-200 p-4 space-y-3 animate-pulse">
      {columns.map((col) => (
        <div
          key={col.key as string}
          className="flex justify-between items-start"
        >
          <div className="h-5 w-20 bg-gray-200 rounded"></div>
          <div className="h-5 w-32 bg-gray-200 rounded"></div>
        </div>
      ))}
      {renderActions && (
        <div className="flex justify-between items-center pt-3 border-t border-neutral-200">
          <div className="h-5 w-20 bg-gray-200 rounded"></div>
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
        </div>
      )}
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
      <div className="md:hidden">
        <div className="space-y-4 p-4">
          {isLoading ? (
            Array.from({ length: itemsPerPage }).map((_, i) => (
              <MobileSkeletonCard key={i} />
            ))
          ) : sortedItems.length === 0 ? (
            <EmptyState />
          ) : (
            sortedItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-neutral-200 p-4 space-y-3"
              >
                {columns.map((col) => (
                  <div
                    key={`${item.id}-${col.key as string}`}
                    className="flex justify-between items-start"
                  >
                    <span className="font-semibold text-sm text-gray-600">
                      {col.label}
                    </span>
                    <div className="text-left">
                      {col.render ? col.render(item) : String(item[col.key])}
                    </div>
                  </div>
                ))}
                {renderActions && (
                  <div className="flex justify-between items-center pt-3 border-t border-neutral-200">
                    <span className="font-semibold text-sm text-gray-600">
                      إجراءات
                    </span>
                    {renderActions(item)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-right min-w-[600px]">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th key={col.key as string} className="p-4">
                  {col.sortable ? (
                    <button
                      onClick={() => requestSort(col.key)}
                      className="flex items-center gap-2 font-semibold text-sm text-gray-600"
                    >
                      {col.label} {getSortIcon(col.key)}
                    </button>
                  ) : (
                    <span className="font-semibold text-sm text-gray-600">
                      {col.label}
                    </span>
                  )}
                </th>
              ))}
              {renderActions && (
                <th className="p-4 font-semibold text-sm text-gray-600">
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
                      className="p-4 text-gray-600"
                    >
                      {col.render ? col.render(item) : String(item[col.key])}
                    </td>
                  ))}
                  {renderActions && (
                    <td className="p-4">{renderActions(item)}</td>
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
