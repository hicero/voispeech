const steps = [
  {
    num: "01",
    en: "CHECK",
    title: "현재 패턴 관찰",
    text: "먼저 지금의 목소리와 노래를 들어보고 어떤 조건에서 어려움이 나타나는지 확인합니다.",
  },
  {
    num: "02",
    en: "INTERPRET",
    title: "가능한 연결 확인",
    text: "소리, 음높이, 모음, 강도 등을 바꿔보며 어떤 조건에서 발성이 달라지는지 확인합니다.",
  },
  {
    num: "03",
    en: "TRAIN",
    title: "다른 조절 시도",
    text: "현재 반응에 맞춰 여러 발성 방법과 소리 조건을 시도합니다.",
  },
  {
    num: "04",
    en: "SONG",
    title: "노래 적용",
    text: "연습에서 찾은 변화를 실제 모음과 가사, 노래에 연결합니다.",
  },
];

export default function Method() {
  return (
    <section id="method" className="section-pad bg-page">
      <div className="content-shell">
        <div className="section-intro prose-col">
          <p className="eyebrow">METHOD</p>
          <h2>
            살펴보고, 바꿔보고, 노래하기
            <span className="text-sky" aria-hidden>
              .
            </span>
          </h2>
          <p>
            소리만 듣고 원인을 단정하지 않습니다. 직접 조건을 바꿔보고, 그때
            나타나는 변화를 다음 연습의 단서로 삼습니다.
          </p>
        </div>

        <ol className="method-rail">
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
