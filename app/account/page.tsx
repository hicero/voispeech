import Link from 'next/link';
import type { Metadata } from 'next';
import MemberAccount from '@/components/MemberAccount';

export const metadata: Metadata = { title: '회원 로그인 | VoiSpeech', robots: { index: false, follow: false } };

export default function AccountPage() {
  return <main className="member-page" id="main-content">
    <Link className="academy-brand" href="/">VoiSpeech <span>ONLINE STUDIO</span></Link>
    <MemberAccount />
    <Link href="/training/">온라인 훈련관 둘러보기 →</Link>
  </main>;
}
