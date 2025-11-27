import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import NoticeBar from "@/components/layout/NoticeBar";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import ToasterProvider from "@/providers/ToasterProvider";
import { getCachedSiteConfig } from "@/lib/actions/config";

export const metadata = {
  manifest: "/manifest-client.json",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch cached config data on the server with ISR
  const config = await getCachedSiteConfig();

  return (
    <>
      <ToasterProvider />
      <ServiceWorkerRegister />
      <NoticeBar />
      <Header config={config} />
      <main>{children}</main>
      <Footer config={config} />
    </>
  );
}
