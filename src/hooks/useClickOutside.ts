import { useEffect, useRef } from "react";

/**
 * Custom hook that triggers a callback when clicking outside of the referenced element
 * @param callback - Function to call when clicking outside
 * @returns ref - Reference to attach to the element you want to detect outside clicks for
 */
const useClickOutside = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  return ref;
};

export default useClickOutside;
