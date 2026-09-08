'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMemberClient } from '@/lib/member-client';
import {
  cancelPreviewRenewal,
  expirePreviewMembership,
  fetchMembership,
  isSubscriptionActive,
  startPreviewMembership,
  type Membership,
} from '@/lib/membership';

type AuthState = {
  ready: boolean;
  configured: boolean;
  email: string | null;
  status: string | null;
  active: boolean;
};

declare global {
  interface Window {
    __VOISPEECH__?: {
      userEmail: string | null;
      status: string | null;
      active: boolean;
    };
    __VOISPEECH_ACTIONS__?: {
      startPreview: () => Promise<Membership>;
      cancelRenewal: () => Promise<Membership>;
      expirePreview: () => Promise<Membership>;
      refresh: () => Promise<void>;
    };
  }
}

function publishToDom(next: AuthState) {
  const academy = document.getElementById('academy');
  if (academy) {
    if (next.configured) {
      academy.dataset.auth = next.email ? 'user' : 'anon';
      academy.dataset.sub = next.active ? 'active' : next.email ? 'inactive' : 'none';
    } else {
      delete academy.dataset.auth;
      delete academy.dataset.sub;
    }
  }
  window.__VOISPEECH__ = {
    userEmail: next.email,
    status: next.status,
    active: next.active,
  };
  window.dispatchEvent(new CustomEvent('voispeech:membership'));
}

function applyMembership(membership: Membership | null, email: string | null): AuthState {
  return {
    ready: true,
    configured: true,
    email,
    status: membership?.status ?? null,
    active: isSubscriptionActive(membership),
  };
}

export default function TrainingApp({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    ready: false,
    configured: false,
    email: null,
    status: null,
    active: false,
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const client = getMemberClient();
    if (!client) {
      const next = { ready: true, configured: false, email: null, status: null, active: false };
      setState(next);
      publishToDom(next);
      delete window.__VOISPEECH_ACTIONS__;
      return;
    }

    let mounted = true;
    let revision = 0;
    let lastEmail: string | null = null;

    async function refresh() {
      const request = ++revision;
      const { data, error } = await client!.auth.getUser();
      if (!mounted || request !== revision) return;
      if (error || !data.user) {
        lastEmail = null;
        const next = { ready: true, configured: true, email: null, status: null, active: false };
        setState(next);
        publishToDom(next);
        return;
      }
      lastEmail = data.user.email ?? null;
      const membership = await fetchMembership(client!, data.user.id);
      if (!mounted || request !== revision) return;
      const next = applyMembership(membership, lastEmail);
      setState(next);
      publishToDom(next);
    }

    async function runRpc(
      fn: (c: NonNullable<ReturnType<typeof getMemberClient>>) => Promise<Membership>,
    ): Promise<Membership> {
      const membership = await fn(client!);
      if (!mounted) return membership;
      const next = applyMembership(membership, lastEmail);
      setState(next);
      publishToDom(next);
      return membership;
    }

    window.__VOISPEECH_ACTIONS__ = {
      startPreview: () => runRpc(startPreviewMembership),
      cancelRenewal: () => runRpc(cancelPreviewRenewal),
      expirePreview: () => runRpc(expirePreviewMembership),
      refresh: () => refresh(),
    };

    let timer: ReturnType<typeof setTimeout> | undefined;
    const { data: listener } = client.auth.onAuthStateChange(() => {
      clearTimeout(timer);
      timer = setTimeout(() => { void refresh(); }, 0);
    });
    void refresh();
    return () => {
      mounted = false;
      revision++;
      clearTimeout(timer);
      listener.subscription.unsubscribe();
      delete window.__VOISPEECH_ACTIONS__;
    };
  }, []);

  async function signOut() {
    const client = getMemberClient();
    if (!client) return;
    setBusy(true);
    try {
      await client.auth.signOut();
    } finally {
      setBusy(false);
    }
  }

  const label = !state.ready
    ? '회원 상태 확인 중…'
    : !state.configured
      ? '회원 연결 준비 중'
      : state.email
        ? state.active
          ? `${state.email} · 구독 중`
          : `${state.email} · 구독 전`
        : '로그인하지 않음';

  return (
    <>
      <div className="member-topbar" role="region" aria-label="회원 상태">
        <p className="member-topbar-status" aria-live="polite">{label}</p>
        <div className="member-topbar-actions">
          <Link href="/account/" className="member-topbar-link">
            {state.email ? '내 계정' : '로그인 · 회원가입'}
          </Link>
          {state.email ? (
            <button type="button" className="member-topbar-logout" disabled={busy} onClick={signOut}>
              로그아웃
            </button>
          ) : null}
        </div>
      </div>
      {children}
    </>
  );
}
