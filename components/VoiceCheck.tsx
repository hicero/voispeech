import ArrowUpRight from "lucide-react/icons/arrow-up-right";
import UiIcon from "./UiIcon";

const areas = [
  {
    num: "01",
    name: "숨과 소리 연결",
    en: "Respiration–Phonation Coordination",
    desc: "소리가 편하게 시작돼서 이어지는지 확인합니다.",
  },
  {
    num: "02",
    name: "저음·고음 연결",
    en: "Vocal Fold Adjustment & Register Coordination",
    desc: "낮은 음에서 높은 음으로 자연스럽게 이어지는지 확인합니다.",
  },
  {
    num: "03",
    name: "목·턱·혀의 힘",
    en: "Laryngeal Position & Extralaryngeal Coordination",
    desc: "음이 높아지거나 세질 때 목, 턱, 혀에 불필요한 힘이 들어가는지 살펴봅니다.",
  },
  {
    num: "04",
    name: "모음·울림 조절",
    en: "Vocal Tract & Resonance Coordination",
    desc: "모음이나 음높이가 달라져도 원하는 소리를 만들 수 있는지 확인합니다.",
  },
  {
    num: "05",
    name: "소리 구별·재현",
    en: "Perception, Self-Monitoring & Motor Learning",
    desc: "달라진 소리를 스스로 구별하고 다시 만들 수 있는지 살펴봅니다.",
  },
];

export default function VoiceCheck() {
  return (
    <section id="voice-check" className="section-pad bg-surface">
      <div className="content-shell">
        <div className="voice-layout">
          <div className="voice-intro" data-reveal>
            <p className="eyebrow">5 VOICE CHECK</p>
            <h2 className="line-rise">
              <span className="line-rise-item">
                <span className="line-rise-inner">발성의 5가지 영역</span>
              </span>
            </h2>
            <p>
              잘 되는 부분과 조정이 필요한 부분을 보고,{' '}
              <span className="phrase-mark">연습 순서</span>를 정합니다.
            </p>
          </div>

          <ol className="voice-rows" data-reveal>
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
          5 VOICE CHECK는 의료적 진단 검사가 아닙니다. 음성학과 보컬 트레이닝
          개념으로 지금 발성 패턴과 연습 반응을 정리하는 VoiSpeech 코칭
          틀입니다.
        </p>

        <div className="voice-check-cta">
          <a href="#booking" className="btn-primary">
            원데이 클래스 예약 <UiIcon icon={ArrowUpRight} />
          </a>
          <a href="#booking" className="hero-link">
            현재 목소리 확인하기
          </a>
        </div>
      </div>
    </section>
  );
}
