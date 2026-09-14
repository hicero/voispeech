const checks = [
  { num: "01", name: "호흡·발성", status: "안정", tone: "stable" },
  { num: "02", name: "두께·성구", status: "우선 조정", tone: "priority" },
  { num: "03", name: "후두·주변 힘", status: "조정 필요", tone: "adjust" },
  { num: "04", name: "성도·공명", status: "조정 필요", tone: "adjust" },
  { num: "05", name: "소리 이해·연습", status: "강점", tone: "strong" },
] as const;

const toneClass: Record<(typeof checks)[number]["tone"], string> = {
  stable: "border-line bg-surface text-muted",
  priority: "border-sky/40 bg-sky-muted text-navy",
  adjust: "border-line bg-page text-navy-soft",
  strong: "border-sky bg-sky-muted text-navy font-semibold",
};

export default function ReportTeaser() {
  return (
    <section id="report" className="section-pad bg-page">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <p className="eyebrow">COACHING REPORT</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy md:text-4xl">
              원데이 수업 후,
              <br />
              발성 코칭 리포트로
              <br />
              정리합니다
              <span className="text-sky" aria-hidden>
                .
              </span>
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted md:text-base">
              수업에서 확인한 발성 특징과 연습 방향을 개인 PDF로 정리합니다.
              제공 일정은 수업 시 안내하며, 혼자 연습할 때 다시 참고할 수 있습니다.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "오늘의 발성 한눈에 보기 · 우선 연습 포인트",
                "5 Voice Check 영역별 관찰 · 해석",
                "홈 트레이닝 · 다음 수업 방향",
              ].map((item) => (
                <li key={item} className="dot-label text-sm text-navy-soft">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6 lg:col-span-7">
            <div className="card overflow-hidden shadow-[0_12px_40px_rgba(45,62,80,0.06)]">
              <img
                src="/report/coaching-report.jpg"
                alt="VoiSpeech 발성 코칭 리포트 PDF 미리보기"
                width={1400}
                height={1279}
                className="h-auto w-full object-cover object-center"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div
              className="card overflow-hidden shadow-[0_12px_40px_rgba(45,62,80,0.06)]"
              aria-hidden="true"
            >
              <div className="flex items-center justify-between border-b border-line-soft px-5 py-4 md:px-6">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-sm font-semibold text-navy">VoiSpeech</span>
                  <span className="text-[0.625rem] tracking-[0.14em] text-faint">
                    VOCAL COACHING REPORT
                  </span>
                </div>
                <span className="text-xs text-muted">02 / 06</span>
              </div>

              <div className="bg-page px-5 py-6 md:px-8 md:py-8">
                <p className="text-[0.6875rem] font-medium tracking-[0.12em] text-muted">
                  오늘의 발성 요약
                </p>
                <p className="mt-2 text-2xl font-bold text-navy md:text-3xl">
                  오늘의 발성 한눈에 보기
                  <span className="text-sky" aria-hidden>
                    .
                  </span>
                </p>
                <p className="mt-2 text-sm text-muted">
                  잘 되고 있던 부분, 조정한 부분, 앞으로 연습할 방향을 한 장에
                  정리합니다.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    {
                      label: "주요 목표",
                      value: "고음에서 목 힘을 줄이고 소리의 무게 조절",
                    },
                    { label: "확인한 음역", value: "A2 – B4" },
                    {
                      label: "오늘 가장 중요했던 부분",
                      value: "고음이 편해지고 목 주변 힘이 줄었음",
                    },
                  ].map((card) => (
                    <div
                      key={card.label}
                      className="rounded-lg border border-line bg-surface px-4 py-3"
                    >
                      <p className="text-[0.6875rem] text-faint">{card.label}</p>
                      <p className="mt-1 text-sm font-semibold leading-snug text-navy">
                        {card.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <p className="text-[0.6875rem] font-medium tracking-[0.12em] text-muted">
                    5 VOICE CHECK
                  </p>
                  <p className="mt-1 text-sm font-semibold text-navy">
                    발성의 5가지 영역
                  </p>
                  <ul className="mt-3 space-y-2">
                    {checks.map((row) => (
                      <li
                        key={row.num}
                        className="flex items-center justify-between gap-3 rounded-lg border border-line-soft bg-surface px-3 py-2.5"
                      >
                        <span className="flex min-w-0 items-center gap-3 text-sm text-navy-soft">
                          <span className="shrink-0 text-xs font-medium text-sky">
                            {row.num}
                          </span>
                          <span className="truncate font-medium text-navy">
                            {row.name}
                          </span>
                        </span>
                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[0.6875rem] ${toneClass[row.tone]}`}
                        >
                          {row.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 rounded-lg border border-line border-l-[3px] border-l-sky bg-surface px-4 py-3">
                  <p className="text-[0.6875rem] tracking-[0.1em] text-muted">
                    먼저 연습할 부분
                  </p>
                  <p className="mt-1 text-sm text-navy-soft">
                    1순위 소리의 두께와 성구 연결 · 2순위 목 주변의 힘과 후두 조절 ·
                    3순위 성도와 공명 조절
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-4 border-t border-line-soft pt-5 text-[0.6875rem] tracking-[0.08em] text-faint">
                  <span>01 CHECK</span>
                  <span>02 INTERPRET</span>
                  <span>03 TRAIN</span>
                  <span>04 SONG</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
