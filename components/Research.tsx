"use client";

import { useState } from "react";

const affiliations = [
  {
    title: "대한발성학회",
    role: "전 이사",
    why: "학회 활동을 통해 발성·음성 분야의 흐름을 익혔습니다.",
  },
  {
    title: "한국발성교정협회",
    role: "정회원",
    why: "발성교정 현장과 협회 활동을 이어 가고 있습니다.",
  },
] as const;

type Paper = {
  title: string;
  authors: string;
  venue: string;
  year: string;
  doi: string;
  why: string;
  figure: null | { src: string; alt: string; caption: string };
};

const featuredPapers: Paper[] = [
  {
    title:
      "Differences Among Mixed, Chest, and Falsetto Registers: A Multiparametric Study",
    authors: "Lee Y, Oya M, Kaburagi T, Hidaka S, Nakagawa T",
    venue: "Journal of Voice",
    year: "2023",
    doi: "https://doi.org/10.1016/j.jvoice.2020.12.028",
    why: "저음·고음 연결(믹스)과 체스트·팔세토를 여러 측정으로 비교한 연구입니다.",
    figure: {
      src: "/research/figures/lee-2021-fig5-hsdi.png",
      alt: "Lee et al. Figure 5 — chest, falsetto, mix 성대 고속촬영(HSDI) 연속 이미지",
      caption:
        "Figure 5. HSDI glottal sequences (chest · falsetto · mix), Journal of Voice",
    },
  },
  {
    title: "Professional Opera Tenors' Vocal Tract Configurations in Registers",
    authors: "Matthias Echternach, Johan Sundberg, Michael Markl, Bernhard Richter",
    venue: "Folia Phoniatrica et Logopaedica",
    year: "2010",
    doi: "https://doi.org/10.1159/000312668",
    why: "테너가 음역을 넘길 때 MRI에서 입·인두 형태가 어떻게 달라지는지 보여 줍니다.",
    figure: {
      src: "/research/figures/echternach-2010-fig-mri.png",
      alt: "Echternach et al. Figure 3 — tenor MRI vocal-tract profiles: modal→falsetto vs voix mixte (D4/G4)",
      caption:
        "Figure 3. MRI vocal-tract profiles, Folia Phoniatr Logop / Echternach et al. 2010",
    },
  },
];

const morePapers: Paper[] = [
  {
    title:
      "Cricothyroid Muscle and Thyroarytenoid Muscle Dominance in Vocal Register Control: Preliminary Results",
    authors: "Kochis-Jennings KA, Finnegan EM, Hoffman HT, Jaiswal S, Hull D",
    venue: "Journal of Voice",
    year: "2014",
    doi: "https://doi.org/10.1016/j.jvoice.2014.01.017",
    why: "음높이와 소리 조건이 바뀔 때 후두 근육 활동 비율이 어떻게 달라지는지 살펴본 예비 연구입니다.",
    figure: {
      src: "/research/figures/kochis-2014-fig1-ct-ta.png",
      alt: "Kochis-Jennings et al. Figure 1 — CT:TA ratio vs fundamental frequency across subjects and registers",
      caption:
        "Figure 1. CT:TA muscle activity ratios, Journal of Voice / Kochis-Jennings et al. 2014",
    },
  },
  {
    title:
      "Bi-stable vocal fold adduction: A mechanism of modal-falsetto register shifts and mixed registration",
    authors: "Ingo R. Titze",
    venue: "Journal of the Acoustical Society of America",
    year: "2014",
    doi: "https://doi.org/10.1121/1.4868355",
    why: "저음·고음이 바뀌거나 연결될 때 나타날 수 있는 메커니즘을 이론과 시뮬레이션으로 설명합니다.",
    figure: {
      src: "/research/figures/titze-2014-fig-mixed.png",
      alt: "Titze Figure 1 — convergent · rectangular · divergent 성문 형태 모식도",
      caption:
        "Figure 1. Glottal shapes, JASA / Titze 2014",
    },
  },
  {
    title:
      "Laryngeal Muscle Activity and Vocal Fold Adduction During Chest, Chestmix, Headmix, and Head Registers in Females",
    authors: "Kochis-Jennings KA, Finnegan EM, Hoffman HT, Jaiswal S",
    venue: "Journal of Voice",
    year: "2012",
    doi: "https://doi.org/10.1016/j.jvoice.2010.11.002",
    why: "여러 소리 조건에서 후두 근육 활동과 접촉 양상이 어떻게 달라지는지 관찰한 연구입니다.",
    figure: null,
  },
];

const workshopHighlight = {
  title: "강남세브란스 · Yonsei Laser Voice Workshop",
  why: "병원·연수 기반 워크숍으로 임상과 코칭의 접점을 익힙니다.",
};

const moreMedia = [
  {
    type: "WORKSHOP" as const,
    title: "SLS Instructor Level 1",
    why: "체계적 보컬 트레이닝 자격으로 코칭 기준을 다집니다.",
  },
  {
    type: "VIDEO" as const,
    title: "강의 · 연수 영상",
    why: "공개해도 되는 강의·워크숍 영상이 있으면 바로 연결합니다.",
  },
];

function PaperCard({ paper }: { paper: Paper }) {
  return (
    <li className={`card paper-card ${paper.figure ? "has-figure" : "text-only"}`}>
      {paper.figure ? (
        <figure className="paper-figure">
          <img
            src={paper.figure.src}
            alt={paper.figure.alt}
            width={1200}
            height={700}
            loading="lazy"
            decoding="async"
          />
          <figcaption>{paper.figure.caption}</figcaption>
        </figure>
      ) : null}
      <div className="paper-body">
        <span className="paper-badge">PAPER</span>
        <h4>{paper.title}</h4>
        <p className="paper-meta">
          {paper.authors}
          <span aria-hidden> · </span>
          {paper.venue}, {paper.year}
        </p>
        <p className="paper-why">{paper.why}</p>
        <a
          className="paper-doi"
          href={paper.doi}
          target="_blank"
          rel="noopener noreferrer"
        >
          DOI에서 보기 ↗
        </a>
      </div>
    </li>
  );
}

