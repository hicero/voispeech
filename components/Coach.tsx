export default function Coach() {
  return (
    <section id="coach" className="section-pad bg-surface">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">COACH</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy md:text-4xl">
              함께하는 코치
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
              소리와 연습 과정을 함께 살펴보고,
              직접 시도할 수 있는 방법으로 풀어갑니다.
            </p>
          </div>

          <article className="card overflow-hidden lg:col-span-7">
            <div className="border-b border-line-soft bg-sky-muted/50 px-6 py-5 md:px-8">
              <p className="eyebrow">VOCAL DIRECTOR</p>
              <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-bold text-navy">김재우</h3>
                  <p className="mt-1 text-sm text-muted">
                    VoiSpeech 대표 · 발성 코치
                  </p>
                </div>
                <span className="rounded-md border border-line bg-surface px-2.5 py-1 text-xs text-muted">
                  VoiSpeech
                </span>
              </div>
            </div>

            <div className="grid gap-6 px-6 py-6 md:grid-cols-2 md:px-8 md:py-8">
              <div>
                <p className="text-[0.6875rem] font-medium tracking-[0.12em] text-muted">
                  APPROACH
                </p>
                <p className="mt-2 text-sm leading-relaxed text-navy-soft">
                  소리의 변화와 발성할 때 느끼는 어려움을 함께 듣습니다.
                  모음·음높이·소리 크기 등 조건을 바꿔보며,
                  어떤 조정이 도움이 되는지 확인합니다.
                </p>
              </div>
              <div>
                <p className="text-[0.6875rem] font-medium tracking-[0.12em] text-muted">
                  FOCUS
                </p>
                <ul className="mt-2 space-y-2">
                  {[
                    "1:1 발성 관찰 · 5 VOICE CHECK",
                    "기초 발성 · 성구 연결 · 노래 적용",
                    "원데이 수업 후 개인 코칭 리포트",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-navy-soft"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-line-soft bg-page px-6 py-4 md:px-8">
              <p className="text-sm text-muted">
                <span className="font-semibold text-navy">김재우 · VoiSpeech</span>
                {" · "}
                발성을 알아가는 시간을 함께합니다.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
