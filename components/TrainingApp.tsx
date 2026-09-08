'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMemberClient } from '@/lib/member-client';
import {
  cancelPreviewRenewal,
  expirePreviewMembership,
  fetchMembership,
  isSubscriptionActive,
  loadMembershipSnapshot,
  saveMembershipSnapshot,
  startPreviewMembership,
  type Membership,
} from '@/lib/membership';
import {
  lessonVideoSrc,
  listPublishedLessons,
  type Lesson,
} from '@/lib/lessons';
import {
  createCommunityPost,
  listCommunityPosts,
  type CommunityPost,
} from '@/lib/community';
import {
  createPracticeRecord,
  listPracticeRecords,
  type PracticeRecord,
} from '@/lib/practice';

type AuthState = {
  ready: boolean;
  configured: boolean;
  email: string | null;
  userId: string | null;
  status: string | null;
  active: boolean;
};

export type TrainingLessonDto = {
  id: string;
  sort_order: number;
  category: string;
  title: string;
  description: string;
  access: 'free' | 'subscribers';
  storage_path: string | null;
  video_url: string;
  duration_label: string;
  tag: string;
};

declare global {
  interface Window {
    __VOISPEECH__?: {
      userEmail: string | null;
      userId: string | null;
      status: string | null;
      active: boolean;
    };
    __VOISPEECH_ACTIONS__?: {
      startPreview: () => Promise<Membership>;
      cancelRenewal: () => Promise<Membership>;
      expirePreview: () => Promise<Membership>;
      refresh: () => Promise<void>;
    };
    __VOISPEECH_TRAINING__?: {
      sync: () => void;
    };
    __VOISPEECH_LESSONS__?: TrainingLessonDto[];
    __VOISPEECH_API__?: {
      listPosts: (channel: string) => Promise<CommunityPost[]>;
      createPost: (channel: string, body: string) => Promise<CommunityPost>;
      listRecords: () => Promise<PracticeRecord[]>;
      createRecord: (kind: string, minutes: number, note: string) => Promise<PracticeRecord>;
    };
  }
}

function toDto(lesson: Lesson): TrainingLessonDto {
  return {
    id: lesson.id,
    sort_order: lesson.sort_order,
    category: lesson.category,
    title: lesson.title,
    description: lesson.description,
    access: lesson.access,
    storage_path: lesson.storage_path,
    video_url: lessonVideoSrc(lesson),
    duration_label: lesson.duration_label,
    tag: lesson.access === 'free' ? '무료 미리보기' : '구독 전용',
  };
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
    userId: next.userId,
    status: next.status,
    active: next.active,
  };
  window.dispatchEvent(new CustomEvent('voispeech:membership'));
  window.__VOISPEECH_TRAINING__?.sync?.();
}

