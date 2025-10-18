import Head from "next/head";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import NoticeBar from "@/components/layout/NoticeBar";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import ToasterProvider from "@/providers/ToasterProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest-client.json" />
      </Head>
      <ToasterProvider />
      <ServiceWorkerRegister />
      <NoticeBar />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
