import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import Method from "@/components/Method";
import VoiceCheck from "@/components/VoiceCheck";
import Programs from "@/components/Programs";
import Coach from "@/components/Coach";
import ReportTeaser from "@/components/ReportTeaser";
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
        <Programs />
        <Coach />
        <ReportTeaser />
        <section id="online-training" className="section-pad online-teaser"><div className="mx-auto max-w-6xl px-5 md:px-8"><p className="eyebrow">VOISPEECH ONLINE · 서비스 예시</p><h2>수업과 수업 사이,<br/>내 목소리를 위한 연습.</h2><p>구독형 발성훈련 영상관을 미리 만나보세요.<br/>결제 체험부터 영상 시청, 구독 관리까지 둘러볼 수 있습니다.</p><a className="btn-primary" href="/training">온라인 훈련관 체험하기 ↗</a><small>실제 결제 없음 · 영상과 가격은 예시입니다.</small></div></section>
        <Booking />
        <FAQ />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
