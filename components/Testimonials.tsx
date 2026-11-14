import { testimonials } from "./testimonials";

export default function Testimonials() {
  const cards = testimonials.map((item) => (
    <article key={item.id} className="review-card">
      <p className="review-card-label">샘플 후기 {item.id}</p>
      <p className="review-card-quote">{item.quote}</p>
    </article>
  ));

  return (
    <section
      id="testimonials"
      className="section-pad review-section"
      aria-label="샘플 후기"
    >
      <div className="content-shell">
        <div className="section-intro prose-col" data-reveal>
          <p className="eyebrow">SAMPLE</p>
          <h2>샘플 후기</h2>
          <p>실제 후기가 등록되기 전의 자리 표시입니다.</p>
        </div>

      <div className="review-viewport">
        <div className="review-track">
          <div className="review-set">{cards}</div>
          <div className="review-set" aria-hidden="true">
            {testimonials.map((item) => (
              <article key={`dup-${item.id}`} className="review-card">
                <p className="review-card-label">샘플 후기 {item.id}</p>
                <p className="review-card-quote">{item.quote}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
