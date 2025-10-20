"use client";

import dynamic from "next/dynamic";
import { siteConfig } from "@/config/site";

// Lazy load the Map component
const MapComponent = dynamic(() => import("./MapComponent"), {
  loading: () => (
    <div className="w-full h-[550px] rounded-2xl bg-neutral-100 border border-border-light flex items-center justify-center">
      <div className="text-text-secondary">Loading map...</div>
    </div>
  ),
  ssr: false,
});

const DEFAULT_LAT = 30.427755;
const DEFAULT_LNG = -9.598107;

const MapWrapper = () => {
  const { locationCoordinates } = siteConfig;

  const lat = locationCoordinates?.lat ?? DEFAULT_LAT;
  const lng = locationCoordinates?.lng ?? DEFAULT_LNG;

  return <MapComponent lat={lat} lng={lng} />;
};

export default MapWrapper;
