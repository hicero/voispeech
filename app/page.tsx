import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import Method from "@/components/Method";
import VoiceCheck from "@/components/VoiceCheck";
import ReportTeaser from "@/components/ReportTeaser";
import Programs from "@/components/Programs";
import BeforeAfter from "@/components/BeforeAfter";
import Coach from "@/components/Coach";
import Research from "@/components/Research";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";
import Booking from "@/components/Booking";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <TrustStrip />
        <Method />
        <VoiceCheck />
        <ReportTeaser />
        <Programs />
        <BeforeAfter />
        <Coach />
        <Research />
        <section id="online-training" className="section-pad online-teaser">
          <div className="content-shell online-teaser-grid">
            <div className="online-teaser-copy">
              <p className="eyebrow">온라인 발성훈련 · 체험 운영 중</p>
              <h2>
                수업과 수업 사이,
                <br />
                내 목소리를 위한 연습.
              </h2>
              <p>
                발성 강의를 보고, 연습을 기록하고,
                <br />
                궁금한 점을 커뮤니티에서 나눠보세요.
              </p>
              <small>실제 결제 없음 · 영상과 가격은 예시입니다.</small>
            </div>
            <div className="online-teaser-action">
              <a className="btn-primary" href="/training">
                온라인 훈련 시작하기 ↗
              </a>
            </div>
          </div>
        </section>
        <Booking />
        <FAQ />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
