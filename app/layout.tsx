import "./globals.css";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: {
    default: "design4public | Projects",
    template: "%s | design4public",
  },
  description:
    "한국 공공조달 가구 납품사례를 탐색하는 콘텐츠 사이트. 프로젝트, 아이템, 브랜드별로 필터링하고 살펴보세요.",
  openGraph: {
    title: "design4public",
    description:
      "한국 공공조달 가구 납품사례를 탐색하는 콘텐츠 사이트.",
    type: "website",
    url: "https://design4public.com",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* Pretendard for body text */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        {/* Rethink Sans for logo */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rethink+Sans:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background font-sans">
        <SiteHeader />
        <main className="mx-auto w-full max-w-[1920px] px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 py-8 lg:py-12">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
