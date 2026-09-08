import ArcGraphic from "./ArcGraphic";
export default function Hero() {
  return <section id="top" className="hero-section">
    <div className="hero-grid mx-auto max-w-6xl px-5 md:px-8">
      <div className="hero-copy">
        <p className="eyebrow">VOISPEECH · VOCAL COACHING</p>
        <h1>내 발성의<br/>어려움부터,<br/><span>연습의 방향까지.</span></h1>
        <p className="hero-description">고음에서 막히는 순간, 쉽게 힘이 들어가는 소리.<br className="hidden sm:block"/> 지금의 발성을 함께 살펴보고<br className="hidden sm:block"/> 나에게 필요한 연습을 찾아갑니다.</p>
        <div className="hero-actions"><a href="#booking" className="btn-primary">원데이 레슨 예약 <span aria-hidden>↗</span></a><a href="/training/" className="hero-link">온라인 훈련 둘러보기</a></div>
        <p className="hero-meta">1:1 발성 코칭 <span>/</span> 5 VOICE CHECK <span>/</span> 개인 코칭 리포트</p>
      </div>
      <div className="hero-cover" aria-label="보이스피치 코칭 소개">
        <div className="cover-top"><span>VoiSpeech</span><span>VOICE · PRACTICE · YOU</span></div>
        <p className="cover-title">나의 목소리를<br/>알아가는 시간.</p>
        <ArcGraphic className="cover-arc"/>
        <div className="cover-bottom"><p>듣고, 살펴보고,<br/>직접 바꿔보는 발성 수업.</p><span>VOCAL<br/>COACHING STUDIO</span></div>
      </div>
    </div>
  </section>;
}
