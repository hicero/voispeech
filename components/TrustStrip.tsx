const items = [
  {
    label: "1:1",
    title: "맞춤 레슨",
    text: "한 분의 발성 상태에 맞춰 수업 방향을 잡습니다.",
  },
  {
    label: "5 Voice Check",
    title: "발성 관찰",
    text: "숨과 소리, 성구 연결, 긴장, 모음, 연습을 함께 살펴봅니다.",
  },
  {
    label: "Report",
    title: "코칭 리포트",
    text: "원데이 수업에서 확인한 특징과 연습 방향을 PDF로 정리합니다.",
  },
];

export default function TrustStrip() {
  return (
    <section aria-label="핵심 차별점" className="border-y border-line bg-surface">
      <div className="mx-auto grid max-w-6xl divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
        {items.map((item) => (
          <div key={item.label} className="px-5 py-8 md:px-8 md:py-10">
            <p className="eyebrow text-sky !normal-case tracking-[0.12em]">
              {item.label}
            </p>
            <h2 className="mt-2 text-lg font-bold text-navy">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
