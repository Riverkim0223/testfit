import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getSiteUrl } from "@/lib/test-factory/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "Test Factory | 오늘은 어떤 테스트를 해볼까요?",
    template: "%s | Test Factory",
  },
  description: "릴스핏, 과일상처럼 가볍고 공유하기 좋은 취향 테스트를 한곳에서 즐겨보세요.",
  applicationName: "Test Factory",
  category: "entertainment",
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "Test Factory",
    title: "Test Factory | 오늘은 어떤 테스트를 해볼까요?",
    description: "질문에 답하고 나와 닮은 결과와 추천을 확인해보세요.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Test Factory | 오늘은 어떤 테스트를 해볼까요?",
    description: "질문에 답하고 나와 닮은 결과와 추천을 확인해보세요.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="ko"><body>{children}</body></html>;
}
