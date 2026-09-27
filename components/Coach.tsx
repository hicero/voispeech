"use client";

import { useState } from "react";

type CoachData = {
  id: string;
  photo: string;
  photoAlt: string;
  photoPos: string;
  nameEn: string;
  nameKo: string;
  role: string;
  tagline: string;
  affiliation: string;
  headlines: string[];
  moreCareer: string[];
  secondaryTitle: string;
  secondaryNote: string;
  secondaryItems: string[];
};

const coaches: CoachData[] = [
  {
    id: "jae-woo",
    photo: "/coaches/jae-woo.jpg",
    photoAlt: "Jae Woo 재우 코치 프로필",
    photoPos: "center 18%",
    nameEn: "JAE WOO",
    nameKo: "재우",
    role: "VOCAL DIRECTOR",
    tagline: "18년의 발성 연구와 현장 코칭으로, 한 사람의 연습 방향을 함께 잡습니다.",
    affiliation: "The Voice Foundation 한국챕터 조직위원장 / 임시회장",
    headlines: [
      "VoiSpeech 대표",
      "18년차 보컬 코치",
      "『발성학과 보컬』 공동 집필 · 군자출판사, 2026",
      "The Voice Foundation Korea Chapter 조직위원장",
      "전 대한발성학회(SKVA) 이사",
    ],
    moreCareer: [
      "Justin Vocal Studio & Find Your Voice 대표",
      "홍대 실용음악학원 발성 메인 강사",
      "SLS Instructor Level 1 자격 보유",
      "한국발성교정협회 정회원",
      "강남 세브란스 병원 워크샵 수료",
    ],
    secondaryTitle: "멘토 사사",
    secondaryNote: "해외 마스터 사사",
    secondaryItems: [
      "Spencer Welch",
      "Greg Enriquez",
      "SLS",
      "Kenny Nah",
      "최성용",
      "장정우",
      "양준영",
      "남도현",
    ],
  },
  {
    id: "jae-ho",
    photo: "/coaches/jae-ho.jpg",
    photoAlt: "Jae Ho 재호 코치 프로필",
    photoPos: "center 22%",
    nameEn: "JAE HO",
    nameKo: "재호",
    role: "VOCAL COACH",
    tagline:
      "현장 코칭과 학회·연수 경험을 바탕으로, 연습 과정을 함께 정리합니다.",
    affiliation:
      "김재호 발성교정소 대표 · 남스타보컬스튜디오 실장 · VoiSpeech 부대표",
    headlines: [
      "VoiSpeech 부대표",
      "김재호 발성교정소 대표",
      "남스타보컬스튜디오 실장",
      "전 대한발성학회(SKVA) 이사",
      "『발성학과 보컬』 집필 참여 (2026)",
    ],
    moreCareer: [
      "한국발성교정협회 정회원",
      "서경대 실용음악과 졸업 · NDH발성교정아카데미 2기",
      "발성교정사 초·중·고급 과정 수료",
      "한양대 · 강남세브란스 · 분당제생 · 보아스이비인후과 실습",
      "스피치지도사 1급 · 음악심리상담사 1급",
    ],
    secondaryTitle: "연수 · 학회",
    secondaryNote: "연수 · 학술 활동",
    secondaryItems: [
      "강남세브란스 발성이론 워크숍",
      "IVA 한국 보컬 세미나",
      "제1~8회 한국발성교정협회 학술대회",
      "Rob Gray CLA International Webinar",
      "Yonsei Laser Voice Workshop",
      "4개 병원 연계 발성교정 실습 수료",
    ],
  },
];

function CoachCard({ coach }: { coach: CoachData }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="card coach-card overflow-hidden">
      <div className="coach-photo">
        <img
          src={coach.photo}
          alt={coach.photoAlt}
          width={720}
          height={900}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: coach.photoPos }}
        />
      </div>

      <div className="coach-identity">
        <p className="eyebrow">{coach.role}</p>
        <h3>
          {coach.nameEn}
          <span>{coach.nameKo}</span>
        </h3>
        <p className="coach-tagline">{coach.tagline}</p>
        <p className="coach-affiliation">{coach.affiliation}</p>
      </div>

      <div className="coach-body">
        <p className="case-kicker">주요 이력</p>
        <ul className="coach-list">
          {coach.headlines.map((item) => (
            <li key={item}>
              <span aria-hidden />
              {item}
            </li>
          ))}
        </ul>

        <div
          id={`coach-more-${coach.id}`}
          className={`expand-panel ${expanded ? "is-open" : ""}`}
          aria-hidden={!expanded}
        >
          <div className="expand-panel-inner">
            <ul className="coach-list coach-list-more">
              {coach.moreCareer.map((item) => (
                <li key={item}>
                  <span aria-hidden />
                  {item}
                </li>
              ))}
            </ul>

            <div className="coach-secondary">
              <p className="case-kicker">{coach.secondaryTitle}</p>
              <p>
                <span className="coach-chip">{coach.secondaryNote}</span>
              </p>
              <p className="coach-secondary-items">
                {coach.secondaryItems.join(" · ")}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="expand-toggle"
          aria-expanded={expanded}
          aria-controls={`coach-more-${coach.id}`}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "이력 접기 −" : "전체 이력 보기 +"}
        </button>
      </div>
    </article>
  );
}

export default function Coach() {
  return (
    <section id="coach" className="section-pad bg-surface">
      <div className="content-shell">
        <div className="section-intro prose-col">
          <p className="eyebrow">COACH</p>
          <h2>함께하는 코치</h2>
          <p>
            소리와 연습 과정을 함께 살펴보고, 직접 시도할 수 있는 방법으로
            풀어갑니다.
          </p>
        </div>

        <div className="coach-grid">
          {coaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} />
          ))}
        </div>
      </div>
    </section>
  );
}
