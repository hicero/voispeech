"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";

const navLinks = [
  { href: "#method", label: "코칭 방식" },
  { href: "#voice-check", label: "5 Voice Check" },
  { href: "#programs", label: "수업" },
  { href: "#results", label: "변화" },
  { href: "#coach", label: "코치" },
  { href: "#research", label: "연구" },
  { href: "/training", label: "온라인 훈련" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const resize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? "is-scrolled" : ""
      }`}
    >
      <div className="site-header-inner content-shell">
        <a href="#top" onClick={() => setOpen(false)} aria-label="VoiSpeech 홈">
          <Logo compact />
        </a>

        <nav className="site-nav hidden items-center gap-4 lg:flex" aria-label="주요 메뉴">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="site-nav-link">
              {link.label}
            </a>
          ))}
          <a href="#booking" className="btn-outline site-nav-cta">
            원데이 예약
          </a>
        </nav>

        <button
          type="button"
          className="site-menu-btn lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`site-mobile-nav lg:hidden ${open ? "is-open" : ""}`}
      >
        <nav className="flex flex-col px-5 py-3" aria-label="모바일 메뉴">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="site-mobile-link"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#booking"
            className="btn-outline mt-2 mb-3 w-full"
            onClick={() => setOpen(false)}
          >
            원데이 예약
          </a>
        </nav>
      </div>
    </header>
  );
}
