import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "보이스피치 | 발성 코칭 스튜디오",
  description:
    "보이스피치 — 5 VOICE CHECK 발성 관찰과 1:1 코칭, 수업 후 코칭 리포트. 기초 발성부터 성구 연결과 노래 적용까지.",
  keywords: [
    "보이스피치",
    "발성 코칭",
    "5 Voice Check",
    "보컬 레슨",
    "발성 분석",
    "코칭 리포트",
  ],
  openGraph: {
    title: "보이스피치 | 발성 코칭 스튜디오",
    description:
      "목소리를 알아가는 시간. 5 Voice Check와 1:1 코칭, 코칭 리포트로 정리합니다.",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-screen bg-page text-navy antialiased">
        <a className="skip-link" href="#main-content">본문 바로가기</a>
        {children}
      </body>
    </html>
  );
}
