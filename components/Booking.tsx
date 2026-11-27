"use client";

import { useEffect, useRef, useState } from "react";
import { bookingUrl, isHttpsUrl, onedayPlatforms } from "./siteConfig";

export default function Booking() {
  const [frameHeight, setFrameHeight] = useState(900);
  const frameRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const embedOrigin = new URL(bookingUrl).origin;
    function applyHeight(height: number) {
      if (height > 400 && height < 5000) {
        setFrameHeight((prev) => (prev === height ? prev : height));
      }
    }
    // 예약 폼이 뜨는 타이밍이 부모보다 빨라서, 자식이 보내는 높이를 부모가 못 받는 경우가 있다.
    // 같은 도메인이라 부모가 직접 안쪽 문서 높이를 재는 게 확실하다.
    function measure() {
      try {
        const doc = frameRef.current?.contentDocument;
        if (!doc) return;
        const height = Math.max(
          doc.body?.scrollHeight ?? 0,
          doc.documentElement?.scrollHeight ?? 0,
        );
        applyHeight(height);
      } catch {
        // 다른 도메인이면 읽을 수 없어서 아래 postMessage로만 받는다.
      }
    }
    function onMessage(event: MessageEvent) {
      if (event.origin !== embedOrigin) return;
      const data = event.data as { type?: string; height?: number } | null;
      if (!data || data.type !== "voispeech-booking-height") return;
      if (typeof data.height === "number") applyHeight(data.height);
    }
    const frame = frameRef.current;
    window.addEventListener("message", onMessage);
    frame?.addEventListener("load", measure);
    const timer = window.setInterval(measure, 500);
    measure();
    return () => {
      window.removeEventListener("message", onMessage);
      frame?.removeEventListener("load", measure);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <section id="booking" className="section-pad booking-section">
      <div className="content-shell">
        <div className="section-heading" data-reveal>
          <div>
            <p className="eyebrow">BOOK YOUR LESSON</p>
            <h2 className="line-rise">
              <span className="line-rise-item">
                <span className="line-rise-inner">내 목소리를 위한 시간,</span>
              </span>
              <span className="line-rise-item">
                <span className="line-rise-inner">지금 골라보세요.</span>
              </span>
            </h2>
          </div>
          <p>1:1 발성 원데이 클래스 예약</p>
        </div>

        <div className="booking-grid">
          <aside className="booking-info">
            <span className="booking-tag">ONE-DAY · 1:1</span>
            <h3>발성 원데이 클래스</h3>
            <p>
              현재 발성의 특징을 살펴보고,
              <br />
              나에게 필요한 연습을 찾아갑니다.
            </p>
            <dl>
              <div>
                <dt>수업 시간</dt>
                <dd>50분</dd>
              </div>
              <div>
                <dt>수업 방식</dt>
                <dd>코치와 1:1 진행</dd>
              </div>
              <div>
                <dt>수업 후</dt>
                <dd>
                  개인 발성 코칭 리포트 PDF
                  <br />
                  <small>제공 일정은 수업 시 안내</small>
                </dd>
              </div>
            </dl>
            <p className="booking-policy">
              예약은 최소 24시간 전에 신청해 주세요. 기존 정규 수강생의 일정
              변경은 코치와 직접 조율해 주세요.
            </p>
            <a href="#contact">예약 전 궁금한 점이 있나요? ↗</a>
            <div className="oneday-platforms">
              <p className="oneday-platforms-label">
                프립 · 솜씨당 · 당근에서도 신청할 수 있어요
              </p>
              <div className="oneday-platforms-list">
                {onedayPlatforms.map((platform) =>
                  isHttpsUrl(platform.url) ? (
                    <a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {platform.name}
                    </a>
                  ) : (
                    <span key={platform.name}>{platform.name}</span>
                  ),
                )}
              </div>
            </div>
          </aside>

          <div className="booking-calendar">
            <iframe
              ref={frameRef}
              src={`${bookingUrl}?embed=1`}
              title="레슨 예약"
              loading="lazy"
              style={{
                width: "100%",
                height: frameHeight,
                border: 0,
                display: "block",
              }}
            />
            <p className="booking-help">
              예약 전 확인 화면에서 레슨·일시·예약자 정보를 다시 확인할 수
              있습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
