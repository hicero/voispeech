import type { CSSProperties } from "react";
import { REVIEWS, REVIEW_PLATFORMS } from "./testimonials";

function Stars({ value, label }: { value: number; label: string }) {
  return (
    <span className="review-stars" role="img" aria-label={label}>
      {"★".repeat(value)}
      {"☆".repeat(Math.max(0, 5 - value))}
    </span>
  );
}

export default function Testimonials() {
  const daangn = REVIEW_PLATFORMS.daangn;

  return (
    <section
      id="testimonials"
      className="section-pad review-section"
      aria-label="수강생 후기"
    >
      <div className="content-shell">
        <div className="section-intro prose-col" data-reveal>
          <p className="eyebrow">REVIEWS</p>
          <h2 className="line-rise">
            <span className="line-rise-item">
              <span className="line-rise-inner">수강생 후기</span>
            </span>
          </h2>
          <p>
            <img
              src={daangn.logo}
              alt="당근"
              className="review-intro-logo"
            />
            에 남겨진 실제 후기 {REVIEWS.length}개입니다. 모임 후기 22개,
            비즈프로필 후기 10개, 비즈프로필 평점 5.0.
          </p>
        </div>

        <div className="review-grid" data-reveal>
          {REVIEWS.map((review) => {
            const platform = REVIEW_PLATFORMS[review.platform];
            return (
              <article
                key={review.id}
                className="review-card"
                style={
                  { "--platform-color": platform.color } as CSSProperties
                }
              >
                <p className="review-card-source">
                  <img
                    src="/daangn-carrot.svg"
                    alt=""
                    aria-hidden="true"
                    className="review-platform-logo"
                  />
                  <span className="review-platform-name">
                    {platform.label}
                  </span>
                  <span className="review-source">{review.source}</span>
                  {review.rating ? (
                    <Stars
                      value={review.rating}
                      label={`별점 ${review.rating}점`}
                    />
                  ) : null}
                </p>
                {review.text ? (
                  <p className="review-card-quote">{review.text}</p>
                ) : null}
                <p className="review-card-meta">
                  {review.author} · {review.date}
                </p>
              </article>
            );
          })}
        </div>

        <p className="review-note">
          2026년 11월 당근에서 수집한 후기입니다. 비즈프로필 후기는 24개 중
          웹에서 볼 수 있는 10개만 실었고, 나머지 14개는 당근 앱에서만 볼 수
          있습니다.
        </p>
      </div>
    </section>
  );
}
