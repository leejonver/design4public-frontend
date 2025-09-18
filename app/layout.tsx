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
      <body className="min-h-screen bg-white">
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

