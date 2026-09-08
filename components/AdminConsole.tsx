'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import { getMemberClient } from '@/lib/member-client';
import {
  adminListMembers,
  adminSetSubscription,
  isVoiSpeechAdmin,
  type AdminMemberRow,
} from '@/lib/admin';
import {
  createLesson,
  deleteLesson,
  listAllLessons,
  updateLesson,
  uploadLessonVideo,
  type Lesson,
  type LessonAccess,
} from '@/lib/lessons';
import { TOSS_STATUS } from '@/lib/toss';

const STATUS_LABELS: Record<string, string> = {
  inactive: '구독 전',
  active: '구독 중',
  past_due: '결제 확인 필요',
  expired: '만료',
  revoked: '이용종료',
};

type AdminTab = 'subscriptions' | 'lessons';

type LessonFormState = {
  id: string | null;
  title: string;
  category: string;
  description: string;
  access: LessonAccess;
  sort_order: number;
  duration_label: string;
  published: boolean;
};

const EMPTY_FORM: LessonFormState = {
  id: null,
  title: '',
  category: '기초',
  description: '',
  access: 'subscribers',
  sort_order: 1,
  duration_label: '',
  published: true,
};

function nextSortOrder(lessons: Lesson[]): number {
  if (!lessons.length) return 1;
  const max = Math.max(...lessons.map((l) => Number(l.sort_order) || 0));
  return (Number.isFinite(max) ? max : lessons.length) + 1;
}

function blankForm(lessons: Lesson[]): LessonFormState {
  return { ...EMPTY_FORM, sort_order: nextSortOrder(lessons) };
}

function formatSeoul(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
}

function formFromLesson(l: Lesson): LessonFormState {
  return {
    id: l.id,
    title: l.title,
    category: l.category,
    description: l.description,
    access: l.access,
    sort_order: l.sort_order,
    duration_label: l.duration_label,
    published: l.published,
  };
}

