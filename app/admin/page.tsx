import Link from 'next/link';
import type { Metadata } from 'next';
import AdminConsole from '@/components/AdminConsole';

export const metadata: Metadata = {
  title: '운영자 구독 관리 | VoiSpeech',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="member-page admin-page" id="main-content">
      <Link className="academy-brand" href="/">
        VoiSpeech <span>ONLINE STUDIO</span>
      </Link>
      <AdminConsole />
      <Link href="/account/">← 회원 계정</Link>
    </main>
  );
}
