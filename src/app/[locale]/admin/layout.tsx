"use client";

import Header from "@/components/admin/Header";
import { MobileSidebar, Sidebar } from "@/components/admin/Sidebar";
import { Language } from "firebase/ai";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [lang] = useState<Language>("ar");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <main className={``}>
      {" "}
      <div
        dir="rtl"
        className="bg-gray-100 text-gray-900 min-h-screen"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        <div className="flex h-screen">
          <Sidebar isCollapsed={isSidebarCollapsed} />
          <MobileSidebar
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
          <div
            className={`flex-1 flex flex-col transition-all duration-300 ${
              isSidebarCollapsed ? "md:mr-20" : "md:mr-64"
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
      </div>
    </main>
  );
}
