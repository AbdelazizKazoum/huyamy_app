"use client";

import dynamic from "next/dynamic";

// Lazy load the Map component
const MapComponent = dynamic(() => import("./MapComponent"), {
  loading: () => (
    <div className="w-full h-[550px] rounded-2xl bg-neutral-100 border border-border-light  flex items-center justify-center">
      <div className="text-text-secondary ">Loading map...</div>
    </div>
  ),
  ssr: false,
});

const MapWrapper = () => {
  return <MapComponent />;
};

export default MapWrapper;
