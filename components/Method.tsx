const steps = [
  {
    num: "01",
    en: "CHECK",
    title: "현재 패턴 관찰",
    text: "지금 목소리와 노래를 먼저 들어봅니다. 어디서 어려움이 나타나는지 확인합니다.",
  },
  {
    num: "02",
    en: "INTERPRET",
    title: "가능한 연결 확인",
    text: "소리, 음높이, 모음, 세기를 바꿔보며 발성이 어디서 달라지는지 확인합니다.",
  },
  {
    num: "03",
    en: "TRAIN",
    title: "다른 조절 시도",
    text: "그 반응에 맞춰 다른 방법과 소리 조건을 시도합니다.",
  },
  {
    num: "04",
    en: "SONG",
    title: "노래 적용",
    text: "연습에서 찾은 변화를 모음과 가사, 노래에 바로 붙여봅니다.",
  },
];

export default function Method() {
  return (
    <section id="method" className="section-pad bg-page">
      <div className="content-shell">
        <div className="section-intro prose-col" data-reveal>
          <p className="eyebrow">METHOD</p>
          <h2 className="line-rise">
            <span className="line-rise-item">
              <span className="line-rise-inner">
                살펴보고, 바꿔보고,{" "}
                <span className="phrase-mark">노래하기</span>
                <span className="text-sky" aria-hidden>
                  .
                </span>
              </span>
            </span>
          </h2>
          <p>
            소리만 듣고 원인을 단정하지 않습니다. 조건을 하나씩 바꿔보며 소리가
            어떻게 달라지는지 확인하고 그 변화를 다음 연습으로 이어갑니다.
          </p>
        </div>

        <ol className="method-rail" data-reveal>
          {steps.map((step) => (
            <li key={step.num}>
              <div className="method-step-top">
                <span className="method-num">{step.num}</span>
                <span className="method-en">{step.en}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
