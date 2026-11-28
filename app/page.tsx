import dynamic from "next/dynamic";
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
import ContactForm from "@/components/ContactForm";
import Booking from "@/components/Booking";
import Footer from "@/components/Footer";

const Testimonials = dynamic(() => import("@/components/Testimonials"));
const FAQ = dynamic(() => import("@/components/FAQ"));

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <TrustStrip />
        <Method />
        <Programs />
        <Testimonials />
        <Coach />
        <Booking />
        <VoiceCheck />
        <ReportTeaser />
        <BeforeAfter />
        <Research />
        <section id="online-training" className="section-pad online-teaser">
          <div className="content-shell online-teaser-grid" data-reveal>
            <div className="online-teaser-copy">
              <p className="eyebrow">온라인 발성훈련 · 체험 운영 중</p>
              <h2 className="line-rise">
                <span className="line-rise-item">
                  <span className="line-rise-inner">수업과 수업 사이,</span>
                </span>
                <span className="line-rise-item">
                  <span className="line-rise-inner">내 목소리를 위한 연습.</span>
                </span>
              </h2>
              <p>
                발성 강의를 보고 연습을 기록하세요.
                <br />
                궁금한 점은 커뮤니티에서 나누면 됩니다.
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
        <FAQ />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
