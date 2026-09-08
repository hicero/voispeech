'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMemberClient } from '@/lib/member-client';
import {
  cancelPreviewRenewal,
  clearLoginReturn,
  clearMembershipHandoff,
  clearMembershipSnapshot,
  expirePreviewMembership,
  fetchMembership,
  isSubscriptionActive,
  loadMembershipHandoff,
  loadMembershipSnapshot,
  markMembershipHandoff,
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
  deleteCommunityPost,
  listCommunityPosts,
  toggleCommunityLike,
  type CommunityListResult,
  type CommunityPost,
  type LikeToggleResult,
} from '@/lib/community';
import { isVoiSpeechAdmin } from '@/lib/admin';
import {
  createPracticeRecord,
  listPracticeRecords,
  type PracticeRecord,
} from '@/lib/practice';
import {
  listLessonProgress,
  upsertLessonProgress,
  type LessonProgress,
} from '@/lib/progress';

type AuthState = {
  ready: boolean;
  configured: boolean;
  email: string | null;
  userId: string | null;
  status: string | null;
  active: boolean;
  isAdmin: boolean;
};

export type TrainingLessonSessionDto = {
  id: string;
  sort_order: number;
  title: string;
  description: string;
  storage_path: string | null;
  video_url: string;
  duration_label: string;
};

export type TrainingLessonDto = {
  id: string;
  sort_order: number;
  category: string;
  title: string;
  /** 소제목 */
  description: string;
  /** 내용 below video */
  body: string;
  access: 'free' | 'subscribers';
  storage_path: string | null;
  video_url: string;
  duration_label: string;
  tag: string;
  sessions: TrainingLessonSessionDto[];
};

