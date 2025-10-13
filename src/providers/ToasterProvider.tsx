"use client";

import { Toaster } from "react-hot-toast";

const ToasterProvider = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          background: "transparent",
          boxShadow: "none",
          padding: "0",
        },
      }}
    />
  );
};

export default ToasterProvider;
