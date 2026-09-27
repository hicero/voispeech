const areas = [
  {
    num: "01",
    name: "숨과 소리 연결",
    en: "Respiration–Phonation Coordination",
    desc: "소리가 편하게 시작되고 이어지는지 봅니다. 숨이 너무 새거나, 반대로 소리를 눌러 내지는 않는지도 확인합니다.",
  },
  {
    num: "02",
    name: "저음·고음 연결",
    en: "Vocal Fold Adjustment & Register Coordination",
    desc: "낮은 음에서 높은 음으로 자연스럽게 연결되는지 봅니다. 소리를 무겁게 끌어올리거나, 중간에서 갑자기 가볍게 뒤집히는 부분이 있는지도 확인합니다.",
  },
  {
    num: "03",
    name: "목·턱·혀의 힘",
    en: "Laryngeal Position & Extralaryngeal Coordination",
    desc: "음이 높아지거나 강해질 때 목·턱·혀에 불필요한 힘이 들어가는지 봅니다. 특정 음이나 모음에서만 힘이 증가하는지도 함께 확인합니다.",
  },
  {
    num: "04",
    name: "모음·울림 조절",
    en: "Vocal Tract & Resonance Coordination",
    desc: "모음이나 음높이가 달라져도 원하는 소리를 만들 수 있는지 봅니다. 밝은 소리, 둥근 소리처럼 다양한 톤을 만들고 노래에 활용할 수 있는지도 확인합니다.",
  },
  {
    num: "05",
    name: "소리 구별·재현",
    en: "Perception, Self-Monitoring & Motor Learning",
    desc: "달라진 소리를 스스로 구별하고 다시 만들어낼 수 있는지 봅니다. 수업에서 된 소리를 혼자 다시 만들고, 실제 노래까지 가져갈 수 있는지도 확인합니다.",
  },
];

export default function VoiceCheck() {
  return (
    <section id="voice-check" className="section-pad bg-surface">
      <div className="content-shell">
        <div className="voice-layout">
          <div className="voice-intro">
            <p className="eyebrow">5 VOICE CHECK</p>
            <h2>발성의 5가지 영역</h2>
            <p>
              잘 되고 있는 부분과 조정이 필요한 부분을
              <br className="hidden md:block" /> 함께 살펴, 연습의 우선순위를
              정합니다.
            </p>
          </div>

          <ol className="voice-rows">
            {areas.map((a) => (
              <li key={a.num}>
                <span className="voice-number">{a.num}</span>
                <div className="voice-copy">
                  <h3>{a.name}</h3>
                  <p className="voice-en">{a.en}</p>
                  <p>{a.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="section-note">
          5 VOICE CHECK는 의료적 진단을 위한 검사가 아니라, 음성학과 보컬
          트레이닝의 개념을 바탕으로 현재 발성 패턴과 연습 반응을 정리하는
          VoiSpeech의 코칭 프레임워크입니다.
        </p>

        <div className="voice-check-cta">
          <a href="#booking" className="btn-primary">
            원데이 클래스 예약 <span aria-hidden>↗</span>
          </a>
          <a href="#booking" className="hero-link">
            현재 목소리 확인하기
          </a>
        </div>
      </div>
    </section>
  );
}
