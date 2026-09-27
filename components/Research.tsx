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
  doi: string;
  why: string;
  figure: null | { src: string; alt: string; caption: string };
};

const featuredPapers: Paper[] = [
  {
    title:
      "Differences Among Mixed, Chest, and Falsetto Registers: A Multiparametric Study",
    authors: "Lee Y, Oya M, Kaburagi T, Hidaka S, Nakagawa T",
    venue: "Journal of Voice, 2023 (online 2021)",
    doi: "https://doi.org/10.1016/j.jvoice.2020.12.028",
    why: "저음·고음 연결(믹스)과 체스트·팔세토를 여러 측정으로 비교한 연구입니다. 각 조건에서 소리가 어떻게 달라지는지 보여 줍니다.",
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
    venue: "Folia Phoniatrica et Logopaedica, 2010, 62:278–287",
    doi: "https://doi.org/10.1159/000312668",
    why: "테너가 다른 방식으로 음역을 넘길 때, MRI에서 입·인두 형태가 어떻게 달라지는지 보여 줍니다.",
    figure: {
      src: "/research/figures/echternach-2010-fig-mri.png",
      alt: "Echternach et al. Figure 3 — tenor MRI vocal-tract profiles: modal→falsetto vs voix mixte (D4/G4)",
      caption:
        "Figure 3. MRI vocal-tract profiles (modal → falsetto vs voix mixte), Folia Phoniatr Logop / Echternach et al. 2010",
    },
  },
];

