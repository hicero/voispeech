type Item = {
  type: "ASSOCIATION" | "WORKSHOP";
  title: string;
  why: string;
};

const items: Item[] = [
  {
    type: "ASSOCIATION",
    title: "대한발성학회 · 한국발성교정학회",
    why: "학술대회와 학회 활동을 통해 발성교정 흐름을 꾸준히 따라갑니다.",
  },
  {
    type: "WORKSHOP",
    title: "강남세브란스 · Yonsei Laser Voice Workshop",
    why: "병원·연수 기반 워크숍으로 임상과 코칭의 접점을 익힙니다.",
  },
  {
    type: "WORKSHOP",
    title: "SLS Instructor Level 1",
    why: "체계적 보컬 트레이닝 자격으로 코칭 기준을 다집니다.",
  },
];

const typeStyle: Record<Item["type"], string> = {
  ASSOCIATION: "border-line bg-page text-navy-soft",
  WORKSHOP: "border-sky/50 bg-surface text-navy",
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
            학회·연수·출판을 바탕으로 코칭합니다. 확인된 자료부터 올려 두고,
            논문·영상은 공개 가능한 것을 추가로 연결합니다.
          </p>
        </div>

        <article className="card mt-12 overflow-hidden md:grid md:grid-cols-12">
          <div className="flex items-center justify-center bg-sky-muted px-6 py-8 md:col-span-4 md:px-8 md:py-10">
            <img
              src="/research/vocology-and-vocal.jpg"
              alt="도서 「발성학과 보컬」 Vocology and Vocal 표지"
              width={900}
              height={1200}
              className="mx-auto h-auto w-full max-w-[200px] object-contain object-center shadow-sm md:max-w-[220px]"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="flex flex-col justify-center p-6 md:col-span-8 md:p-10">
            <span className="inline-flex w-fit rounded-full border border-sky bg-sky-muted px-2.5 py-0.5 text-[0.6875rem] font-medium tracking-[0.1em] text-navy">
              BOOK
            </span>
            <h3 className="mt-4 text-2xl font-bold tracking-tight text-navy md:text-3xl">
              발성학과 보컬
            </h3>
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
              <h3 className="mt-4 text-xl font-bold leading-snug text-navy md:text-2xl">
                The Voice Foundation 한국챕터
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
                음성·발성 분야의 국제 네트워크와 국내 활동을 잇는 조직입니다.
                학제 간 연구와 교육을 통해 목소리에 대한 이해를 넓히는 일을
                함께합니다.
              </p>
            </div>
          </div>
        </article>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.title} className="card flex flex-col p-5 md:p-6">
              <span
                className={`inline-flex w-fit rounded-full border px-2.5 py-0.5 text-[0.6875rem] font-medium tracking-[0.1em] ${typeStyle[item.type]}`}
              >
                {item.type}
              </span>
              <h3 className="mt-4 text-base font-bold leading-snug text-navy">
                {item.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {item.why}
              </p>
            </li>
          ))}

          <li className="card flex flex-col border-dashed p-5 md:p-6">
            <span className="inline-flex w-fit rounded-full border border-line bg-sky-muted/40 px-2.5 py-0.5 text-[0.6875rem] font-medium tracking-[0.1em] text-muted">
              PAPER
            </span>
            <h3 className="mt-4 text-base font-bold leading-snug text-navy-soft">
              논문 · PDF
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              공개 가능한 논문·슬라이드가 준비되면 이 칸에 제목과 링크를
              올립니다.
            </p>
            <span
              className="mt-4 text-xs text-faint"
              aria-label="논문 링크는 추후 추가 예정"
            >
              링크 준비 중
            </span>
          </li>

          <li className="card flex flex-col border-dashed p-5 md:p-6 sm:col-span-2 lg:col-span-1">
            <span className="inline-flex w-fit rounded-full border border-line bg-sky-muted/40 px-2.5 py-0.5 text-[0.6875rem] font-medium tracking-[0.1em] text-muted">
              VIDEO
            </span>
            <h3 className="mt-4 text-base font-bold leading-snug text-navy-soft">
              강의 · 연수 영상
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              공개해도 되는 강의·워크숍 영상이 있으면 바로 연결합니다.
            </p>
            <span
              className="mt-4 text-xs text-faint"
              aria-label="영상 링크는 추후 추가 예정"
            >
              링크 준비 중
            </span>
          </li>
        </ul>

        <p className="section-note mt-6">
          논문 PDF·강의 영상 링크는 자료를 주시면 바로 올립니다. 확인되지 않은
          제목·DOI·URL은 올리지 않습니다.
        </p>
      </div>
    </section>
  );
}
