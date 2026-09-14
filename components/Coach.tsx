const coaches = [
  {
    id: "jae-woo",
    photo: "/coaches/jae-woo.jpg",
    photoAlt: "Jae Woo 재우 코치 프로필",
    nameEn: "JAE WOO",
    nameKo: "재우",
    role: "VOCAL DIRECTOR",
    tagline: "18년의 발성 연구, 한 사람의 목소리까지 정확하게 설계합니다.",
    affiliation: "The Voice Foundation 한국챕터 조직위원장 / 임시회장",
    career: [
      "VoiSpeech 대표",
      "Justin Vocal Studio & Find Your Voice 대표",
      "18년 경력 성악 전공 · 전 대한발성학회 이사",
      "홍대 실용음악학원 발성 메인 강사",
      "「발성학과 보컬」 저서 공동 집필",
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
    nameEn: "JAE HO",
    nameKo: "재호",
    role: "음성검사 파트",
    tagline:
      "임상과 학회, 무대를 잇는 발성교정의 흐름, 음성검사의 기준을 설계합니다.",
    affiliation: "김재호 발성교정소 대표 · 남스타보컬스튜디오 실장 · VoiSpeech 부대표",
    career: [
      "김재호 발성교정소 대표",
      "남스타보컬스튜디오 실장 · VoiSpeech 부대표",
      "전 대한발성학회(SKVA) 이사 · 발성교정협회 정회원",
      "서경대 실용음악과 졸업 · NDH발성교정아카데미 2기",
      "도서 「발성학과 보컬」 집필 참여 (2026)",
      "발성교정사 초·중·고급 과정 수료",
      "한양대 · 강남세브란스 · 분당제생 · 보아스이비인후과 실습",
      "스피치지도사 1급 · 음악심리상담사 1급",
    ],
    secondaryTitle: "연수 · 학회",
    secondaryNote: "연수 · 학술 활동",
    secondaryItems: [
      "강남세브란스 발성이론 워크숍",
      "IVA 한국 보컬 세미나",
      "제1~8회 한국발성교정학회 학술대회",
      "Rob Gray CLA International Webinar",
      "Yonsei Laser Voice Workshop",
      "4개 병원 연계 발성교정 실습 수료",
    ],
  },
] as const;

export default function Coach() {
  return (
    <section id="coach" className="section-pad bg-surface">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">COACH</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy md:text-4xl">
            함께하는 코치
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
            소리와 연습 과정을 함께 살펴보고,
            직접 시도할 수 있는 방법으로 풀어갑니다.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-8">
          {coaches.map((coach) => (
            <article key={coach.id} className="card overflow-hidden">
              <div className="coach-photo bg-sky-muted">
                <img
                  src={coach.photo}
                  alt={coach.photoAlt}
                  width={720}
                  height={900}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="border-b border-line-soft bg-sky-muted/50 px-5 py-5 md:px-6">
                <p className="eyebrow">{coach.role}</p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-navy">
                  {coach.nameEn}
                  <span className="ml-2 text-lg font-semibold text-navy-soft">
                    {coach.nameKo}
                  </span>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-navy-soft">
                  {coach.tagline}
                </p>
                <p className="mt-3 inline-flex rounded-md border border-line bg-surface px-2.5 py-1 text-xs leading-snug text-muted">
                  {coach.affiliation}
                </p>
              </div>

              <div className="px-5 py-5 md:px-6 md:py-6">
                <p className="text-[0.6875rem] font-medium tracking-[0.12em] text-muted">
                  주요 이력
                </p>
                <ul className="mt-3 space-y-2">
                  {coach.career.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-navy-soft"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-line-soft pt-5">
                  <p className="text-[0.6875rem] font-medium tracking-[0.12em] text-muted">
                    {coach.secondaryTitle}
                  </p>
                  <p className="mt-2">
                    <span className="inline-flex rounded-full border border-sky bg-sky-muted px-2.5 py-0.5 text-xs font-medium text-navy">
                      {coach.secondaryNote}
                    </span>
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-navy-soft">
                    {coach.secondaryItems.join(" · ")}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