export default function AdminConsole() {
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(true);
  const [actionBusy, setActionBusy] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [members, setMembers] = useState<AdminMemberRow[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('로그인 상태를 확인하고 있습니다.');
  const [tab, setTab] = useState<AdminTab>('subscriptions');
  const [form, setForm] = useState<LessonFormState>(EMPTY_FORM);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPct, setUploadPct] = useState<number | null>(null);
  const [lessonError, setLessonError] = useState<string | null>(null);

  const admin = isVoiSpeechAdmin(user);

  const loadMembers = useCallback(async () => {
    const client = getMemberClient();
    if (!client) return;
    const rows = await adminListMembers(client);
    setMembers(rows);
  }, []);

  const loadLessons = useCallback(async () => {
    const client = getMemberClient();
    if (!client) return [] as Lesson[];
    const rows = await listAllLessons(client);
    setLessons(rows);
    return rows;
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
        setLessons([]);
        setMessage('운영자 계정으로 Google 로그인해 주세요.');
        setBusy(false);
        return;
      }

      if (!isVoiSpeechAdmin(nextUser)) {
        setMembers([]);
        setLessons([]);
        setMessage(
          '접근 불가: 운영자 권한이 없습니다. 관리자 플래그를 반영하려면 로그아웃 후 다시 로그인해 JWT를 갱신하세요.',
        );
        setBusy(false);
        return;
      }

      try {
        await Promise.all([loadMembers(), loadLessons()]);
        if (!mounted || request !== revision) return;
        setMessage('관리 데이터를 불러왔습니다.');
      } catch {
        if (!mounted || request !== revision) return;
        setMembers([]);
        setLessons([]);
        setMessage('목록을 불러오지 못했습니다. 권한·재로그인 후 다시 시도해 주세요.');
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
  }, [loadMembers, loadLessons]);

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
      setLessons([]);
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
      setMessage('회원 목록을 새로고침했습니다.');
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

  async function refreshLessons() {
    setActionBusy(true);
    setLessonError(null);
    try {
      await loadLessons();
      setMessage('강의 목록을 새로고침했습니다.');
    } catch {
      setLessonError('강의 목록을 불러오지 못했습니다.');
      setMessage('강의 목록을 불러오지 못했습니다.');
    } finally {
      setActionBusy(false);
    }
  }

  async function saveLesson(e: FormEvent) {
    e.preventDefault();
    const client = getMemberClient();
    if (!client) return;
    if (!form.title.trim()) {
      setLessonError('제목을 입력해 주세요.');
      return;
    }
    setActionBusy(true);
    setLessonError(null);
    setUploadPct(null);
    try {
      let lesson: Lesson;
      const payload = {
        title: form.title,
        category: form.category || '기초',
        description: form.description,
        access: form.access,
        sort_order: Number.isFinite(form.sort_order) ? form.sort_order : 0,
        duration_label: form.duration_label,
        published: form.published,
      };
      if (form.id) {
        lesson = await updateLesson(client, form.id, payload);
      } else {
        lesson = await createLesson(client, payload);
      }

      if (uploadFile) {
        const mime = uploadFile.type || '';
        if (mime && mime !== 'video/mp4' && mime !== 'video/webm') {
          throw new Error('mp4 또는 webm 파일만 업로드할 수 있습니다.');
        }
        setUploadPct(0);
        setMessage('영상을 업로드하는 중입니다…');
        lesson = await uploadLessonVideo(client, lesson.id, uploadFile, (pct) => {
          setUploadPct(pct);
        });
        setUploadFile(null);
      }

      const rows = (await loadLessons()) || [];
      setForm(blankForm(rows));
      setUploadFile(null);
      setUploadPct(null);
      setMessage(form.id ? '강의를 저장했습니다.' : '강의를 만들고 저장했습니다.');
    } catch (err) {
      const detail = err instanceof Error && err.message ? err.message : '저장에 실패했습니다.';
      setLessonError(detail);
      setMessage(`강의 저장 실패: ${detail}`);
      setUploadPct(null);
    } finally {
      setActionBusy(false);
    }
  }

  async function removeLesson(lesson: Lesson) {
    const client = getMemberClient();
    if (!client) return;
    if (!window.confirm(`「${lesson.title}」 강의를 삭제할까요?`)) return;
    setActionBusy(true);
    setLessonError(null);
    try {
      await deleteLesson(client, lesson.id, lesson.storage_path);
      const rows = (await loadLessons()) || [];
      if (form.id === lesson.id) {
        setForm(blankForm(rows));
        setUploadFile(null);
      }
      setMessage('강의를 삭제했습니다.');
    } catch (err) {
      const detail = err instanceof Error && err.message ? err.message : '삭제 실패';
      setLessonError(detail);
      setMessage(`강의 삭제 실패: ${detail}`);
    } finally {
      setActionBusy(false);
    }
  }

  return (
    <section className="member-card admin-card" aria-labelledby="admin-heading">
      <p className="eyebrow">VOISPEECH ADMIN</p>
      <h1 id="admin-heading">운영자 콘솔</h1>
      <p className="admin-toss-banner" role="status">
        {TOSS_STATUS.bannerKo}
      </p>
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
            접근 불가입니다. 이 계정에는 운영자 권한이 없습니다. 관리자 플래그를 방금 부여했다면 로그아웃 했다가 다시
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
          </dl>

          <div className="admin-tabs" role="tablist" aria-label="관리 메뉴">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'subscriptions'}
              className={tab === 'subscriptions' ? 'admin-tab is-active' : 'admin-tab'}
              onClick={() => setTab('subscriptions')}
            >
              구독 관리
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'lessons'}
              className={tab === 'lessons' ? 'admin-tab is-active' : 'admin-tab'}
              onClick={() => setTab('lessons')}
            >
              강의 업로드
            </button>
            <button className="btn-outline member-logout" disabled={busy || actionBusy} onClick={signOut}>
              로그아웃
            </button>
          </div>

          {tab === 'subscriptions' ? (
            <div role="tabpanel">
              <p className="admin-panel-meta">
                회원 수 {filtered.length}
                {query.trim() ? ` / ${members.length}` : ''}명
              </p>
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
            </div>
          ) : (
            <div role="tabpanel" className="admin-lessons-panel">
              <div className="admin-toolbar">
                <button
                  type="button"
                  className="btn-outline"
                  disabled={busy || actionBusy}
                  onClick={() => {
                    setForm(blankForm(lessons));
                    setUploadFile(null);
                    setLessonError(null);
                  }}
                >
                  새 강의
                </button>
                <button
                  type="button"
                  className="btn-outline"
                  disabled={busy || actionBusy}
                  onClick={() => {
                    void refreshLessons();
                  }}
                >
                  새로고침
                </button>
              </div>

              {lessonError ? (
                <p className="admin-error" role="alert">
                  {lessonError}
                </p>
              ) : null}

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th scope="col">순서 · 강의</th>
                      <th scope="col">접근 · 게시</th>
                      <th scope="col">영상</th>
                      <th scope="col">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lessons.length === 0 ? (
                      <tr>
                        <td colSpan={4}>{busy ? '불러오는 중…' : '등록된 강의가 없습니다.'}</td>
                      </tr>
                    ) : (
                      lessons.map((l) => (
                        <tr key={l.id} className={form.id === l.id ? 'admin-row-selected' : undefined}>
                          <td>
                            <div className="admin-member-email">
                              #{l.sort_order} · {l.title}
                            </div>
                            <div className="admin-member-name">
                              {l.category} · {l.description || '설명 없음'}
                            </div>
                          </td>
                          <td>
                            <div>{l.access === 'free' ? '무료' : '구독 전용'}</div>
                            <div className="admin-period">{l.published ? '게시됨' : '비공개'}</div>
                          </td>
                          <td>
                            <div className="admin-period">
                              {l.storage_path ? l.storage_path : '미업로드 · 샘플 재생'}
                            </div>
                          </td>
                          <td>
                            <div className="admin-row-actions">
                              <button
                                type="button"
                                className="btn-primary admin-action"
                                disabled={busy || actionBusy}
                                onClick={() => {
                                  setForm(formFromLesson(l));
                                  setUploadFile(null);
                                  setLessonError(null);
                                }}
                              >
                                편집
                              </button>
                              <button
                                type="button"
                                className="btn-outline admin-action"
                                disabled={busy || actionBusy}
                                onClick={() => {
                                  void removeLesson(l);
                                }}
                              >
                                삭제
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <form className="admin-lesson-form" onSubmit={(e) => void saveLesson(e)}>
                <h2>{form.id ? '강의 편집' : '새 강의'}</h2>
                <div className="admin-form-grid">
                  <label>
                    제목
                    <input
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      required
                      maxLength={120}
                      disabled={actionBusy}
                    />
                  </label>
                  <label>
                    카테고리
                    <input
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      maxLength={40}
                      disabled={actionBusy}
                      placeholder="기초 / SOVT / 노래 적용"
                    />
                  </label>
                  <label className="admin-form-span">
                    설명
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      maxLength={500}
                      rows={3}
                      disabled={actionBusy}
                    />
                  </label>
                  <label>
                    접근
                    <select
                      value={form.access}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, access: e.target.value as LessonAccess }))
                      }
                      disabled={actionBusy}
                    >
                      <option value="free">무료 미리보기</option>
                      <option value="subscribers">구독 전용</option>
                    </select>
                  </label>
                  <label>
                    정렬 순서
                    <input
                      type="number"
                      value={form.sort_order}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, sort_order: Number(e.target.value) || 0 }))
                      }
                      disabled={actionBusy}
                    />
                  </label>
                  <label>
                    길이 표기
                    <input
                      value={form.duration_label}
                      onChange={(e) => setForm((f) => ({ ...f, duration_label: e.target.value }))}
                      maxLength={40}
                      disabled={actionBusy}
                      placeholder="예: 8분"
                    />
                  </label>
                  <label className="admin-check">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                      disabled={actionBusy}
                    />
                    게시(훈련관에 표시)
                  </label>
                  <label className="admin-form-span">
                    영상 파일 (mp4 / webm)
                    <input
                      type="file"
                      accept="video/mp4,video/webm,.mp4,.webm"
                      disabled={actionBusy}
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        setUploadFile(f);
                      }}
                    />
                    <span className="admin-period">
                      {uploadFile
                        ? `선택됨: ${uploadFile.name} (${Math.round(uploadFile.size / 1024 / 1024)}MB)`
                        : form.id
                          ? '저장 시 새 파일이 있으면 업로드 후 storage_path를 갱신합니다.'
                          : '새 강의는 먼저 메타데이터를 만든 뒤, 같은 양식에서 영상을 올릴 수 있습니다.'}
                    </span>
                  </label>
                </div>
                {uploadPct != null ? (
                  <p className="admin-upload-progress" aria-live="polite">
                    업로드 진행 {uploadPct}%
                  </p>
                ) : null}
                <div className="admin-row-actions">
                  <button type="submit" className="btn-primary" disabled={busy || actionBusy}>
                    {actionBusy ? '저장 중…' : '저장'}
                  </button>
                  <button
                    type="button"
                    className="btn-outline"
                    disabled={actionBusy}
                    onClick={() => {
                      setForm(blankForm(lessons));
                      setUploadFile(null);
                      setLessonError(null);
                    }}
                  >
                    초기화
                  </button>
                </div>
              </form>
            </div>
          )}

          <p className="member-note">
            관리자 권한은 JWT의 app_metadata에 담깁니다. 플래그를 바꾼 뒤에는 재로그인이 필요합니다. service_role
            키는 이 화면에 사용하지 않습니다. 토스페이먼츠는 도입문의만 완료된 상태이며 실결제는 연동하지 않았습니다.
          </p>
          <Link className="member-home-link" href="/account/">
            ← 회원 계정
          </Link>
        </>
      )}
    </section>
  );
}
