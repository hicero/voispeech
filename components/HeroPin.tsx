"use client";

import { useEffect } from "react";

const PIN_MIN_HEIGHT = 821;
const PIN_MIN_WIDTH = 768;

/**
 * Home-only pinned-hero progress. Sets --p (0–1) on .hero-section via one
 * rAF-throttled scroll listener. Respects prefers-reduced-motion, short
 * viewports, and first-frame fit (static hero, no pin). Not mounted from
 * layout or /training/.
 */
export default function HeroPin({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".hero-section");
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const shortH = window.matchMedia(`(max-height: ${PIN_MIN_HEIGHT - 1}px)`);
    const narrow = window.matchMedia(`(max-width: ${PIN_MIN_WIDTH - 1}px)`);
    const stick = root.querySelector<HTMLElement>(".hero-stick");
    const slot = root.querySelector<HTMLElement>(".hero-cover-slot");
    const grid = root.querySelector<HTMLElement>(".hero-grid");

    const canPin = () => {
      if (reduce.matches || shortH.matches || narrow.matches) return false;
      if (window.innerHeight < PIN_MIN_HEIGHT) return false;
      if (window.innerWidth < PIN_MIN_WIDTH) return false;
      if (stick && grid) {
        const cs = getComputedStyle(stick);
        const pad =
          (parseFloat(cs.paddingTop) || 0) +
          (parseFloat(cs.paddingBottom) || 0);
        const needed = grid.getBoundingClientRect().height + pad + 16;
        if (needed > window.innerHeight) return false;
      }
      return true;
    };

    const disablePin = () => {
      root.style.setProperty("--p", "0");
      root.classList.add("is-static-hero");
      root.classList.remove("is-hero-measured", "is-hero-copy-gone");
      if (slot) slot.style.minHeight = "";
    };

    const measure = () => {
      if (!stick || !slot || !canPin()) return;
      const sr = stick.getBoundingClientRect();
      const sl = slot.getBoundingClientRect();
      const t = sl.top - sr.top;
      const l = sl.left - sr.left;
      root.style.setProperty("--c0-t", `${t}px`);
      root.style.setProperty("--c0-l", `${l}px`);
      root.style.setProperty("--c0-w", `${sl.width}px`);
      root.style.setProperty("--c0-h", `${sl.height}px`);
      slot.style.minHeight = `${sl.height}px`;

      const mobile = window.innerWidth < 768;
      const inset = mobile ? 20 : 16;
      const fullT = inset;
      const fullL = inset;
      const fullW = Math.max(0, sr.width - inset * 2);
      const fullH = Math.max(0, sr.height - inset * 2);
      // Mobile stays lighter: only walk most of the way toward full-bleed.
      const amount = mobile ? 0.72 : 1;
      root.style.setProperty("--c1-t", `${t + (fullT - t) * amount}px`);
      root.style.setProperty("--c1-l", `${l + (fullL - l) * amount}px`);
      root.style.setProperty("--c1-w", `${sl.width + (fullW - sl.width) * amount}px`);
      root.style.setProperty("--c1-h", `${sl.height + (fullH - sl.height) * amount}px`);
      root.classList.add("is-hero-measured");
    };

    const apply = () => {
      if (!canPin()) {
        disablePin();
        return;
      }
      root.classList.remove("is-static-hero");
      const r = root.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      root.style.setProperty("--p", p.toFixed(4));
      root.classList.toggle("is-hero-copy-gone", p > 0.42);
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        apply();
        ticking = false;
      });
    };

    const onResize = () => {
      apply();
      if (canPin()) measure();
      apply();
    };

    apply();
    // Measure after layout so the cover's in-flow size is accurate.
    requestAnimationFrame(() => {
      measure();
      apply();
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    reduce.addEventListener("change", onResize);
    shortH.addEventListener("change", onResize);
    narrow.addEventListener("change", onResize);

    const ro =
      stick && slot && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            if (canPin()) measure();
          })
        : null;
    if (ro && stick) ro.observe(stick);
    if (ro && slot) ro.observe(slot);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      reduce.removeEventListener("change", onResize);
      shortH.removeEventListener("change", onResize);
      narrow.removeEventListener("change", onResize);
      ro?.disconnect();
    };
  }, []);

  return <>{children}</>;
}
