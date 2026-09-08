'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import { getMemberClient } from '@/lib/member-client';
import {
  adminListMembers,
  adminSetSubscription,
  isVoiSpeechAdmin,
  type AdminMemberRow,
} from '@/lib/admin';

const STATUS_LABELS: Record<string, string> = {
  inactive: '구독 전',
  active: '구독 중',
  past_due: '결제 확인 필요',
  expired: '만료',
  revoked: '이용종료',
};

function formatSeoul(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
}

export default function AdminConsole() {
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(true);
  const [actionBusy, setActionBusy] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [members, setMembers] = useState<AdminMemberRow[]>([]);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('로그인 상태를 확인하고 있습니다.');

  const admin = isVoiSpeechAdmin(user);

  const loadMembers = useCallback(async () => {
    const client = getMemberClient();
    if (!client) return;
    const rows = await adminListMembers(client);
    setMembers(rows);
  }, []);

  useEffect(() => {
    const client = getMemberClient();
    if (!client) {
      setBusy(false);
      setMessage('관리 콘솔 연결을 준비하고 있습니다. 연결이 완료되면 이용할 수 있어요.');
      return;
    }
    setReady(true);
    let mounted = true;
    let revision = 0;

    async function refresh() {
      const request = ++revision;
      const { data, error } = await client!.auth.getUser();
      if (!mounted || request !== revision) return;
      const nextUser = error ? null : data.user;
      setUser(nextUser);

      if (error || !nextUser) {
        setMembers([]);
        setMessage('운영자 계정으로 Google 로그인해 주세요.');
        setBusy(false);
        return;
      }

      if (!isVoiSpeechAdmin(nextUser)) {
        setMembers([]);
        setMessage(
          '접근 불가: 운영자 권한이 없습니다. 관리자 플래그를 반영하려면 로그아웃 후 다시 로그인해 JWT를 갱신하세요.',
        );
        setBusy(false);
        return;
      }

      try {
        await loadMembers();
        if (!mounted || request !== revision) return;
        setMessage('회원 구독 목록을 불러왔습니다.');
      } catch {
        if (!mounted || request !== revision) return;
        setMembers([]);
        setMessage('회원 목록을 불러오지 못했습니다. 권한·재로그인 후 다시 시도해 주세요.');
      } finally {
        if (mounted && request === revision) setBusy(false);
      }
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    const { data: listener } = client.auth.onAuthStateChange(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        void refresh();
      }, 0);
    });
    void refresh();
    return () => {
      mounted = false;
      revision++;
      clearTimeout(timer);
      listener.subscription.unsubscribe();
    };
  }, [loadMembers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) => {
      const hay = `${m.email} ${m.display_name} ${m.status} ${m.user_id}`.toLowerCase();
      return hay.includes(q);
    });
  }, [members, query]);

  async function signIn() {
    const client = getMemberClient();
    if (!client) return;
    setBusy(true);
    setMessage('구글 로그인 화면으로 이동합니다.');
    try {
      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/admin/` },
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
      setMembers([]);
      setMessage('로그아웃되었습니다.');
    } catch {
      setMessage('로그아웃하지 못했습니다. 다시 시도해 주세요.');
    } finally {
      setBusy(false);
    }
  }

  async function refreshList() {
    setActionBusy(true);
    try {
      await loadMembers();
      setMessage('목록을 새로고침했습니다.');
    } catch {
      setMessage('새로고침에 실패했습니다. 재로그인 후 다시 시도해 주세요.');
    } finally {
      setActionBusy(false);
    }
  }

  async function setStatus(userId: string, status: string, periodDays?: number) {
    const client = getMemberClient();
    if (!client) return;
    setActionBusy(true);
    try {
      await adminSetSubscription(client, userId, status, periodDays);
      await loadMembers();
      setMessage(
        status === 'active'
          ? '구독을 30일 활성으로 설정했습니다.'
          : `상태를 ${STATUS_LABELS[status] || status}(으)로 변경했습니다.`,
      );
    } catch {
      setMessage('구독 상태를 변경하지 못했습니다. 권한·재로그인 후 다시 시도해 주세요.');
    } finally {
      setActionBusy(false);
    }
  }

  return (
    <section className="member-card admin-card" aria-labelledby="admin-heading">
      <p className="eyebrow">VOISPEECH ADMIN</p>
      <h1 id="admin-heading">운영자 구독 관리</h1>
      <p role="status" aria-live="polite">
        {message}
      </p>

      {!user ? (
        <>
          <button className="member-google" disabled={!ready || busy} onClick={signIn}>
            {!ready && !busy ? '구글 로그인 준비 중' : 'Google로 계속하기'}
          </button>
          <p className="member-note">
            관리자 플래그(app_metadata.voispeech_admin)를 반영하려면 설정 후 반드시 다시 로그인하세요.
          </p>
          <Link className="member-home-link" href="/account/">
            ← 회원 계정
          </Link>
        </>
      ) : !admin ? (
        <>
          <p className="member-access-note">
            접근 불가입니다. 이 계정에는 운영자 권한이 없습니다. 관리자 플래그를 방금 부여했다면 로그아웃 로그아웃 후 다시
            로그인해 JWT를 갱신해 주세요.
          </p>
          <div className="member-actions">
            <Link className="btn-outline member-cta" href="/account/">
              회원 계정
            </Link>
            <Link className="btn-outline member-cta" href="/">
              홈
            </Link>
            <button className="btn-outline member-logout" disabled={busy} onClick={signOut}>
              로그아웃
            </button>
          </div>
        </>
      ) : (
        <>
          <dl>
            <dt>운영자</dt>
            <dd>{user.email || '이메일 정보 없음'}</dd>
            <dt>회원 수</dt>
            <dd>
              {filtered.length}
              {query.trim() ? ` / ${members.length}` : ''}명
            </dd>
          </dl>

          <div className="admin-toolbar">
            <label className="admin-search">
              <span>검색</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="이메일 · 이름 · 상태"
                disabled={busy || actionBusy}
              />
            </label>
            <button
              type="button"
              className="btn-outline"
              disabled={busy || actionBusy}
              onClick={() => {
                void refreshList();
              }}
            >
              새로고침
            </button>
            <button className="btn-outline member-logout" disabled={busy || actionBusy} onClick={signOut}>
              로그아웃
            </button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">회원</th>
                  <th scope="col">상태 · 기간</th>
                  <th scope="col">관리</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={3}>{busy ? '불러오는 중…' : '표시할 회원이 없습니다.'}</td>
                  </tr>
                ) : (
                  filtered.map((m) => (
                    <tr key={m.user_id}>
                      <td>
                        <div className="admin-member-email">{m.email || '(이메일 없음)'}</div>
                        {m.display_name ? (
                          <div className="admin-member-name">{m.display_name}</div>
                        ) : null}
                        <div className="admin-member-id">{m.user_id}</div>
                      </td>
                      <td>
                        <div>
                          <strong>{STATUS_LABELS[m.status] || m.status}</strong>
                          {m.cancel_at_period_end ? ' · 갱신 해지 예약' : ''}
                        </div>
                        <div className="admin-period">
                          시작 {formatSeoul(m.current_period_start)}
                          <br />
                          종료 {formatSeoul(m.current_period_end)}
                        </div>
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <button
                            type="button"
                            className="btn-primary admin-action"
                            disabled={busy || actionBusy}
                            onClick={() => {
                              void setStatus(m.user_id, 'active', 30);
                            }}
                          >
                            구독 활성(30일)
                          </button>
                          <button
                            type="button"
                            className="btn-outline admin-action"
                            disabled={busy || actionBusy}
                            onClick={() => {
                              void setStatus(m.user_id, 'inactive');
                            }}
                          >
                            구독 전
                          </button>
                          <button
                            type="button"
                            className="btn-outline admin-action"
                            disabled={busy || actionBusy}
                            onClick={() => {
                              void setStatus(m.user_id, 'expired');
                            }}
                          >
                            만료
                          </button>
                          <button
                            type="button"
                            className="btn-outline admin-action"
                            disabled={busy || actionBusy}
                            onClick={() => {
                              void setStatus(m.user_id, 'revoked');
                            }}
                          >
                            이용종료
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <p className="member-note">
            관리자 권한은 JWT의 app_metadata에 담깁니다. 플래그를 바꾼 뒤에는 재로그인이 필요합니다. service_role
            키는 이 화면에 사용하지 않습니다.
          </p>
          <Link className="member-home-link" href="/account/">
            ← 회원 계정
          </Link>
        </>
      )}
    </section>
  );
}
