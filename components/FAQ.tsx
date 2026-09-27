"use client";

import { useState } from "react";

const faqs = [
  {
    q: "완전 초보인데 수업을 들을 수 있나요?",
    a: "네. 입문자·재시작 분도 함께합니다. 첫 수업에서 5 VOICE CHECK로 현재 목소리를 가볍게 확인한 뒤, 필요한 연습 방향을 제안합니다.",
  },
  {
    q: "5 Voice Check가 무엇인가요?",
    a: "숨과 소리 연결, 저음·고음 연결, 목·턱·혀의 힘, 모음·울림 조절, 소리 구별·재현의 다섯 영역을 살펴보는 VoiSpeech의 코칭 프레임워크입니다. 의료적 진단이 아니라, 현재 발성 패턴과 연습 반응을 정리해 수업 방향을 잡는 기준입니다.",
  },
  {
    q: "코칭 리포트는 어떤 내용인가요?",
    a: "원데이 수업에서 확인한 현재 발성 특징, 잘 되는 부분, 조정이 필요한 부분, 연습 방향과 노래 적용 포인트를 개인 PDF로 정리합니다. 제공 일정은 수업 시 안내합니다.",
  },
  {
    q: "레슨은 몇 분이고, 주 몇 회가 좋은가요?",
    a: "1:1 원데이 수업은 50분을 기준으로 진행합니다. 정규 수업의 횟수와 일정은 목표와 연습 여건을 함께 살펴 정합니다.",
  },
  {
    q: "수업 문의는 어떻게 하나요?",
    a: "원데이는 레슨 예약 섹션에서 확인할 수 있습니다. 온라인 예약 연결 전에는 문의 안내를 이용해 주세요. 기존 정규 수업의 일정 변경은 코치와 직접 조율합니다.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section-pad bg-page">
      <div className="content-shell faq-layout">
        <div className="faq-intro">
          <p className="eyebrow">FAQ</p>
          <h2>자주 묻는 질문</h2>
        </div>

        <div className="faq-list divide-y divide-line border-y border-line">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {item.q}
                    <span
                      className={`faq-icon ${isOpen ? "is-open" : ""}`}
                      aria-hidden
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-answer-${i}`}
                  aria-hidden={!isOpen}
                  className={`grid transition-[grid-template-rows] duration-300 ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="faq-a">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