export default function Research() {
  const [showMore, setShowMore] = useState(false);
  const [showAffilDetail, setShowAffilDetail] = useState(false);

  return (
    <section id="research" className="section-pad">
      <div className="content-shell">
        <div className="section-intro prose-col">
          <p className="eyebrow">RESEARCH</p>
          <h2>
            발성을 과학으로 다루는 이유
            <span className="text-sky" aria-hidden>
              .
            </span>
          </h2>
          <p>
            출판·논문·소속 활동을 먼저 보고, 추가로 확인된 자료는 아래에서 이어
            볼 수 있습니다. 확인된 자료만 올립니다.
          </p>
        </div>

        <div className="research-block-label">
          <p className="case-kicker">PUBLICATION</p>
          <h3>출판</h3>
        </div>

        <article className="card book-feature">
          <div className="book-cover">
            <img
              src="/research/vocology-and-vocal.jpg"
              alt="도서 「발성학과 보컬」 Vocology and Vocal 표지"
              width={900}
              height={1200}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="book-copy">
            <span className="paper-badge">BOOK</span>
            <h4>발성학과 보컬</h4>
            <p className="book-en">Vocology and Vocal</p>
            <dl>
              <div>
                <dt>지은이</dt>
                <dd>손대명</dd>
              </div>
              <div>
                <dt>출판</dt>
                <dd>군자출판사</dd>
              </div>
              <div>
                <dt>소개</dt>
                <dd>발성학(Vocology) 입문을 위한 기본서</dd>
              </div>
            </dl>
            <p>
              발성학을 보컬 현장에 연결한 도서입니다. VoiSpeech 코치진이 집필에
              참여했습니다.
            </p>
          </div>
        </article>

        <div className="research-block-label">
          <p className="case-kicker">WORKS</p>
          <h3>논문 · 연수</h3>
          <p>
            저음·고음 연결과 소리 조건 변화에 관한 논문과 피겨를 올렸습니다.
          </p>
        </div>

        <ul className="paper-grid">
          {featuredPapers.map((paper) => (
            <PaperCard key={paper.doi} paper={paper} />
          ))}
        </ul>

        <article className="card workshop-card">
          <span className="paper-badge paper-badge-soft">WORKSHOP</span>
          <h4>{workshopHighlight.title}</h4>
          <p>{workshopHighlight.why}</p>
        </article>

        <div
          id="research-more"
          className={`expand-panel ${showMore ? "is-open" : ""}`}
          aria-hidden={!showMore}
        >
          <div className="expand-panel-inner">
            <ul className="paper-grid paper-grid-more">
              {morePapers.map((paper) => (
                <PaperCard key={paper.doi} paper={paper} />
              ))}
            </ul>
            <ul className="media-grid">
              {moreMedia.map((item) => (
                <li key={item.title} className="card media-card">
                  <span className="paper-badge paper-badge-soft">{item.type}</span>
                  <h4>{item.title}</h4>
                  <p>{item.why}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          type="button"
          className="expand-toggle"
          aria-expanded={showMore}
          aria-controls="research-more"
          onClick={() => setShowMore((v) => !v)}
        >
          {showMore ? "연구·학술 활동 접기 −" : "연구·학술 활동 더 보기 +"}
        </button>

        <div className="research-block-label">
          <p className="case-kicker">AFFILIATIONS</p>
          <h3>소속 · 활동 단체</h3>
        </div>

        <div className="affil-grid">
          <article className="card affil-card affil-feature">
            <div className="affil-logo">
              <img
                src="/research/voice-foundation.png"
                alt="The Voice Foundation — Advancing Understanding of the Voice Through Interdisciplinary Research & Education"
                width={840}
                height={280}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="affil-copy">
              <span className="paper-badge paper-badge-soft">ASSOCIATION</span>
              <h4>The Voice Foundation 한국챕터</h4>
              <p>
                음성·발성 분야의 국제 네트워크와 국내 활동을 잇는 조직입니다.
              </p>
              <div
                id="affil-detail"
                className={`expand-panel ${showAffilDetail ? "is-open" : ""}`}
                aria-hidden={!showAffilDetail}
              >
                <div className="expand-panel-inner">
                  <p>
                    학제 간 연구와 교육을 통해 목소리에 대한 이해를 넓히는 일을
                    함께합니다.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="expand-toggle"
                aria-expanded={showAffilDetail}
                aria-controls="affil-detail"
                onClick={() => setShowAffilDetail((v) => !v)}
              >
                {showAffilDetail ? "설명 접기 −" : "자세히 보기 +"}
              </button>
            </div>
          </article>

          {affiliations.map((item) => (
            <article key={item.title} className="card affil-card">
              <span className="paper-badge paper-badge-soft">ASSOCIATION</span>
              <h4>{item.title}</h4>
              <p className="affil-role">{item.role}</p>
              <p>{item.why}</p>
            </article>
          ))}
        </div>

        <p className="section-note">
          논문 피겨는 출처를 밝히고 DOI로 원문을 연결합니다. 상업적 재사용이
          제한될 수 있으니, 장기적으로는 저널·저자 허용 이미지를 쓰는 편이
          안전합니다.
        </p>
      </div>
    </section>
  );
}
