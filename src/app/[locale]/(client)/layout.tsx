import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import NoticeBar from "@/components/layout/NoticeBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NoticeBar />
      <Header />
      <main className={``}>{children}</main>
      <Footer />
    </>
  );
}
