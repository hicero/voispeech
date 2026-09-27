import { isHttpsUrl, onedayPlatforms } from "./siteConfig";

const programs = [
  {
    num: "01",
    name: "ONE-DAY",
    tag: "Entry · 50 min",
    who: "처음 확인 · 방향이 필요할 때",
    desc: "하루 수업으로 현재 목소리를 확인하고, 다음에 무엇을 연습할지 방향을 잡습니다.",
    points: [
      "5 VOICE CHECK + 개인 발성 코칭 리포트",
      "어떤 조건에서 소리가 달라지는지 비교",
      "혼자 이어갈 연습 포인트 정리",
    ],
    href: "#booking",
    cta: "원데이 클래스 예약",
  },
  {
    num: "02",
    name: "PRIVATE",
    tag: "1:1 · Ongoing",
    who: "꾸준히 바꾸고 노래에 연결할 때",
    desc: "목표와 연습 여건에 맞춰 이어가는 1:1 레슨입니다. 변화와 노래 적용을 한 흐름으로 갑니다.",
    points: [
      "저음·고음 연결 · 힘 조절 · 모음 연습",
      "찾은 변화를 노래 구절에 적용",
      "수업마다 다음 연습 우선순위 정리",
    ],
    href: "#contact",
    cta: "1:1 발성 코칭 예약",
  },
  {
    num: "03",
    name: "ONLINE",
    tag: "Self-paced · Membership",
    who: "수업 사이 혼자 연습할 때",
    desc: "강의·기록·커뮤니티로 같은 소리를 다시 만들고, 온라인에서도 피드백을 이어갈 수 있습니다.",
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
      <div className="content-shell">
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
              <p className="program-who">{p.who}</p>
              <p className="program-desc">{p.desc}</p>
              <ul>
                {p.points.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <a href={p.href}>
                {p.cta} <span aria-hidden>↗</span>
              </a>
              {p.num === "01" && (
                <div className="oneday-platforms">
                  <p className="oneday-platforms-label">다른 곳에서 신청</p>
                  <div className="oneday-platforms-list">
                    {onedayPlatforms.map((platform) =>
                      isHttpsUrl(platform.url) ? (
                        <a
                          key={platform.name}
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {platform.name}
                        </a>
                      ) : (
                        <span key={platform.name}>{platform.name}</span>
                      ),
                    )}
                  </div>
                </div>
              )}
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
