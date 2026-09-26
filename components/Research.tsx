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

const papers = [
  {
    title: "Differences Among Mixed, Chest, and Falsetto Registers: A Multiparametric Study",
    authors: "Lee Y, Oya M, Kaburagi T, Hidaka S, Nakagawa T",
    venue: "Journal of Voice, 2023 (online 2021)",
    doi: "https://doi.org/10.1016/j.jvoice.2020.12.028",
    why: "믹스·체스트·팔세토를 고속촬영·EGG·공기역학으로 비교해, 믹스가 별도 발성 기전을 갖는다는 점을 보여 줍니다.",
  },
  {
    title:
      "Laryngeal Muscle Activity and Vocal Fold Adduction During Chest, Chestmix, Headmix, and Head Registers in Females",
    authors: "Kochis-Jennings KA, Finnegan EM, Hoffman HT, Jaiswal S",
    venue: "Journal of Voice, 2012",
    doi: "https://doi.org/10.1016/j.jvoice.2010.11.002",
    why: "chestmix에서 성대근(TA) 활성과 성대 접촉이 head보다 커진다는 근전도·내시경 관찰입니다.",
  },
] as const;

const mediaSlots = [
  {
    type: "WORKSHOP" as const,
    title: "강남세브란스 · Yonsei Laser Voice Workshop",
    why: "병원·연수 기반 워크숍으로 임상과 코칭의 접점을 익힙니다.",
    slot: "워크숍 사진",
  },
  {
    type: "WORKSHOP" as const,
    title: "SLS Instructor Level 1",
    why: "체계적 보컬 트레이닝 자격으로 코칭 기준을 다집니다.",
    slot: "자격 · 연수 사진",
  },
  {
    type: "VIDEO" as const,
    title: "강의 · 연수 영상",
    why: "공개해도 되는 강의·워크숍 영상이 있으면 바로 연결합니다.",
    slot: "영상 썸네일",
  },
];

const mediaTypeStyle: Record<(typeof mediaSlots)[number]["type"], string> = {
  WORKSHOP: "border-sky/50 bg-surface text-navy",
  VIDEO: "border-line bg-sky-muted/40 text-muted",
};

export default function Research() {
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
            출판·연수·논문·영상을 먼저 보고, 소속·활동 단체는 아래에 모아
            둡니다. 확인된 자료만 올립니다.
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
            워크숍 · 논문 · 영상
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            믹스(레지스터 연결) 관련 논문부터 올렸습니다. 피겨·워크숍 사진·영상은
            공개 가능한 자료를 주시면 이어서 붙입니다.
          </p>
        </div>

        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {papers.map((paper) => (
            <li key={paper.doi} className="card flex flex-col p-5 md:p-6">
              <span className="inline-flex w-fit rounded-full border border-sky bg-sky-muted px-2.5 py-0.5 text-[0.6875rem] font-medium tracking-[0.1em] text-navy">
                PAPER
              </span>
              <h4 className="mt-4 text-base font-bold leading-snug text-navy">
                {paper.title}
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                {paper.authors}
              </p>
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
            </li>
          ))}
        </ul>

        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mediaSlots.map((item) => (
            <li key={item.title} className="card flex flex-col overflow-hidden">
              <div className="flex aspect-[16/10] items-center justify-center border-b border-dashed border-line bg-sky-muted/50 px-4">
                <p className="text-center text-sm text-muted">
                  {item.slot}
                  <span className="mt-1 block text-xs text-faint">
                    자료 준비 중
                  </span>
                </p>
              </div>
              <div className="flex flex-1 flex-col p-5 md:p-6">
                <span
                  className={`inline-flex w-fit rounded-full border px-2.5 py-0.5 text-[0.6875rem] font-medium tracking-[0.1em] ${mediaTypeStyle[item.type]}`}
                >
                  {item.type}
                </span>
                <h4 className="mt-4 text-base font-bold leading-snug text-navy">
                  {item.title}
                </h4>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {item.why}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-12 border-t border-line-soft pt-8">
          <p className="text-[0.6875rem] font-semibold tracking-[0.16em] text-muted">
            AFFILIATIONS
          </p>
          <h3 className="mt-1.5 text-lg font-bold tracking-tight text-navy">
            소속 · 활동 단체
          </h3>
        </div>

        <article className="card mt-6 overflow-hidden">
          <div className="grid gap-6 p-6 md:grid-cols-12 md:items-center md:gap-8 md:p-8">
            <div className="flex items-center justify-center rounded-md border border-line bg-white px-5 py-6 md:col-span-7 md:px-8 md:py-8">
              <img
                src="/research/voice-foundation.png"
                alt="The Voice Foundation — Advancing Understanding of the Voice Through Interdisciplinary Research & Education"
                width={840}
                height={280}
                className="h-auto w-full max-w-none object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="min-w-0 md:col-span-5">
              <span className="inline-flex w-fit rounded-full border border-line bg-page px-2.5 py-0.5 text-[0.6875rem] font-medium tracking-[0.1em] text-navy-soft">
                ASSOCIATION
              </span>
              <h4 className="mt-4 text-xl font-bold leading-snug text-navy md:text-2xl">
                The Voice Foundation 한국챕터
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
                음성·발성 분야의 국제 네트워크와 국내 활동을 잇는 조직입니다.
                학제 간 연구와 교육을 통해 목소리에 대한 이해를 넓히는 일을
                함께합니다.
              </p>
            </div>
          </div>
        </article>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
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
          논문 피겨는 저널·저자 허용 범위의 이미지만 올립니다. 워크숍 사진·영상
          링크는 자료를 주시면 바로 연결합니다.
        </p>
      </div>
    </section>
  );
}
