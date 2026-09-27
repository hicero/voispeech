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
      <div className="content-shell">
        <div className="section-intro prose-col">
          <p className="eyebrow">BEFORE &amp; AFTER</p>
          <h2>
            같은 구간, 달라진 발성 조건
            <span className="text-sky" aria-hidden>
              .
            </span>
          </h2>
          <p>
            수업에서 확인한 변화를 짧게 보여줍니다. 수치·치료 효과를 주장하지
            않습니다.
          </p>
        </div>

        <div className="case-notes">
          {cases.map((item) => (
            <article key={item.label} className="case-note">
              <header className="case-note-head">
                <span className="case-note-label">{item.label}</span>
                <h3>{item.title}</h3>
              </header>

              <div className="case-note-body">
                <div className="case-block case-block-before">
                  <div className="case-block-top">
                    <p className="case-kicker">BEFORE</p>
                    <span className="case-audio-slot" aria-hidden="true">
                      ▶ BEFORE
                    </span>
                  </div>
                  <p>{item.before}</p>
                </div>

                <div className="case-block case-block-changed">
                  <p className="case-kicker">WHAT WE CHANGED</p>
                  <p>{item.changed}</p>
                </div>

                <div className="case-block case-block-after">
                  <div className="case-block-top">
                    <p className="case-kicker">AFTER</p>
                    <span className="case-audio-slot" aria-hidden="true">
                      ▶ AFTER
                    </span>
                  </div>
                  <p>{item.after}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="section-note">
          영상·음원으로 교체 가능 · 실제 사례 미디어를 주시면 이 자리에 바로
          올립니다.
        </p>
      </div>
    </section>
  );
}
