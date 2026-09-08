'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import { getMemberClient } from '@/lib/member-client';
import {
  cancelPreviewRenewal,
  clearLoginReturn,
  clearMembershipSnapshot,
  expirePreviewMembership,
  fetchMembership,
  isSubscriptionActive,
  loadLoginReturn,
  markMembershipHandoff,
  saveMembershipSnapshot,
  startPreviewMembership,
  type Membership,
} from '@/lib/membership';
import { isVoiSpeechAdmin } from '@/lib/admin';

export default function MemberAccount() {
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [message, setMessage] = useState('로그인 상태를 확인하고 있습니다.');
  const [loginIntent, setLoginIntent] = useState<string | null>(null);

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
      if (error || !data.user) {
        const params = new URLSearchParams(window.location.search);
        setMembership(null);
        setMessage(params.has('error') ? '로그인이 완료되지 않았습니다. 다시 시도해 주세요.' : '구글 계정으로 가입하고 로그인하세요.');
        setBusy(false);
        return;
      }
      const returned = loadLoginReturn();
      if (returned.intent) setLoginIntent(returned.intent);
      let row: Membership | null = null;
      try {
        row = await fetchMembership(client!, data.user.id);
      } catch {
        row = null;
      }
      if (!mounted || request !== revision) return;
      setMembership(row);
      if (row) saveMembershipSnapshot(row);
      if (returned.next === '/training/' && returned.intent === 'subscribe' && !isSubscriptionActive(row)) {
        setMessage('로그인되었습니다. 아래에서 구독 체험을 시작한 뒤 온라인 훈련관으로 돌아가 주세요.');
      } else if (isSubscriptionActive(row) && returned.next === '/training/') {
        setMessage('로그인되었습니다. 구독이 활성화되어 있습니다. 온라인 훈련관을 열어 주세요.');
      } else {
        setMessage(row ? '로그인되었습니다.' : '로그인되었습니다. 구독 정보를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.');
      }
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
      clearMembershipSnapshot();
      clearLoginReturn();
      setUser(null);
      setMembership(null);
      setLoginIntent(null);
      setMessage('로그아웃되었습니다.');
    } catch {
      setMessage('로그아웃하지 못했습니다. 다시 시도해 주세요.');
    } finally { setBusy(false); }
  }

  async function runPreview(
    action: 'start' | 'cancel' | 'expire',
  ) {
    const client = getMemberClient();
    if (!client || !user) return;
    setBusy(true);
    try {
      const row =
        action === 'start'
          ? await startPreviewMembership(client)
          : action === 'cancel'
            ? await cancelPreviewRenewal(client)
            : await expirePreviewMembership(client);
      setMembership(row);
      if (action === 'start') {
        markMembershipHandoff(row);
        const returned = loadLoginReturn();
        if (returned.next === '/training/') {
          setMessage('결제 없이 구독 체험이 시작되었습니다. 온라인 훈련관으로 이동합니다.');
          clearLoginReturn();
          window.location.assign('/training/');
          return;
        }
        setMessage('결제 없이 구독 체험이 시작되었습니다. 30일간 전용 영상을 열 수 있습니다.');
      } else {
        saveMembershipSnapshot(row, { force: true });
        setMessage(
          action === 'cancel'
            ? '자동 갱신 해지를 체험했습니다. 이용기간 동안 영상은 계속 열려 있습니다.'
            : '이용기간 만료를 체험했습니다. 전용 영상이 다시 잠겼습니다.',
        );
      }
    } catch {
      setMessage('구독 체험 상태를 바꾸지 못했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setBusy(false);
    }
  }

  function openTraining(e: MouseEvent<HTMLAnchorElement>) {
    if (membership && (isSubscriptionActive(membership) || membership.status === 'active')) {
      e.preventDefault();
      markMembershipHandoff(membership);
      clearLoginReturn();
      window.location.assign('/training/');
    }
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
            <a className="btn-primary member-cta" href="/training/" onClick={openTraining}>온라인 훈련관 열기</a>
            {isVoiSpeechAdmin(user) ? (
              <Link className="btn-outline member-cta" href="/admin/">운영자 구독 관리</Link>
            ) : null}
            {!active ? (
              <button
                type="button"
                className="btn-outline"
                disabled={busy}
                onClick={() => { void runPreview('start'); }}
              >
                {loginIntent === 'subscribe' ? '구독 체험 시작' : '결제 없이 구독 체험 시작'}
              </button>
            ) : null}
            <button className="btn-outline member-logout" disabled={busy} onClick={signOut}>로그아웃</button>
          </div>
          {active ? (
            <div className="member-actions" style={{ marginTop: '0.75rem' }}>
              <p className="member-access-note" style={{ margin: 0, flex: '1 1 100%' }}>
                구독이 활성화되어 전용 영상 라이브러리가 열려 있습니다.
              </p>
              {!membership?.cancel_at_period_end ? (
                <button
                  type="button"
                  className="btn-outline"
                  disabled={busy}
                  onClick={() => { void runPreview('cancel'); }}
                >
                  자동 갱신 해지 체험
                </button>
              ) : null}
              <button
                type="button"
                className="btn-outline"
                disabled={busy}
                onClick={() => { void runPreview('expire'); }}
              >
                이용기간 만료 체험
              </button>
            </div>
          ) : (
            <p className="member-access-note">
              전체 라이브러리는 구독이 필요합니다. 훈련관에서 잠긴 영상을 열거나 위 버튼으로 결제 없이 구독 체험을 시작할 수 있습니다.
            </p>
          )}
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
