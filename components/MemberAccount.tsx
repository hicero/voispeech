'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import { getMemberClient } from '@/lib/member-client';
import { fetchMembership, isSubscriptionActive, type Membership } from '@/lib/membership';

export default function MemberAccount() {
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [message, setMessage] = useState('로그인 상태를 확인하고 있습니다.');

  useEffect(() => {
    const client = getMemberClient();
    if (!client) {
      setBusy(false);
      setMessage('회원가입·로그인을 준비하고 있습니다. 연결이 완료되면 이용할 수 있어요.');
      return;
    }
    setReady(true);
    let mounted = true;
    let revision = 0;
    async function refresh() {
      const request = ++revision;
      const { data, error } = await client!.auth.getUser();
      if (!mounted || request !== revision) return;
      setUser(error ? null : data.user);
      setMembership(null);
      if (error || !data.user) {
        const params = new URLSearchParams(window.location.search);
        setMessage(params.has('error') ? '로그인이 완료되지 않았습니다. 다시 시도해 주세요.' : '구글 계정으로 가입하고 로그인하세요.');
        setBusy(false);
        return;
      }
      const row = await fetchMembership(client!, data.user.id);
      if (!mounted || request !== revision) return;
      setMembership(row);
      setMessage(row ? '로그인되었습니다.' : '로그인되었습니다. 구독 정보를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.');
      setBusy(false);
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    const { data: listener } = client.auth.onAuthStateChange(() => {
      clearTimeout(timer);
      timer = setTimeout(() => { void refresh(); }, 0);
    });
    void refresh();
    return () => { mounted = false; revision++; clearTimeout(timer); listener.subscription.unsubscribe(); };
  }, []);

  async function signIn() {
    const client = getMemberClient();
    if (!client) return;
    setBusy(true);
    setMessage('구글 로그인 화면으로 이동합니다.');
    try {
      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/account/` },
      });
      if (error) throw error;
    } catch {
      setMessage('로그인 화면을 열지 못했습니다. 잠시 후 다시 시도해 주세요.');
      setBusy(false);
    }
  }

  async function signOut() {
    const client = getMemberClient();
    if (!client) return;
    setBusy(true);
    try {
      const { error } = await client.auth.signOut();
      if (error) throw error;
      setUser(null);
      setMembership(null);
      setMessage('로그아웃되었습니다.');
    } catch {
      setMessage('로그아웃하지 못했습니다. 다시 시도해 주세요.');
    } finally { setBusy(false); }
  }

  const statusLabels: Record<string, string> = {
    inactive: '구독 전',
    active: '구독 중',
    past_due: '결제 확인 필요',
    expired: '이용기간 만료',
    revoked: '이용 종료',
  };
  const active = isSubscriptionActive(membership);
  const end = membership?.current_period_end ? new Date(membership.current_period_end) : null;
  const expired = membership?.status === 'active' && end && end.getTime() <= Date.now();

  return (
    <section className="member-card" aria-labelledby="member-heading">
      <p className="eyebrow">VOISPEECH ACCOUNT</p>
      <h1 id="member-heading">{user ? '나의 회원 정보' : '내 목소리의 연습을 이어가세요.'}</h1>
      <p role="status" aria-live="polite">{message}</p>
      {user ? (
        <>
          <dl>
            <dt>이메일</dt>
            <dd>{user.email || '이메일 정보 없음'}</dd>
            <dt>구독 상태</dt>
            <dd>{membership ? (expired ? '이용기간 만료' : statusLabels[membership.status] || '확인 필요') : '조회 필요'}</dd>
            {end && !Number.isNaN(end.getTime()) && (
              <>
                <dt>이용기간 종료</dt>
                <dd>{end.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })} (한국 시간)</dd>
              </>
            )}
            {membership?.cancel_at_period_end && (
              <>
                <dt>자동 갱신</dt>
                <dd>해지 예약됨</dd>
              </>
            )}
          </dl>
          <div className="member-actions">
            <Link className="btn-primary member-cta" href="/training/">온라인 훈련관 열기</Link>
            <button className="btn-outline member-logout" disabled={busy} onClick={signOut}>로그아웃</button>
          </div>
          <p className="member-access-note">
            {active
              ? '구독이 활성화되어 전용 영상 라이브러리가 열려 있습니다.'
              : '전체 라이브러리는 구독이 필요합니다. 구독은 운영자가 등록한 뒤 이용할 수 있습니다.'}
          </p>
        </>
      ) : (
        <button className="member-google" disabled={!ready || busy} onClick={signIn}>
          {!ready && !busy ? '구글 로그인 준비 중' : 'Google로 계속하기'}
        </button>
      )}
      <p className="member-note">
        훈련관의 연습 기록·즐겨찾기는 이 브라우저 화면 예시이며, 실제 회원 구독 상태는 이 계정 화면의 정보를 따릅니다.
      </p>
      <Link className="member-home-link" href="/">← 홈으로</Link>
    </section>
  );
}
