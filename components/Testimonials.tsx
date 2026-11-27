import type { CSSProperties } from "react";
import Marquee from "./magicui/marquee";
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
  // 사용자 지시: 옆으로 흐르는 마퀴 카드로 표시, 소개 문구 삭제,
  // 날짜 표시 삭제, 개별 카드에 전부 별 5개 표시.
  // (모임 후기는 당근에 별점이 없지만 카드에는 5개로 통일.)
  const cards = REVIEWS.map((review) => {
    const platform = REVIEW_PLATFORMS[review.platform];
    return (
      <article
        key={review.id}
        className="review-card"
        style={{ "--platform-color": platform.color } as CSSProperties}
      >
        <p className="review-card-source">
          <img
            src="/daangn-carrot.svg"
            alt=""
            aria-hidden="true"
            className="review-platform-logo"
          />
          <span className="review-platform-name">{platform.label}</span>
          <span className="review-source">{review.source}</span>
          <Stars value={5} label="별점 5점" />
        </p>
        {review.text ? (
          <p className="review-card-quote">{review.text}</p>
        ) : null}
        <p className="review-card-meta">{review.author}</p>
      </article>
    );
  });

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
        </div>

        <div className="review-viewport">
          <Marquee pauseOnHover className="review-marquee" repeat={2}>
            {cards}
          </Marquee>
        </div>

        <p className="review-note">
          2026년 11월 당근에서 수집한 후기입니다. FindYourVoice 비즈프로필
          후기는 24개 중 웹에서 볼 수 있는 10개만 실었고, 나머지 14개는 당근
          앱에서만 볼 수 있습니다. 보이스피치 비즈프로필 후기 2개는 전부
          실었습니다.
        </p>
      </div>
    </section>
  );
}
