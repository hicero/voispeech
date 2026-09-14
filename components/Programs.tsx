const programs = [
  {
    num: "01",
    name: "ONE-DAY",
    tag: "Entry · 50 min",
    desc: "하루로 내 발성 상태를 살펴보고, 다음에 무엇을 연습할지 방향을 잡습니다.",
    points: [
      "5 Voice Check로 현재 패턴 관찰",
      "막히는 지점과 가능한 조절 확인",
      "개인 발성 코칭 리포트 PDF",
    ],
    href: "#booking",
    cta: "원데이 예약하기",
  },
  {
    num: "02",
    name: "PRIVATE",
    tag: "1:1 · Ongoing",
    desc: "목표와 연습 여건에 맞춰 꾸준히 이어가는 개인 레슨입니다. 연결·긴장·곡 적용까지 한 흐름으로 갑니다.",
    points: [
      "성구 연결 · 고음 · 긴장 완화",
      "찾은 소리를 노래 구절에 적용",
      "수업마다 다음 연습 우선순위 정리",
    ],
    href: "#contact",
    cta: "정규 레슨 문의",
  },
  {
    num: "03",
    name: "ONLINE",
    tag: "Self-paced · Membership",
    desc: "수업과 수업 사이, 강의·기록·커뮤니티로 혼자 연습을 이어가는 온라인 훈련관입니다.",
    points: [
      "발성 강의 시청 · 세션별 연습",
      "연습 기록과 진도 남기기",
      "커뮤니티에서 질문 · 나눔",
    ],
    href: "/training",
    cta: "온라인 훈련 둘러보기",
  },
];

export default function Programs() {
  return (
    <section id="programs" className="section-pad bg-page">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="section-heading">
          <div>
            <p className="eyebrow">PROGRAMS</p>
            <h2>One-Day, Private, Online.</h2>
          </div>
          <p>
            학원식 반 나누기 대신,
            <br />
            시작 · 꾸준한 1:1 · 사이 연습으로 구성합니다.
          </p>
        </div>
        <div className="program-grid">
          {programs.map((p) => (
            <article className="program-card" key={p.num}>
              <div className="program-top">
                <span>{p.num}</span>
                <span>{p.tag}</span>
              </div>
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
              <ul>
                {p.points.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <a href={p.href}>
                {p.cta} <span aria-hidden>↗</span>
              </a>
            </article>
          ))}
        </div>
        <p className="section-note">
          세부 구성과 비용은 상담 시 안내합니다. ONLINE은 멤버십으로 이용할 수
          있습니다.
        </p>
      </div>
    </section>
  );
}
