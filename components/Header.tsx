"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";

const navLinks = [
  { href: "#method", label: "코칭 방식" },
  { href: "/training", label: "온라인 훈련" },
  { href: "#programs", label: "수업" },
  { href: "#coach", label: "코치" },
  { href: "/account/", label: "내 계정" },
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
    const closeOnEscape = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const resize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", resize);
    return () => { window.removeEventListener("keydown", closeOnEscape); window.removeEventListener("resize", resize); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-line bg-page/95 backdrop-blur-md"
          : "bg-page/95 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 md:h-16 md:px-8">
        <a href="#top" onClick={() => setOpen(false)} aria-label="VoiSpeech 홈">
          <Logo compact />
        </a>

        <nav className="hidden items-center gap-5 md:flex" aria-label="주요 메뉴">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[0.8125rem] text-muted transition hover:text-navy"
            >
              {link.label}
            </a>
          ))}
          <a href="#booking" className="btn-outline !px-3.5 !py-2 text-xs">
            레슨 예약
          </a>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center text-navy md:hidden"
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
        className={`border-t border-line bg-page md:hidden ${open ? "block" : "hidden"}`}
      >
        <nav className="flex flex-col px-5 py-3" aria-label="모바일 메뉴">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="py-3 text-sm text-muted"
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
            레슨 예약
          </a>
        </nav>
      </div>
    </header>
  );
}
