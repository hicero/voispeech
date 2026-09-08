"use client";
import { useEffect, useRef } from "react";
import { bookingUrl } from "./siteConfig";

type CalFunction = ((...args: unknown[]) => void) & { q: unknown[][]; ns: Record<string, unknown>; loaded?: boolean };
declare global { interface Window { Cal?: CalFunction } }

export function getCalLink(value: string): string | null {
  try {
    const url = new URL(value);
    const parts = url.pathname.split("/").filter(Boolean).map(decodeURIComponent);
    if (url.protocol !== "https:" || url.hostname !== "cal.com" || url.port || url.username || url.password || parts.length !== 2) return null;
    if (!parts.every(part => /^[\p{L}\p{M}\p{N}_-]+$/u.test(part))) return null;
    return parts.map(encodeURIComponent).join("/");
  } catch { return null; }
}

export default function Booking() {
  const host = useRef<HTMLDivElement>(null);
  const calLink = getCalLink(bookingUrl);
  useEffect(() => {
    const element = host.current;
    if (!calLink || !element) return;
    if (!window.Cal) {
      const queue: unknown[][] = [];
      const cal = ((...args: unknown[]) => { queue.push(args); }) as CalFunction;
      cal.q = queue; cal.ns = {}; window.Cal = cal;
      const script = document.createElement("script");
      script.src = "https://app.cal.com/embed/embed.js";
      script.async = true;
      script.onerror = () => { element.textContent = "달력을 불러오지 못했습니다. 아래 버튼으로 예약 페이지를 열어 주세요."; script.remove(); delete window.Cal; };
      document.head.appendChild(script);
    }
    window.Cal!("init", { origin: "https://cal.com" });
    window.Cal!("inline", { elementOrSelector: element, calLink, config: { layout: "month_view", theme: "light" } });
    return () => { element.replaceChildren(); };
  }, [calLink]);
  return <section id="booking" className="section-pad booking-section">
    <div className="mx-auto max-w-6xl px-5 md:px-8">
      <div className="section-heading"><div><p className="eyebrow">BOOK YOUR LESSON</p><h2>내 목소리를 위한 시간,<br/>지금 골라보세요.</h2></div><p>1:1 발성 원데이 예약</p></div>
      <div className="booking-grid">
        <aside className="booking-info"><span className="booking-tag">ONE-DAY · 1:1</span><h3>발성 원데이 레슨</h3><p>현재 발성의 특징을 살펴보고,<br/>나에게 필요한 연습을 찾아갑니다.</p><dl><div><dt>수업 시간</dt><dd>50분</dd></div><div><dt>수업 방식</dt><dd>코치와 1:1 진행</dd></div><div><dt>수업 후</dt><dd>개인 발성 코칭 리포트 PDF<br/><small>제공 일정은 수업 시 안내</small></dd></div></dl><p className="booking-policy">예약은 최소 24시간 전에 신청해 주세요. 기존 정규 수강생의 일정 변경은 코치와 직접 조율해 주세요.</p><a href="#contact">예약 전 궁금한 점이 있나요? ↗</a></aside>
        <div className="booking-calendar">
          {calLink ? <><div id="voispeech-cal" ref={host} className="cal-host" aria-label="원데이 레슨 날짜와 시간 선택"/><p className="booking-help">달력이 표시되지 않으면 <a href={`https://cal.com/${calLink}`} target="_blank" rel="noopener noreferrer">예약 페이지 열기 ↗</a></p></> : <div className="booking-empty"><span className="eyebrow">LESSON RESERVATION</span><h3>예약 오픈 준비 중</h3><p>온라인 예약을 연결하고 있습니다.<br/>연결 후 이곳에서 날짜와 시간을 선택할 수 있습니다.</p><a className="btn-outline" href="#contact">수업 문의 안내</a></div>}
        </div>
      </div>
    </div>
  </section>;
}
