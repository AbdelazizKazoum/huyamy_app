"use client";
import Header from "@/components/admin/Header";
import { MobileSidebar, Sidebar } from "@/components/admin/Sidebar";
import { useLocale } from "next-intl";
import { useState } from "react";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <div className="flex h-screen">
      <Sidebar isCollapsed={isSidebarCollapsed} locale={locale} />
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        locale={locale}
      />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed
            ? isRtl
              ? "md:mr-20"
              : "md:ml-20"
            : isRtl
            ? "md:mr-64"
            : "md:ml-64"
        }`}
      >
        <Header
          onDesktopSidebarToggle={() =>
            setIsSidebarCollapsed(!isSidebarCollapsed)
          }
          onMobileSidebarOpen={() => setIsMobileMenuOpen(true)}
        />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto pt-20">
          {children}
        </main>
      </div>
    </div>
  );
}
