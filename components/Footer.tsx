import Logo from "./Logo";
export default function Footer(){return <footer className="site-footer"><div className="mx-auto max-w-6xl px-5 md:px-8"><div className="footer-top"><div><Logo/><p>나의 목소리를 알아가는 시간.</p></div><a href="#top">맨 위로 ↑</a></div><p className="footer-copy">© {new Date().getFullYear()} VoiSpeech · 보이스피치</p></div></footer>}
