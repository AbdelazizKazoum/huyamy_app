/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

const LOCALSTORAGE_KEY = "hideInstallPromptUntil";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    // Check if the prompt should be hidden
    const hideUntil = localStorage.getItem(LOCALSTORAGE_KEY);
    if (hideUntil && Date.now() < Number(hideUntil)) return;

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowInstall(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleClose = () => {
    // Hide for 1 hour
    const oneHour = 60 * 60 * 1000;
    localStorage.setItem(LOCALSTORAGE_KEY, String(Date.now() + oneHour));
    setShowInstall(false);
  };

  if (!showInstall) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.35)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
      aria-modal="true"
      role="dialog"
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          padding: "2rem 1.5rem 1.5rem 1.5rem",
          maxWidth: 340,
          width: "90%",
          textAlign: "center",
          position: "relative",
        }}
      >
        <button
          onClick={handleClose}
          aria-label="إغلاق"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "transparent",
            border: "none",
            fontSize: 22,
            color: "#888",
            cursor: "pointer",
          }}
        >
          ×
        </button>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <Image
            src={siteConfig.logo}
            alt={`${siteConfig.name} Logo`}
            width={64}
            height={64}
            style={{
              borderRadius: 12,
              objectFit: "cover",
            }}
          />
        </div>
        <h2 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: 8 }}>
          تثبيت تطبيق {siteConfig.name}
        </h2>
        <p style={{ color: "#444", marginBottom: 20, fontSize: "1rem" }}>
          احصل على تجربة أفضل من خلال تثبيت التطبيق على هاتفك!
        </p>
        <button
          onClick={handleInstallClick}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 28px",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
            transition: "background 0.2s",
          }}
        >
          تثبيت التطبيق
        </button>
      </div>
    </div>
  );
}
