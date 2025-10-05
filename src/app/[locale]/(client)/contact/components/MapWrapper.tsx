"use client";

import dynamic from "next/dynamic";

// Lazy load the Map component
const MapComponent = dynamic(() => import("./MapComponent"), {
  loading: () => (
    <div className="w-full h-[550px] rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-border-light dark:border-neutral-700 flex items-center justify-center">
      <div className="text-text-secondary dark:text-neutral-400">
        Loading map...
      </div>
    </div>
  ),
  ssr: false,
});

const MapWrapper = () => {
  return <MapComponent />;
};

export default MapWrapper;
