/**
 * Toss Payments — merchant inquiry complete; real checkout not wired yet.
 *
 * Later (server-only secret; never ship secret to the static client):
 *   NEXT_PUBLIC_TOSS_CLIENT_KEY=...   // browser widget / SDK
 *   TOSS_SECRET_KEY=...               // server approve / billing only
 *
 * Do not implement real Toss checkout until billing keys and order APIs
 * live behind a trusted backend. See PAYMENTS-ROLLOUT.md.
 */
export const TOSS_STATUS = {
  inquiryDone: true,
  checkoutReady: false,
  bannerKo: '토스페이먼츠 도입문의 완료 · 실결제 연동 대기',
} as const;

export function getTossClientKey(): string | null {
  if (typeof process === 'undefined') return null;
  const key = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
  return key && key.length > 0 ? key : null;
}
