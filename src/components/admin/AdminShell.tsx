"use client";
import Header from "@/components/admin/Header";
import { MobileSidebar, Sidebar } from "@/components/admin/Sidebar";
import { useState } from "react";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
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
  );
}
