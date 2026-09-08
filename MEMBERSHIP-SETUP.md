# 회원 기능: 첫 단계

상태: Supabase 연결 대기. migration은 준비했지만 실제 DB에 적용하지 않았다.
현재 배포본은 체험 로그인 상태. 이번 코드에서는 훈련관의 체험 로그인 버튼을 /account/ 회원 화면 링크로 교체했다. 아직 재배포하지 않았다.

## 인증 경로

일반 수강생 대상의 회원 서비스이므로 ChatGPT 로그인으로 대체하지 않는다.
현재 Sites 인증 가이드는 외부 인증 도입 전에 플랫폼 인증 경로를 확인하도록 요구한다.
Supabase 프로젝트 연결 후 프로젝트 설정, 외부 인증 리디렉션과 배포 환경의 호환성을 확인하고 구현한다.
확인 전에는 로그인 화면만 바꿔서 회원 기능이 작동한다고 표시하지 않는다.

## 준비한 데이터 구조

- Supabase Auth: 사용자 ID, 이메일, Google 인증/세션 관리
- voispeech_profiles: 회원 표시 이름, 가입일
- voispeech_subscriptions: 비구독/이용중/결제 지연/만료/권한 회수 상태, 이용기간, 갱신 해지 여부
- 새 회원은 inactive로 생성한다. 체험 구독 버튼으로 실제 권한을 변경할 수 없다.
- 회원은 자신의 정보만 읽고 표시 이름만 변경한다.
- 구독 상태는 신뢰할 수 있는 서버에서만 변경한다.
- 영상 권한은 서버에서 인증과 기간을 함께 검증한다. 준비한 권한 함수만으로 영상 보호가 완성되는 것은 아니다.

## 연결 후 수행할 작업

1. 보이스피치 전용 프로젝트를 확인한다. 기존 DB가 있으면 충돌·기존 회원을 먼저 확인한다.
2. migration 적용과 RLS 검증: 비회원 접근 거부, 다른 회원 조회 거부, 구독 임의 수정 거부.
3. Google 로그인을 연결한다. /account/ 페이지와 PKCE 기반 Supabase 클라이언트를 준비했다.
4. 회원 화면에서 서버의 실제 구독 상태를 조회한다. 결제 미연동 상태에는 구매 성공을 표시하지 않는다.
5. Google OAuth 대상 사용자·동의 화면·사이트/리디렉션 URL을 확인한다.
6. Google 로그인·취소·재로그인·새로고침·로그아웃·만료 세션을 실제 프로젝트로 검증한다.
7. 같은 Site에 배포하고 실제 완료 범위를 보고한다.

## 출처

- https://supabase.com/docs/guides/auth
- https://supabase.com/docs/guides/database/postgres/row-level-security

시크릿 키나 service_role 키를 채팅·브라우저 코드에 넣지 않는다.

## Google 로그인 연결 설정 (2026-09-08)

- 실제 Supabase 프로젝트 연결과 DB migration 적용은 아직 안 됨. 플러그인 검색 결과 미설치.
- 사이트 조회 결과 현재 소유자 전용(custom), public 전환 기능은 제공됨. 접근 정책 변경은 아직 안 함.
- 회원 화면은 공개 URL/공개 publishable key가 없으면 비활성 상태. 비밀 키를 사용하지 않음.
- 클라이언트는 Google OAuth + PKCE, 세션 복원/갱신, getUser 검증, 본인 구독 조회, 로그아웃을 구현함.
- 실제 권한 판정은 Supabase RLS 및 후속 영상 서버에서 수행. 브라우저에 표시하는 상태로 유료 영상을 보호하지 않음.
- 기존 구독 체험은 테스트 영상만 열며 실제 구독 테이블을 수정하지 않음. 연습 기록 영구 저장은 미구현.

### 관리자가 설정할 값

1. Google Auth Platform에서 Web application OAuth client 생성. 기본 openid/email/profile 범위만 사용.
2. Authorized JavaScript origins: https://voispeech.ppottta.chatgpt.site
3. Authorized redirect URIs: 선택한 Supabase Google provider 화면에 표시된 callback URL을 그대로 복사.
4. Google Client ID/Client Secret은 Supabase Google provider 설정에 등록. 클라이언트 코드에 넣지 않음.
5. Supabase Site URL: https://voispeech.ppottta.chatgpt.site
6. Supabase Redirect URLs: https://voispeech.ppottta.chatgpt.site/account/
7. NEXT_PUBLIC_SUPABASE_URL 및 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 설정 후 재빌드. static export이므로 런타임 환경변수만 변경해서는 적용되지 않음.
8. 소유자 계정으로 먼저 OAuth 왕복 확인. 실제 수강생 테스트 전 사이트 공개 전환, Google 테스트 사용자/게시 상태 확인.

공식 문서: https://supabase.com/docs/guides/auth/social-login/auth-google
