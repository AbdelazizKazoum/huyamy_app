"use client";

import React from "react";

const MapComponent: React.FC = () => {
  return (
    <div className="w-full h-[550px] rounded-2xl overflow-hidden shadow-lg border border-border-light ">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d211649.34969476718!2d-6.974403420898428!3d33.971590400000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76b871f50c5c1%3A0x7ac92b9523549e49!2sRabat!5e0!3m2!1sen!2sma!4v1678886576831!5m2!1sen!2sma"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="موقعنا على الخريطة"
      />
    </div>
  );
};

export default MapComponent;
