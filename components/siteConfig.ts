// 확인된 공식 상담 URL을 입력하면 상담 버튼이 활성화됩니다.
// 예시 주소나 확인되지 않은 연락처는 넣지 마세요.
export const contactUrl: string = "";

// 보이스피치 자체 예약페이지 (이 사이트의 /booking/ 공개 페이지).
// 작업실 서버 로그인 뒤에 있는 원본 예약페이지와 같은 파일이며,
// Apps Script 백엔드(getSlots/book)를 직접 쓴다. Cal.com은 더 이상 쓰지 않는다.
export const bookingUrl: string = "https://voispeech.vercel.app/booking/";

// 원데이 클래스가 열려 있는 외부 플랫폼. URL을 넣으면 링크가 활성화됩니다.
export const onedayPlatforms: { name: string; url: string }[] = [
  { name: "프립", url: "" },
  { name: "솜씨당", url: "" },
  { name: "당근", url: "" },
];

export function isHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && Boolean(url.hostname);
  } catch {
    return false;
  }
}
