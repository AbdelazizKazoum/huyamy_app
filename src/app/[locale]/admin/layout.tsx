export const metadata = {
  manifest: "/manifest-admin.json",
};

import AuthGuard from "@/components/auth/AuthGuard";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import InstallPrompt from "@/components/InstallPrompt";
import AdminShell from "@/components/admin/AdminShell";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ServiceWorkerRegister />
      <InstallPrompt />
      <div
        dir="rtl"
        className="bg-gray-100 text-gray-900 min-h-screen"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        <AuthGuard requireAdmin>
          <AdminShell>{children}</AdminShell>
        </AuthGuard>
      </div>
    </>
  );
}
