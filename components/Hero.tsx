import ArrowUpRight from "lucide-react/icons/arrow-up-right";
import UiIcon from "./UiIcon";
import ArcGraphic from "./ArcGraphic";

export default function Hero() {
  return (
    <>
      <div id="top" className="scroll-top-anchor" tabIndex={-1} />
      <section className="hero-section">
        <div className="hero-stick">
          <div className="hero-grid content-shell">
            <div className="hero-copy" data-reveal>
              <div className="hero-copy-pin">
                <p className="eyebrow">VOISPEECH · VOCAL COACHING</p>
                <h1>
                  내 발성이
                  <br />
                  어려운 이유부터,
                  <br />
                  <span className="phrase-mark">연습의 방향까지.</span>
                </h1>
                <p className="hero-description">
                  현재 목소리를 먼저 확인하고,
                  <br className="hidden sm:block" /> 어떤 조건에서 소리가 달라지는지 본 뒤,
                  <br className="hidden sm:block" /> 필요한 연습 방향을 찾는 곳입니다.
                </p>
                <div className="hero-actions">
                  <a href="#booking" className="btn-primary">
                    원데이 클래스 예약 <UiIcon icon={ArrowUpRight} />
                  </a>
                  <a href="/training/" className="hero-link">
                    온라인 훈련 둘러보기
                  </a>
                </div>
                <p className="hero-meta">
                  1:1 발성 코칭 <span>/</span> 5 VOICE CHECK <span>/</span> 개인 코칭
                  리포트
                </p>
              </div>
            </div>
            <div className="hero-cover-slot">
              <div
                className="hero-cover"
                data-reveal
                data-delay="2"
                aria-label="보이스피치 코칭 소개"
              >
                <div className="cover-top">
                  <span>VoiSpeech</span>
                  <span>VOICE · PRACTICE · YOU</span>
                </div>
                <p className="cover-title">
                  나의 목소리를
                  <br />
                  알아가는 시간.
                </p>
                <ArcGraphic className="cover-arc" />
                <div className="cover-bottom">
                  <p>
                    듣고, 살펴보고,
                    <br />
                    직접 바꿔보는 발성 수업.
                  </p>
                  <span>
                    VOCAL
                    <br />
                    COACHING STUDIO
                  </span>
                </div>
                <p className="hero-cover-end" aria-hidden="true">
                  나의 목소리를
                  <br />
                  알아가는 시간.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
