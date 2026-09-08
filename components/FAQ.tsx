"use client";

import { useState } from "react";

const faqs = [
  {
    q: "완전 초보인데 수업을 들을 수 있나요?",
    a: "네. 기초 발성 과정은 입문자·재시작 분을 위해 설계되어 있습니다. 첫 상담과 5 Voice Check로 현재 상태를 가볍게 확인한 뒤 커리큘럼을 제안합니다.",
  },
  {
    q: "5 Voice Check가 무엇인가요?",
    a: "호흡·발성, 소리의 무게·성구 연결, 목·턱·혀의 긴장, 모음·울림, 소리 이해·연습의 다섯 영역을 살펴보는 보이스피치의 발성 관찰 기준입니다. 수업 방향을 잡는 기준이 됩니다.",
  },
  {
    q: "코칭 리포트는 어떤 내용인가요?",
    a: "원데이 수업에서 확인한 발성 특징과 우선 연습 포인트를 개인 PDF로 정리합니다. 제공 일정은 수업 시 안내합니다.",
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
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <p className="eyebrow">FAQ</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy md:text-4xl">
          자주 묻는 질문
        </h2>

        <div className="mt-10 divide-y divide-line border-y border-line">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-semibold text-navy transition hover:text-navy-soft md:text-base"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {item.q}
                    <span
                      className={`shrink-0 text-sky transition duration-200 ${
                        isOpen ? "rotate-45" : ""
                      }`}
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
                    <p className="pb-5 text-sm leading-relaxed text-muted">
                      {item.a}
                    </p>
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