function applyMembership(
  membership: Membership | null,
  email: string | null,
  userId: string | null,
): AuthState {
  return {
    ready: true,
    configured: true,
    email,
    userId,
    status: membership?.status ?? null,
    active: isSubscriptionActive(membership),
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function publishLessons(lessons: Lesson[]) {
  window.__VOISPEECH_LESSONS__ = lessons.map(toDto);
  window.dispatchEvent(new CustomEvent('voispeech:lessons'));
  window.__VOISPEECH_TRAINING__?.sync?.();
}

export default function TrainingApp({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    ready: false,
    configured: false,
    email: null,
    userId: null,
    status: null,
    active: false,
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const client = getMemberClient();

    let mounted = true;
    let sessionUserId: string | null = null;
    let sessionEmail: string | null = null;

    async function loadLessons() {
      if (!client) return;
      try {
        const rows = await listPublishedLessons(client);
        if (!mounted) return;
        publishLessons(rows);
      } catch {
        // Keep SSR fallback cards if catalog fetch fails.
      }
    }

    void loadLessons();

    if (!client) {
      const next = {
        ready: true,
        configured: false,
        email: null,
        userId: null,
        status: null,
        active: false,
      };
      setState(next);
      publishToDom(next);
      delete window.__VOISPEECH_ACTIONS__;
      delete window.__VOISPEECH_API__;
      return;
    }

    window.__VOISPEECH_API__ = {
      listPosts: (channel: string) =>
        listCommunityPosts(client, channel, {
          userId: sessionUserId || '',
          email: sessionEmail,
        }),
      createPost: async (channel: string, body: string) => {
        if (!sessionUserId) throw new Error('login required');
        return createCommunityPost(client, sessionUserId, channel, body, sessionEmail);
      },
      listRecords: async () => {
        if (!sessionUserId) throw new Error('login required');
        return listPracticeRecords(client, sessionUserId);
      },
      createRecord: async (kind: string, minutes: number, note: string) => {
        if (!sessionUserId) throw new Error('login required');
        return createPracticeRecord(client, sessionUserId, kind, minutes, note);
      },
    };

    let revision = 0;
    let lastEmail: string | null = null;
    let lastUserId: string | null = null;

    async function refresh() {
      const request = ++revision;
      const snapshot = loadMembershipSnapshot();

      const { data, error } = await client!.auth.getUser();
      if (!mounted || request !== revision) return;
      if (error || !data.user) {
        lastEmail = null;
        lastUserId = null;
        sessionEmail = null;
        sessionUserId = null;
        const next = {
          ready: true,
          configured: true,
          email: null,
          userId: null,
          status: null,
          active: false,
        };
        setState(next);
        publishToDom(next);
        return;
      }
      lastEmail = data.user.email ?? null;
      lastUserId = data.user.id;
      sessionEmail = lastEmail;
      sessionUserId = lastUserId;

      if (snapshot && isSubscriptionActive(snapshot)) {
        const optimistic = applyMembership(snapshot, lastEmail, lastUserId);
        setState(optimistic);
        publishToDom(optimistic);
      }

      let membership = await fetchMembership(client!, data.user.id);
      if (!mounted || request !== revision) return;

      if (!isSubscriptionActive(membership) && snapshot && isSubscriptionActive(snapshot)) {
        for (let attempt = 0; attempt < 2; attempt++) {
          await sleep(300);
          if (!mounted || request !== revision) return;
          membership = await fetchMembership(client!, data.user.id);
          if (!mounted || request !== revision) return;
          if (isSubscriptionActive(membership)) break;
        }
      }

      const latestSnapshot = loadMembershipSnapshot();
      if (
        !isSubscriptionActive(membership) &&
        latestSnapshot &&
        isSubscriptionActive(latestSnapshot)
      ) {
        const next = applyMembership(latestSnapshot, lastEmail, lastUserId);
        setState(next);
        publishToDom(next);
        return;
      }

      saveMembershipSnapshot(membership);
      const next = applyMembership(membership, lastEmail, lastUserId);
      setState(next);
      publishToDom(next);
    }

    async function runRpc(
      fn: (c: NonNullable<ReturnType<typeof getMemberClient>>) => Promise<Membership>,
    ): Promise<Membership> {
      const membership = await fn(client!);
      let email = lastEmail;
      let userId = lastUserId;
      if (email == null || userId == null) {
        const { data, error } = await client!.auth.getUser();
        if (!error && data.user) {
          email = data.user.email ?? null;
          userId = data.user.id;
          lastEmail = email;
          lastUserId = userId;
          sessionEmail = email;
          sessionUserId = userId;
        }
      }
      saveMembershipSnapshot(membership);
      const next = applyMembership(membership, email, userId);
      publishToDom(next);
      if (mounted) setState(next);
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
      timer = setTimeout(() => {
        void refresh();
      }, 0);
    });
    const onPageShow = () => {
      void refresh();
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void refresh();
    };
    const onForceMembership = () => {
      setState((prev) => ({
        ...prev,
        ready: true,
        configured: true,
        active: true,
      }));
    };
    window.addEventListener('voispeech:force-membership', onForceMembership);
    window.addEventListener('pageshow', onPageShow);
    document.addEventListener('visibilitychange', onVisibility);
    void refresh();
    return () => {
      mounted = false;
      revision++;
      clearTimeout(timer);
      listener.subscription.unsubscribe();
      window.removeEventListener('voispeech:force-membership', onForceMembership);
      window.removeEventListener('pageshow', onPageShow);
      document.removeEventListener('visibilitychange', onVisibility);
      delete window.__VOISPEECH_ACTIONS__;
      delete window.__VOISPEECH_API__;
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
        <p className="member-topbar-status" aria-live="polite">
          {label}
        </p>
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
