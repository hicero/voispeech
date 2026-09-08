const steps = [
  {
    num: "01",
    en: "CHECK",
    title: "현재 패턴 관찰",
    text: "어떤 음과 발음에서 소리와 힘이 달라지는지 살펴봅니다.",
  },
  {
    num: "02",
    en: "INTERPRET",
    title: "가능한 연결 확인",
    text: "관찰한 변화가 무엇과 관련될 수 있는지 함께 짚어봅니다.",
  },
  {
    num: "03",
    en: "TRAIN",
    title: "다른 조절 시도",
    text: "모음과 소리 크기 등을 바꿔, 편안함과 소리의 차이를 비교합니다.",
  },
  {
    num: "04",
    en: "SONG",
    title: "노래에 적용",
    text: "곡의 한 구절에 적용하고, 같은 변화를 다시 낼 수 있는지 확인합니다.",
  },
];

export default function Method() {
  return (
    <section id="method" className="section-pad bg-page">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">METHOD</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy md:text-4xl">
            살펴보고, 바꿔보고, 노래하기
            <span className="text-sky" aria-hidden>
              .
            </span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
            소리만 듣고 원인을 단정하지 않습니다. 직접 조건을 바꿔보고,
            그때 나타나는 변화를 다음 연습의 단서로 삼습니다.
          </p>
        </div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step.num} className="card flex flex-col p-6">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-medium text-sky">{step.num}</span>
                <span className="text-[0.6875rem] font-medium tracking-[0.14em] text-muted">
                  {step.en}
                </span>
              </div>
              <h3 className="mt-5 text-base font-bold text-navy">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
