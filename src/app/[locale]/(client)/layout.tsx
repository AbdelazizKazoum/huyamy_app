import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import NoticeBar from "@/components/layout/NoticeBar";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import ToasterProvider from "@/providers/ToasterProvider";

export const metadata = {
  manifest: "/manifest-admin.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ToasterProvider />
      <ServiceWorkerRegister />
      <NoticeBar />
      <Header />
      <main className={``}>{children}</main>
      <Footer />
    </>
  );
}
