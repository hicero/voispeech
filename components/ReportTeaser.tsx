const checks = [
  { num: "01", name: "숨과 소리 연결", status: "안정", tone: "stable" },
  { num: "02", name: "저음·고음 연결", status: "우선 조정", tone: "priority" },
  { num: "03", name: "목·턱·혀의 힘", status: "조정 필요", tone: "adjust" },
  { num: "04", name: "모음·울림 조절", status: "조정 필요", tone: "adjust" },
  { num: "05", name: "소리 구별·재현", status: "강점", tone: "strong" },
] as const;

const facts = [
  {
    label: "주요 목표",
    value: "고음에서 목 힘을 줄이고 소리 무게 조절",
  },
  { label: "확인한 음역", value: "A2 – B4" },
  {
    label: "오늘 가장 중요했던 부분",
    value: "고음이 편해지고 목 주변 힘이 줄었음",
  },
] as const;

export default function ReportTeaser() {
  return (
    <section id="report" className="section-pad bg-page">
      <div className="content-shell">
        <div className="report-layout grid items-start gap-10">
          <div className="report-intro">
            <div data-reveal>
            <p className="eyebrow">COACHING REPORT</p>
            <h2 className="line-rise mt-3 text-3xl font-bold tracking-tight text-navy md:text-4xl">
              <span className="line-rise-item">
                <span className="line-rise-inner">수업에서 확인한 내용을</span>
              </span>
              <span className="line-rise-item">
                <span className="line-rise-inner">
                  <span className="phrase-mark">개인 발성 코칭 리포트로</span>
                </span>
              </span>
              <span className="line-rise-item">
                <span className="line-rise-inner">
                  정리합니다
                  <span className="text-sky" aria-hidden>
                    .
                  </span>
                </span>
              </span>
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted md:text-base">
              지금 발성 특징, 잘 되는 부분, 조정할 부분, 연습 방향을 한 장에
              담습니다. 5 VOICE CHECK 결과와 오늘 연습 방법, 노래 적용 포인트를
              수업 뒤에 다시 봅니다.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "현재 발성 특징 · 잘 되는 부분 · 조정 포인트",
                "5 VOICE CHECK 영역별 정리",
                "오늘 연습 방법 · 노래 적용 포인트",
              ].map((item) => (
                <li key={item} className="dot-label text-sm text-navy-soft">
                  {item}
                </li>
              ))}
            </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div
              className="card report-preview overflow-hidden shadow-[0_12px_40px_rgba(45,62,80,0.06)]"
              data-reveal
            >
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
              className="card report-doc overflow-hidden shadow-[0_12px_40px_rgba(45,62,80,0.06)]"
              data-reveal
              aria-hidden="true"
            >
              <div className="report-doc-head">
                <div className="report-doc-brand">
                  <span className="report-doc-name">VoiSpeech</span>
                  <span className="report-doc-label">VOCAL COACHING REPORT</span>
                </div>
                <span className="report-doc-page">02 / 06</span>
              </div>

              <div className="report-doc-body">
                <p className="report-doc-kicker">오늘의 발성 요약</p>
                <p className="report-doc-title">
                  오늘의 발성을 한눈에 정리합니다
                  <span className="text-sky" aria-hidden>
                    .
                  </span>
                </p>
                <p className="report-doc-lead">
                  잘 되고 있던 부분, 조정한 부분, 앞으로 연습할 방향을 한 장에
                  정리합니다.
                </p>

                <div className="report-doc-facts">
                  {facts.map((card) => (
                    <div key={card.label} className="report-doc-fact">
                      <p className="report-doc-fact-label">{card.label}</p>
                      <p className="report-doc-fact-value">{card.value}</p>
                    </div>
                  ))}
                </div>

                <div className="report-doc-checks">
                  <p className="report-doc-kicker">5 VOICE CHECK</p>
                  <ul className="report-check-list" data-reveal>
                    {checks.map((row) => (
                      <li
                        key={row.num}
                        className={`report-check-row${row.tone === "priority" ? " is-priority" : ""}`}
                      >
                        <span className="report-check-num">{row.num}</span>
                        <span className="report-check-name">{row.name}</span>
                        <span className={`report-check-status is-${row.tone}`}>
                          {row.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="report-doc-next">
                  <p className="report-doc-kicker">먼저 연습할 부분</p>
                  <p className="report-doc-next-text">
                    1순위 저음·고음 연결 · 2순위 목·턱·혀의 힘 · 3순위 모음·울림
                    조절
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
