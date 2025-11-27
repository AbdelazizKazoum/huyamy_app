export const metadata = {
  manifest: "/manifest-admin.json",
};

import AuthGuard from "@/components/auth/AuthGuard";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import InstallPrompt from "@/components/InstallPrompt";
import AdminShell from "@/components/admin/AdminShell";
import ToasterProvider from "@/providers/ToasterProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ToasterProvider />

      <ServiceWorkerRegister />
      <InstallPrompt />
      <div
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
