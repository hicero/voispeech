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

          <div className="lg:col-span-7">
            <figure className="card overflow-hidden shadow-[0_12px_40px_rgba(45,62,80,0.06)]">
              <img
                src="/report/coaching-report.jpg"
                alt="VoiSpeech 발성 코칭 리포트 예시 — 오늘의 발성 요약, 5 Voice Check, 연습 가이드"
                width={1400}
                height={933}
                className="h-auto w-full object-cover object-center"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="border-t border-line-soft bg-surface px-5 py-3 text-xs text-muted md:px-6">
                발성 코칭 리포트 예시 · 개인 맞춤 PDF
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
