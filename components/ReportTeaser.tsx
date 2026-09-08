export default function ReportTeaser() {
  return (
    <section id="report" className="section-pad bg-page">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
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

          {/* Mini report UI nod */}
          <div className="lg:col-span-7">
            <div className="card overflow-hidden shadow-[0_12px_40px_rgba(45,62,80,0.06)]">
              <div className="flex items-center justify-between border-b border-line-soft px-5 py-4 md:px-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-navy">VoiSpeech</span>
                  <span className="hidden text-[0.625rem] tracking-[0.14em] text-faint sm:inline">
                    VOCAL COACHING REPORT
                  </span>
                </div>
                <span className="text-xs text-muted">작성 예시</span>
              </div>

              <div className="bg-page px-5 py-6 md:px-8 md:py-8">
                <p className="dot-label text-sm">나의 목소리를 알아가는 시간</p>
                <p className="mt-3 text-2xl font-bold text-navy md:text-3xl">
                  발성 코칭 리포트
                  <span className="text-sky" aria-hidden>
                    .
                  </span>
                </p>
                <p className="mt-2 text-sm text-muted">
                  오늘의 발성 한눈에 보기
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "주요 목표", value: "성구 연결 · 긴장 완화" },
                    { label: "관찰 조건", value: "작은 소리 · 모음 변경" },
                    { label: "다음 연습", value: "짧은 구절에 적용" },
                  ].map((card) => (
                    <div
                      key={card.label}
                      className="rounded-lg border border-line bg-surface px-4 py-3"
                    >
                      <p className="text-[0.6875rem] text-faint">{card.label}</p>
                      <p className="mt-1 text-sm font-semibold text-navy">
                        {card.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-lg border border-line border-l-[3px] border-l-sky bg-surface px-4 py-3">
                  <p className="text-[0.6875rem] tracking-[0.1em] text-muted">
                    MOST IMPORTANT TODAY
                  </p>
                  <p className="mt-1 text-sm text-navy-soft">
                    모음을 바꿨을 때 연결이 편해졌다고 느꼈습니다. 같은 구절에서 다시 확인해 봅니다.
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
