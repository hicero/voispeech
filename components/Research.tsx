const items = [
  {
    type: "BOOK" as const,
    title: "「발성학과 보컬」",
    why: "발성학을 보컬 현장에 연결한 공동 집필·집필 참여 도서입니다.",
  },
  {
    type: "ASSOCIATION" as const,
    title: "The Voice Foundation 한국챕터",
    why: "음성·발성 분야의 국제 네트워크와 국내 활동을 잇는 조직입니다.",
  },
  {
    type: "ASSOCIATION" as const,
    title: "대한발성학회 · 한국발성교정학회",
    why: "학술대회와 학회 활동을 통해 발성교정 흐름을 꾸준히 따라갑니다.",
  },
  {
    type: "WORKSHOP" as const,
    title: "강남세브란스 · Yonsei Laser Voice Workshop",
    why: "병원·연수 기반 워크숍으로 임상과 코칭의 접점을 익힙니다.",
  },
  {
    type: "WORKSHOP" as const,
    title: "SLS Instructor Level 1",
    why: "체계적 보컬 트레이닝 자격으로 코칭 기준을 다집니다.",
  },
] as const;

const typeStyle: Record<(typeof items)[number]["type"], string> = {
  BOOK: "border-sky bg-sky-muted text-navy",
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
            학회·연수·출판을 바탕으로 코칭합니다. 아래에서 다루는 항목은
            코치 이력에 이미 공개된 사실만 모았습니다.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

          <li className="card flex flex-col border-dashed p-5 md:p-6">
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
