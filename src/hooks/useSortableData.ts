/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";

// --- Helper Hooks ---
const useSortableData = <T extends object>(
  items: T[],
  config: { key: keyof T; direction: "ascending" | "descending" } | null = null
) => {
  const [sortConfig, setSortConfig] = useState(config);
  const sortedItems = useMemo(() => {
    const sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        // Extract 'ar' value if present, otherwise use the value directly
        const getArValue = (val: any) => {
          if (val && typeof val === "object" && "ar" in val) {
            return val.ar;
          }
          return val;
        };

        const aVal = getArValue(a[sortConfig.key]);
        const bVal = getArValue(b[sortConfig.key]);

        // Use localeCompare for Arabic strings
        if (typeof aVal === "string" && typeof bVal === "string") {
          const comparison = aVal.localeCompare(bVal, "ar");
          return sortConfig.direction === "ascending"
            ? comparison
            : -comparison;
        }

        // Fallback for non-string values
        if (aVal < bVal) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);
  const requestSort = (key: keyof T) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };
  return { items: sortedItems, requestSort, sortConfig };
};

export default useSortableData;
