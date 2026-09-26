// 확인된 공식 상담 URL을 입력하면 상담 버튼이 활성화됩니다.
// 예시 주소나 확인되지 않은 연락처는 넣지 마세요.
export const contactUrl: string = "";

// 본인 Cal.com에서 만든 원데이 이벤트의 HTTPS 예약 URL. 연결 전에는 비워 둡니다.
// Cal.com에서 50분, 종료 후 버퍼 10분, 시작 간격 60분, 최소 사전 예약 24시간을 설정하세요.
export const bookingUrl: string = "https://cal.com/voispeech/60min";

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
