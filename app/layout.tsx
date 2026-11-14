import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://voispeech.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    url: siteUrl,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "보이스피치 | 발성 코칭 스튜디오",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "보이스피치 | 발성 코칭 스튜디오",
    description:
      "목소리를 알아가는 시간. 5 Voice Check와 1:1 코칭, 코칭 리포트로 정리합니다.",
    images: ["/og.png"],
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;if(!("IntersectionObserver" in window))return;var pending=[];var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add("is-inview");io.unobserve(e.target);}});},{threshold:0.16,rootMargin:"0px 0px -8% 0px"});function collect(){document.querySelectorAll("[data-reveal]").forEach(function(el){if(!el.classList.contains("is-inview")&&pending.indexOf(el)<0)pending.push(el);});}function markVisible(){pending.forEach(function(el){var r=el.getBoundingClientRect();if(r.bottom>0&&r.top<window.innerHeight*0.92)el.classList.add("is-inview");else io.observe(el);});pending=[];}function boot(){collect();markVisible();document.documentElement.classList.add("js-motion");}boot();setTimeout(function(){document.querySelectorAll("[data-reveal]:not(.is-inview)").forEach(function(el){el.classList.add("is-inview");});},2800);document.addEventListener("touchstart",function(e){var m=e.target.closest&&e.target.closest(".review-viewport");if(m)m.classList.add("is-paused");},{passive:true});document.addEventListener("touchend",function(){document.querySelectorAll(".review-viewport.is-paused").forEach(function(m){m.classList.remove("is-paused");});},{passive:true});}catch(e){}})();`,
          }}
        />
      </body>
    </html>
  );
}
