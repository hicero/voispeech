# 원데이 예약 연결

홈페이지 예약 섹션은 보이스피치 자체 예약페이지(`/booking/`, `public/booking/index.html`)로 연결되어 있습니다. 이 페이지는 작업실 서버의 원본 예약페이지와 같은 파일이며, Apps Script 백엔드(getSlots/book, 겹침 검사)를 직접 씁니다. Cal.com은 더 이상 연결되어 있지 않습니다. Cal.com 이벤트(https://cal.com/voispeech/60min)는 삭제하지 않고 그대로 두었습니다.

## 자체 예약페이지 규칙
- 수업 길이: 원데이 60분·30분 (페이지에서 선택)
- 예약 가능 시간: 9~22시, 일요일 휴무 (Apps Script 기준)
- 최소 사전 예약 시간: 24시간
- 시간대: Asia/Seoul
- 예약 전 확인 화면에서 레슨·일시·예약자·연락처·이메일·요청사항을 다시 확인한 뒤 확정
- 예약 성공 시 확인 메일 발송(Apps Script) + 대시보드에 새 예약 표시
- 작업실 서버의 카톡 알림(`/api/kakao`)은 이 공개 페이지에서는 동작하지 않습니다. 대시보드 새 예약 팝업으로 확인합니다.

## 원본과 공개본 동기화
원본은 작업실 서버 `/root/uploads/public/voicepitch_booking.html`에 있습니다. 원본을 고치면 `public/booking/index.html`에도 같은 내용을 반영해야 합니다. 단, 공개본에만 있는 차이가 2가지 있습니다. ① 로고는 Drive 링크가 아니라 페이지 안에 직접 박은 data URI(base64 PNG, 192×192)입니다(Drive uc 링크는 폰 브라우저에서 이미지가 바로 안 뜨는 경우가 있어 2026-11-27 교체 — GitHub 푸시 도구는 바이너리 파일을 못 올려서 data URI 방식을 씀). 로고를 바꾸려면 index.html 안의 data URI를 통째로 교체하세요. ② 임베드 모드(`?embed=1` + 부모에 높이 전달 postMessage)는 공개본에만 있습니다. 원본에는 없습니다.

## 홈페이지 연결
`components/siteConfig.ts`의 `bookingUrl`이 예약페이지 주소입니다. `components/Booking.tsx`는 예약 섹션 안에 `/booking/?embed=1`을 iframe으로 넣어, 팝업이나 다른 페이지로 나가지 않고 그 자리에서 예약 폼이 보이게 합니다. 높이는 예약페이지가 postMessage로 알려줘서 자동으로 맞춰집니다(기본 900px).

## 연결 후 실제 확인
본인이 통제하는 테스트 예약으로 시간 표시·겹침 차단·취소 시 시간 재개방·모바일 화면을 확인한 뒤 예약을 공개합니다.

공식 참고:
https://cal.com/help/embedding/embed-instructions
https://cal.com/apps/google-calendar
https://cal.com/pricing