declare global {
  interface Window {
    __VOISPEECH__?: {
      userEmail: string | null;
      userId: string | null;
      status: string | null;
      active: boolean;
      isAdmin: boolean;
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
    __VOISPEECH_LESSONS_LOADED__?: boolean;
    __VOISPEECH_API__?: {
      isAdmin: boolean;
      listPosts: (
        channel: string,
        opts?: { limit?: number; offset?: number },
      ) => Promise<CommunityListResult>;
      createPost: (
        channel: string,
        body: string,
        parentId?: string | null,
      ) => Promise<CommunityPost>;
      deletePost: (id: string) => Promise<void>;
      toggleLike: (postId: string) => Promise<LikeToggleResult>;
      listRecords: () => Promise<PracticeRecord[]>;
      createRecord: (kind: string, minutes: number, note: string) => Promise<PracticeRecord>;
      listProgress: () => Promise<LessonProgress[]>;
      saveProgress: (
        lessonId: string,
        completedSteps: number[],
        completed: boolean,
      ) => Promise<LessonProgress>;
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
    body: lesson.body || '',
    access: lesson.access,
    storage_path: lesson.storage_path,
    video_url: lessonVideoSrc(lesson),
    duration_label: lesson.duration_label,
    tag: lesson.access === 'free' ? '무료 미리보기' : '구독 전용',
    sessions: (lesson.sessions || []).map((session) => ({
      id: session.id,
      sort_order: session.sort_order,
      title: session.title,
      description: session.description,
      storage_path: session.storage_path,
      video_url: lessonVideoSrc(session),
      duration_label: session.duration_label,
    })),
  };
}

function publishToDom(next: AuthState) {
  const academy = document.getElementById('academy');
  if (academy) {
    if (next.configured) {
      // Handoff can arrive before getUser resolves; keep user+active so locks unlock.
      const treatAsUser = Boolean(next.email) || next.active;
      academy.dataset.auth = treatAsUser ? 'user' : 'anon';
      academy.dataset.sub = next.active ? 'active' : treatAsUser ? 'inactive' : 'none';
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
    isAdmin: next.isAdmin,
  };
  if (window.__VOISPEECH_API__) {
    window.__VOISPEECH_API__.isAdmin = next.isAdmin;
  }
  window.dispatchEvent(new CustomEvent('voispeech:membership'));
  window.__VOISPEECH_TRAINING__?.sync?.();
}

function applyMembership(
  membership: Membership | null,
  email: string | null,
  userId: string | null,
  isAdmin = false,
): AuthState {
  const active = isSubscriptionActive(membership)
    || (membership?.status === 'active' && Boolean(membership.current_period_end));
  return {
    ready: true,
    configured: true,
    email,
    userId,
    status: membership?.status ?? null,
    active,
    isAdmin,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function publishLessons(lessons: Lesson[]) {
  window.__VOISPEECH_LESSONS__ = lessons.map(toDto);
  window.__VOISPEECH_LESSONS_LOADED__ = true;
  window.dispatchEvent(new CustomEvent('voispeech:lessons'));
  window.__VOISPEECH_TRAINING__?.sync?.();
}

function pickHandoffMembership(): Membership | null {
  const handoff = loadMembershipHandoff();
  if (handoff && (isSubscriptionActive(handoff) || handoff.status === 'active')) return handoff;
  const snapshot = loadMembershipSnapshot();
  if (snapshot && (isSubscriptionActive(snapshot) || snapshot.status === 'active')) return snapshot;
  return null;
}

export default function TrainingApp({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    ready: false,
    configured: false,
    email: null,
    userId: null,
    status: null,
    active: false,
    isAdmin: false,
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const client = getMemberClient();

    let mounted = true;
    let sessionUserId: string | null = null;
    let sessionEmail: string | null = null;

    // Apply account→training handoff immediately so unlock works before async fetch.
    const early = pickHandoffMembership();
    if (early) {
      const optimistic = applyMembership(early, null, null);
      setState(optimistic);
      publishToDom(optimistic);
    }

    async function loadLessons() {
      if (!client) return;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const rows = await listPublishedLessons(client);
          if (!mounted) return;
          publishLessons(rows);
          return;
        } catch {
          if (attempt === 0) await sleep(500);
        }
      }
      // Final failure: mark loaded so UI settles on fallback samples instead of waiting forever.
      if (mounted) {
        window.__VOISPEECH_LESSONS_LOADED__ = true;
        window.dispatchEvent(new CustomEvent('voispeech:lessons'));
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
        isAdmin: false,
      };
      setState(next);
      publishToDom(next);
      delete window.__VOISPEECH_ACTIONS__;
      delete window.__VOISPEECH_API__;
      return;
    }

    let sessionIsAdmin = false;

    window.__VOISPEECH_API__ = {
      isAdmin: false,
      listPosts: (channel: string, opts?: { limit?: number; offset?: number }) =>
        listCommunityPosts(
          client,
          channel,
          {
            userId: sessionUserId || '',
            email: sessionEmail,
          },
          opts,
        ),
      createPost: async (channel: string, body: string, parentId?: string | null) => {
        if (!sessionUserId) throw new Error('login required');
        return createCommunityPost(
          client,
          sessionUserId,
          channel,
          body,
          sessionEmail,
          parentId,
        );
      },
      deletePost: async (id: string) => {
        if (!sessionUserId) throw new Error('login required');
        return deleteCommunityPost(client, id);
      },
      toggleLike: async (postId: string) => {
        if (!sessionUserId) throw new Error('login required');
        return toggleCommunityLike(client, sessionUserId, postId);
      },
      listRecords: async () => {
        if (!sessionUserId) throw new Error('login required');
        return listPracticeRecords(client, sessionUserId);
      },
      createRecord: async (kind: string, minutes: number, note: string) => {
        if (!sessionUserId) throw new Error('login required');
        return createPracticeRecord(client, sessionUserId, kind, minutes, note);
      },
      listProgress: async () => {
        if (!sessionUserId) throw new Error('login required');
        return listLessonProgress(client, sessionUserId);
      },
      saveProgress: async (lessonId: string, completedSteps: number[], completed: boolean) => {
        if (!sessionUserId) throw new Error('login required');
        return upsertLessonProgress(client, sessionUserId, lessonId, completedSteps, completed);
      },
    };

    let revision = 0;
    let lastEmail: string | null = null;
    let lastUserId: string | null = null;

    async function refresh() {
      const request = ++revision;
      const snapshot = pickHandoffMembership();

      const { data, error } = await client!.auth.getUser();
      if (!mounted || request !== revision) return;
      if (error || !data.user) {
        lastEmail = null;
        lastUserId = null;
        sessionEmail = null;
        sessionUserId = null;
        sessionIsAdmin = false;
        const next = {
          ready: true,
          configured: true,
          email: null,
          userId: null,
          status: null,
          active: false,
          isAdmin: false,
        };
        setState(next);
        publishToDom(next);
        return;
      }
      lastEmail = data.user.email ?? null;
      lastUserId = data.user.id;
      sessionEmail = lastEmail;
      sessionUserId = lastUserId;
      sessionIsAdmin = isVoiSpeechAdmin(data.user);
      clearLoginReturn();

      if (snapshot) {
        const optimistic = applyMembership(snapshot, lastEmail, lastUserId, sessionIsAdmin);
        setState(optimistic);
        publishToDom(optimistic);
      }

      let membership: Membership | null = null;
      try {
        membership = await fetchMembership(client!, data.user.id);
      } catch {
        membership = null;
      }
      if (!mounted || request !== revision) return;

      if (!isSubscriptionActive(membership) && snapshot) {
        for (let attempt = 0; attempt < 3; attempt++) {
          await sleep(250);
          if (!mounted || request !== revision) return;
          try {
            membership = await fetchMembership(client!, data.user.id);
          } catch {
            membership = null;
          }
          if (!mounted || request !== revision) return;
          if (isSubscriptionActive(membership)) break;
        }
      }

      const latestHandoff = pickHandoffMembership();
      if (
        !isSubscriptionActive(membership) &&
        latestHandoff &&
        (isSubscriptionActive(latestHandoff) || latestHandoff.status === 'active')
      ) {
        const next = applyMembership(latestHandoff, lastEmail, lastUserId, sessionIsAdmin);
        setState(next);
        publishToDom(next);
        return;
      }

      if (isSubscriptionActive(membership) && membership) {
        saveMembershipSnapshot(membership, { force: true });
        clearMembershipHandoff();
      }
      const next = applyMembership(membership, lastEmail, lastUserId, sessionIsAdmin);
      // Keep unlock if handoff said active but clock/parse edge-case tripped.
      if (!next.active && latestHandoff && latestHandoff.status === 'active') {
        next.active = true;
        next.status = latestHandoff.status;
      }
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
      if (membership.status === 'active') {
        markMembershipHandoff(membership);
      } else {
        saveMembershipSnapshot(membership, { force: true });
      }
      const next = applyMembership(membership, email, userId, sessionIsAdmin);
      if (membership.status === 'active' && !next.active) next.active = true;
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
      const handoff = pickHandoffMembership();
      setState((prev) => {
        const next: AuthState = {
          ...prev,
          ready: true,
          configured: true,
          active: true,
          status: handoff?.status ?? prev.status ?? 'active',
          email: prev.email ?? lastEmail,
          userId: prev.userId ?? lastUserId,
          isAdmin: prev.isAdmin || sessionIsAdmin,
        };
        publishToDom(next);
        return next;
      });
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
      clearMembershipSnapshot();
      clearLoginReturn();
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