const morePapers: Paper[] = [
  {
    title:
      "Cricothyroid Muscle and Thyroarytenoid Muscle Dominance in Vocal Register Control: Preliminary Results",
    authors: "Kochis-Jennings KA, Finnegan EM, Hoffman HT, Jaiswal S, Hull D",
    venue: "Journal of Voice, 2014",
    doi: "https://doi.org/10.1016/j.jvoice.2014.01.017",
    why: "음높이와 소리 조건이 바뀔 때 후두 근육의 활동 비율이 어떻게 달라지는지 살펴본 예비 연구입니다.",
    figure: {
      src: "/research/figures/kochis-2014-fig1-ct-ta.png",
      alt: "Kochis-Jennings et al. Figure 1 — CT:TA ratio vs fundamental frequency across subjects and registers",
      caption:
        "Figure 1. CT:TA muscle activity ratios during pitch glides (chest · head), Journal of Voice / Kochis-Jennings et al. 2014",
    },
  },
  {
    title:
      "Bi-stable vocal fold adduction: A mechanism of modal-falsetto register shifts and mixed registration",
    authors: "Ingo R. Titze",
    venue: "Journal of the Acoustical Society of America, 2014, 135(4), 2091–2101",
    doi: "https://doi.org/10.1121/1.4868355",
    why: "저음·고음이 바뀌거나 연결될 때 나타날 수 있는 소리 조건의 메커니즘을 이론과 시뮬레이션으로 설명합니다.",
    figure: {
      src: "/research/figures/titze-2014-fig-mixed.png",
      alt: "Titze Figure 1 — convergent · rectangular · divergent 성문 형태 모식도",
      caption:
        "Figure 1. Glottal shapes (convergent · rectangular · divergent), Journal of the Acoustical Society of America / Titze 2014",
    },
  },
  {
    title:
      "Laryngeal Muscle Activity and Vocal Fold Adduction During Chest, Chestmix, Headmix, and Head Registers in Females",
    authors: "Kochis-Jennings KA, Finnegan EM, Hoffman HT, Jaiswal S",
    venue: "Journal of Voice, 2012",
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
    <li className="card flex flex-col overflow-hidden">
      {paper.figure ? (
        <figure className="border-b border-line bg-white">
          <img
            src={paper.figure.src}
            alt={paper.figure.alt}
            width={1200}
            height={700}
            className="h-auto w-full object-contain object-center"
            loading="lazy"
            decoding="async"
          />
          <figcaption className="px-4 py-2 text-xs leading-relaxed text-muted">
            {paper.figure.caption}
          </figcaption>
        </figure>
      ) : null}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <span className="inline-flex w-fit rounded-full border border-sky bg-sky-muted px-2.5 py-0.5 text-[0.6875rem] font-medium tracking-[0.1em] text-navy">
          PAPER
        </span>
        <h4 className="mt-4 text-base font-bold leading-snug text-navy">
          {paper.title}
        </h4>
        <p className="mt-2 text-xs leading-relaxed text-muted">{paper.authors}</p>
        <p className="mt-1 text-xs font-medium text-sky">{paper.venue}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
          {paper.why}
        </p>
        <a
          className="mt-4 inline-flex text-sm font-semibold text-navy underline-offset-4 hover:underline"
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
    <section id="research" className="section-pad bg-page">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">RESEARCH</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy md:text-4xl">
            발성을 과학으로 다루는 이유
            <span className="text-sky" aria-hidden>
              .
            </span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
            출판·논문·소속 활동을 먼저 보고, 추가로 확인된 자료는 아래에서 이어
            볼 수 있습니다. 확인된 자료만 올립니다.
          </p>
        </div>

        <div className="mt-12 border-t border-line-soft pt-8">
          <p className="text-[0.6875rem] font-semibold tracking-[0.16em] text-muted">
            PUBLICATION
          </p>
          <h3 className="mt-1.5 text-lg font-bold tracking-tight text-navy">
            출판
          </h3>
        </div>

        <article className="card mt-6 overflow-hidden md:grid md:grid-cols-12">
          <div className="flex items-center justify-center bg-sky-muted px-6 py-8 md:col-span-5 md:px-8 md:py-10">
            <img
              src="/research/vocology-and-vocal.jpg"
              alt="도서 「발성학과 보컬」 Vocology and Vocal 표지"
              width={900}
              height={1200}
              className="mx-auto h-auto w-full max-w-[260px] object-contain object-center shadow-sm md:max-w-[300px]"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="flex flex-col justify-center p-6 md:col-span-7 md:p-10">
            <span className="inline-flex w-fit rounded-full border border-sky bg-sky-muted px-2.5 py-0.5 text-[0.6875rem] font-medium tracking-[0.1em] text-navy">
              BOOK
            </span>
            <h4 className="mt-4 text-2xl font-bold tracking-tight text-navy md:text-3xl">
              발성학과 보컬
            </h4>
            <p className="mt-1 text-sm font-medium tracking-wide text-sky">
              Vocology and Vocal
            </p>
            <dl className="mt-5 space-y-2 text-sm text-muted">
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-semibold text-navy-soft">지은이</dt>
                <dd>손대명</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-semibold text-navy-soft">출판</dt>
                <dd>군자출판사</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-semibold text-navy-soft">소개</dt>
                <dd>발성학(Vocology) 입문을 위한 기본서</dd>
              </div>
            </dl>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              발성학을 보컬 현장에 연결한 도서입니다. VoiSpeech 코치진이 집필에
              참여했습니다.
            </p>
          </div>
        </article>

        <div className="mt-12 border-t border-line-soft pt-8">
          <p className="text-[0.6875rem] font-semibold tracking-[0.16em] text-muted">
            WORKS
          </p>
          <h3 className="mt-1.5 text-lg font-bold tracking-tight text-navy">
            논문 · 연수
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            저음·고음 연결과 소리 조건 변화에 관한 논문과 피겨를 올렸습니다.
          </p>
        </div>

        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {featuredPapers.map((paper) => (
            <PaperCard key={paper.doi} paper={paper} />
          ))}
        </ul>

        <article className="card mt-4 p-5 md:p-6">
          <span className="inline-flex w-fit rounded-full border border-sky/50 bg-surface px-2.5 py-0.5 text-[0.6875rem] font-medium tracking-[0.1em] text-navy">
            WORKSHOP
          </span>
          <h4 className="mt-4 text-base font-bold leading-snug text-navy">
            {workshopHighlight.title}
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {workshopHighlight.why}
          </p>
        </article>

        <div
          id="research-more"
          className={`expand-panel ${showMore ? "is-open" : ""}`}
          aria-hidden={!showMore}
        >
          <div className="expand-panel-inner">
            <ul className="mt-4 grid gap-4 lg:grid-cols-2">
              {morePapers.map((paper) => (
                <PaperCard key={paper.doi} paper={paper} />
              ))}
            </ul>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {moreMedia.map((item) => (
                <li key={item.title} className="card flex flex-col p-5 md:p-6">
                  <span className="inline-flex w-fit rounded-full border border-line bg-page px-2.5 py-0.5 text-[0.6875rem] font-medium tracking-[0.1em] text-navy-soft">
                    {item.type}
                  </span>
                  <h4 className="mt-4 text-base font-bold leading-snug text-navy">
                    {item.title}
                  </h4>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {item.why}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          type="button"
          className="expand-toggle mt-5"
          aria-expanded={showMore}
          aria-controls="research-more"
          onClick={() => setShowMore((v) => !v)}
        >
          {showMore ? "연구·학술 활동 접기 −" : "연구·학술 활동 더 보기 +"}
        </button>

        <div className="mt-12 border-t border-line-soft pt-8">
          <p className="text-[0.6875rem] font-semibold tracking-[0.16em] text-muted">
            AFFILIATIONS
          </p>
          <h3 className="mt-1.5 text-lg font-bold tracking-tight text-navy">
            소속 · 활동 단체
          </h3>
        </div>

        <article className="card mt-6 overflow-hidden">
          <div className="grid gap-5 p-5 md:grid-cols-12 md:items-center md:gap-6 md:p-6">
            <div className="flex items-center justify-center rounded-md border border-line bg-white px-4 py-4 md:col-span-5">
              <img
                src="/research/voice-foundation.png"
                alt="The Voice Foundation — Advancing Understanding of the Voice Through Interdisciplinary Research & Education"
                width={840}
                height={280}
                className="h-auto w-full max-w-[280px] object-contain md:max-w-none"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="min-w-0 md:col-span-7">
              <span className="inline-flex w-fit rounded-full border border-line bg-page px-2.5 py-0.5 text-[0.6875rem] font-medium tracking-[0.1em] text-navy-soft">
                ASSOCIATION
              </span>
              <h4 className="mt-3 text-lg font-bold leading-snug text-navy md:text-xl">
                The Voice Foundation 한국챕터
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                음성·발성 분야의 국제 네트워크와 국내 활동을 잇는 조직입니다.
              </p>
              <div
                id="affil-detail"
                className={`expand-panel ${showAffilDetail ? "is-open" : ""}`}
                aria-hidden={!showAffilDetail}
              >
                <div className="expand-panel-inner">
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    학제 간 연구와 교육을 통해 목소리에 대한 이해를 넓히는 일을
                    함께합니다.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="expand-toggle mt-3"
                aria-expanded={showAffilDetail}
                aria-controls="affil-detail"
                onClick={() => setShowAffilDetail((v) => !v)}
              >
                {showAffilDetail ? "설명 접기 −" : "자세히 보기 +"}
              </button>
            </div>
          </div>
        </article>

        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {affiliations.map((item) => (
            <li key={item.title} className="card flex flex-col p-5 md:p-6">
              <span className="inline-flex w-fit rounded-full border border-line bg-page px-2.5 py-0.5 text-[0.6875rem] font-medium tracking-[0.1em] text-navy-soft">
                ASSOCIATION
              </span>
              <h4 className="mt-4 text-base font-bold leading-snug text-navy">
                {item.title}
              </h4>
              <p className="mt-2 text-sm font-semibold text-sky">{item.role}</p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {item.why}
              </p>
            </li>
          ))}
        </ul>

        <p className="section-note mt-6">
          논문 피겨는 출처를 밝히고 DOI로 원문을 연결합니다. 상업적 재사용이
          제한될 수 있으니, 장기적으로는 저널·저자 허용 이미지를 쓰는 편이
          안전합니다.
        </p>
      </div>
    </section>
  );
}
