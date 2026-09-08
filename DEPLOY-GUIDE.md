# VoiSpeech 소스 배포 안내

## 포함된 기능

- VoiSpeech 홈페이지
- 온라인 발성훈련 데모 페이지
- `/account/` 회원 페이지
- Google OAuth를 사용하는 Supabase 클라이언트 코드
- 회원 프로필·구독 상태용 Supabase migration

## 로컬 실행

```bash
npm install
npm run dev
```

## 배포 전 환경변수

`.env.example`을 `.env.local`로 복사하고 값을 입력합니다.

```text
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

공개용 publishable key만 브라우저에 노출해야 합니다. `service_role` 키와 Google Client Secret은 저장소나 브라우저 코드에 넣지 않습니다.

## Supabase 설정

1. Supabase 프로젝트에서 `supabase/migrations/202609080001_membership.sql`을 SQL Editor 또는 migration 방식으로 적용합니다.
2. Google Cloud에서 Web application OAuth Client를 만듭니다.
3. Supabase Auth의 Google Provider에 Client ID와 Client Secret을 등록합니다.
4. Google OAuth의 Authorized JavaScript origin에 실제 배포 도메인을 등록합니다.
5. Google OAuth의 Authorized redirect URI에는 Supabase Google Provider 화면에 표시되는 callback URL을 등록합니다.
6. Supabase Auth URL 설정에 실제 사이트 URL과 `/account/` redirect URL을 등록합니다.

## 정적 배포

이 프로젝트는 `next.config.ts`에서 `output: "export"`를 사용합니다.

```bash
npm run build
```

빌드 결과는 `out/`에 생성됩니다. Vercel, Netlify, Cloudflare Pages 등에서 다음처럼 설정할 수 있습니다.

- Build command: `npm run build`
- Output directory: `out`

환경변수는 배포 서비스의 프로젝트 설정에도 같은 이름으로 등록해야 합니다. 환경변수를 바꾼 뒤에는 반드시 다시 빌드·배포합니다.

## 참고

현재 훈련관의 구독 버튼과 연습 기록은 데모 상태입니다. 실제 결제와 영구 저장을 연결하려면 결제 서버, webhook, 영상 보호용 서버 기능을 별도로 추가해야 합니다.
