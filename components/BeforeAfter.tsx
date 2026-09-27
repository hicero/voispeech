const cases = [
  {
    label: "CASE 01",
    title: "고음 연결",
    before:
      "올라갈수록 목 주변이 단단해지고, 소리 무게가 갑자기 바뀌는 느낌이 있었습니다.",
    changed: "같은 구절에서 소리 무게를 조금 덜어 연결해 보았습니다.",
    after: "전환 구간이 덜 거칠게 느껴졌습니다.",
  },
  {
    label: "CASE 02",
    title: "말소리 피로",
    before: "긴 대화나 연습 뒤에 목이 쉽게 지치는 느낌이 있었습니다.",
    changed: "크기와 모음을 바꿔 비교하며 연습했습니다.",
    after: "같은 시간에도 부담이 덜하게 느껴졌습니다.",
  },
  {
    label: "CASE 03",
    title: "곡 적용",
    before:
      "연습실에서는 괜찮은데, 노래 구절에 넣으면 다시 예전 패턴으로 돌아가곤 했습니다.",
    changed: "짧은 구절에 바로 적용하며 같은 조절을 다시 내 보았습니다.",
    after: "같은 변화를 노래에서도 이어갈 수 있는지 확인하는 쪽으로 맞춰 갔습니다.",
  },
] as const;

export default function BeforeAfter() {
  return (
    <section id="results" className="section-pad bg-surface">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">BEFORE &amp; AFTER</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy md:text-4xl">
            같은 구간, 달라진 발성 조건
            <span className="text-sky" aria-hidden>
              .
            </span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
            수업에서 확인한 변화를 짧게 보여줍니다. 아래는 레이아웃용 예시이며,
            수치·치료 효과를 주장하지 않습니다.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {cases.map((item) => (
            <article key={item.label} className="card flex flex-col overflow-hidden">
              <div className="ba-split" aria-hidden="true">
                <div className="ba-panel ba-panel-before">
                  <span>BEFORE</span>
                </div>
                <div className="ba-panel ba-panel-after">
                  <span>AFTER</span>
                </div>
              </div>

              <div className="flex flex-1 flex-col px-5 py-5 md:px-6">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[0.6875rem] font-medium tracking-[0.14em] text-sky">
                    {item.label}
                  </span>
                  <span className="text-[0.6875rem] tracking-[0.08em] text-faint">
                    LAYOUT SAMPLE
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-navy">{item.title}</h3>

                <div className="mt-4 flex flex-1 flex-col gap-3">
                  <div className="rounded-lg border border-line-soft bg-page px-3.5 py-3">
                    <p className="text-[0.6875rem] font-medium tracking-[0.12em] text-muted">
                      BEFORE
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-navy-soft">
                      {item.before}
                    </p>
                  </div>
                  <div className="rounded-lg border border-line bg-surface px-3.5 py-3">
                    <p className="text-[0.6875rem] font-medium tracking-[0.12em] text-sky">
                      WHAT WE CHANGED
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-navy-soft">
                      {item.changed}
                    </p>
                  </div>
                  <div className="rounded-lg border border-sky/40 bg-sky-muted/60 px-3.5 py-3">
                    <p className="text-[0.6875rem] font-medium tracking-[0.12em] text-navy">
                      AFTER
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-navy-soft">
                      {item.after}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="section-note mt-6">
          영상·음원으로 교체 가능 · 실제 사례 미디어를 주시면 이 자리에 바로
          올립니다.
        </p>
      </div>
    </section>
  );
}
