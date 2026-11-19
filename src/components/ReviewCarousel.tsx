"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Star, type Review } from "@/components/ReviewDeck";

const STEP_EVERY_MS = 4000; // time between automatic moves
const SLIDE_MS = 700; // duration of each move
const DRAG_START_PX = 6; // movement before a press counts as a drag
const FLICK_PX = 40; // a short drag past this still moves one card

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

// Customer reviews as a looping row of cards (About Us page).
// - Cards visible at once: 5 from 1280px, 4 from 1100px, 3 from 900px, 2 from
//   640px, 1 on small phones. Every few seconds the row moves one card left.
// - Previous / next buttons (top right, beside the title), arrow keys when
//   focused, and drag / swipe either way; it settles on the nearest card.
// - Pauses while hovered, focused, dragged or the tab is hidden; never moves on
//   its own for visitors who prefer reduced motion.
// Cards: white with the same slate border as the other panels. Rows: a large
// centred avatar (photo or navy initials), then name, email and phone, the five
// stars, and the review below a thin divider.
export default function ReviewCarousel({ reviews, title }: { reviews: Review[]; title: React.ReactNode }) {
  const count = reviews.length;
  // Rendered three times; the view stays in the middle copy so there is always
  // content on both sides, and is shifted back there unseen after each move.
  const slides = [...reviews, ...reviews, ...reviews];
  const toMiddle = (i: number) => (((i % count) + count) % count) + count;

  const [index, setIndex] = useState(count);
  const [animate, setAnimate] = useState(true);
  const [dragPx, setDragPx] = useState<number | null>(null);
  const [paused, setPaused] = useState({ hover: false, focus: false, hidden: false });
  const trackRef = useRef<HTMLDivElement>(null);
  const press = useRef<{ x: number; id: number; active: boolean } | null>(null);
  const dragging = dragPx !== null;

  useEffect(() => {
    const onVisibility = () => setPaused((p) => ({ ...p, hidden: document.hidden }));
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (paused.hover || paused.focus || paused.hidden || dragging) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      setAnimate(true);
      setIndex((i) => i + 1);
    }, STEP_EVERY_MS);
    return () => clearInterval(timer);
  }, [paused, dragging]);

  // Stops at the ends of the three copies if clicks come faster than the shift back.
  const move = (cards: number) => {
    setAnimate(true);
    setIndex((i) => {
      const next = i + cards;
      return next < 0 || next > 3 * count - 5 ? i : next;
    });
  };

  const onTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    if (index < count || index >= 2 * count) {
      setAnimate(false);
      setIndex(toMiddle(index));
    }
  };

  const stepPx = () => {
    const [a, b] = trackRef.current?.children ?? [];
    return a && b ? b.getBoundingClientRect().left - a.getBoundingClientRect().left : 1;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    press.current = { x: e.clientX, id: e.pointerId, active: false };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = press.current;
    if (p?.id !== e.pointerId) return;
    const dx = e.clientX - p.x;
    if (!p.active) {
      if (Math.abs(dx) < DRAG_START_PX) return;
      p.active = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      setAnimate(false);
      setIndex((i) => toMiddle(i));
    }
    setDragPx(dx);
  };
  const endPress = (e: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const p = press.current;
    if (p?.id !== e.pointerId) return;
    press.current = null;
    if (!p.active) return;
    const dx = cancelled ? 0 : e.clientX - p.x;
    let cards = Math.round(-dx / stepPx());
    if (cards === 0 && Math.abs(dx) > FLICK_PX) cards = dx < 0 ? 1 : -1;
    setDragPx(null);
    move(cards);
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer reviews (use the arrow buttons, the arrow keys or swipe)"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") move(1);
        else if (e.key === "ArrowLeft") move(-1);
        else return;
        e.preventDefault();
      }}
      onFocus={() => setPaused((p) => ({ ...p, focus: true }))}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setPaused((p) => ({ ...p, focus: false }))}
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused((p) => ({ ...p, hover: true }))}
      onPointerLeave={(e) => e.pointerType === "mouse" && setPaused((p) => ({ ...p, hover: false }))}
    >
      {/* Title row: title, fading hairline, previous / next buttons. */}
      <div className="flex items-end gap-6">
        {title}
        <span aria-hidden="true" className="mb-[0.9em] hidden h-px flex-1 bg-linear-to-r from-slate-300 to-transparent sm:block" />
        <div className="ml-auto flex shrink-0 gap-2 pb-1 sm:ml-0">
          <RowButton label="Previous reviews" onClick={() => move(-1)} path="M15 5l-7 7 7 7" />
          <RowButton label="Next reviews" onClick={() => move(1)} path="M9 5l7 7-7 7" />
        </div>
      </div>

      <div
        tabIndex={0}
        aria-label="Review cards"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => endPress(e, false)}
        onPointerCancel={(e) => endPress(e, true)}
        onDragStart={(e) => e.preventDefault()}
        // p-px: 1px of room on every side, so the outer cards' 1px borders are never
        // clipped when the row stops at a fractional pixel position.
        className={`mt-8 touch-pan-y overflow-hidden rounded-lg p-px outline-none select-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-4 lg:mt-10 [--gap:16px] [--n:1] min-[640px]:[--n:2] min-[900px]:[--n:3] min-[1100px]:[--n:4] min-[1280px]:[--n:5] lg:[--gap:20px] ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <div
          ref={trackRef}
          onTransitionEnd={onTransitionEnd}
          className="flex gap-(--gap)"
          style={{
            transform: `translateX(calc(${-index} * (100% + var(--gap)) / var(--n) + ${dragPx ?? 0}px))`,
            transition: animate && !dragging ? `transform ${SLIDE_MS}ms cubic-bezier(0.65, 0, 0.35, 1)` : "none",
          }}
        >
          {slides.map((review, i) => {
            const isCopy = i < count || i >= 2 * count;
            return (
              <article
                key={i}
                aria-hidden={isCopy || undefined}
                aria-roledescription="slide"
                aria-label={isCopy ? undefined : `${i - count + 1} of ${count}: ${review.name}`}
                className="flex min-w-0 shrink-0 basis-[calc((100%-(var(--n)-1)*var(--gap))/var(--n))] flex-col rounded-lg border border-slate-300 bg-white p-5 lg:p-6"
              >
                {/* Row 1: avatar on its own, large and centred (photo, or navy initials). */}
                <span className="relative flex size-[72px] shrink-0 items-center justify-center self-center overflow-hidden rounded-full bg-linear-to-br from-[#1e3a6e] to-[#0b1f45] text-2xl font-bold text-white shadow-[0_10px_24px_-12px_rgb(11_31_69/0.6)] ring-4 ring-white outline outline-1 outline-offset-4 outline-slate-300 lg:size-20">
                  {review.photo ? (
                    <Image src={review.photo} alt="" fill sizes="80px" draggable={false} className="object-cover" />
                  ) : (
                    initials(review.name)
                  )}
                </span>
                {/* Row 2: name, email and phone. */}
                <div className="mt-5 min-w-0 text-center">
                  <h3 className="truncate text-base leading-tight font-bold text-neutral-950">{review.name}</h3>
                  <p title={review.email} className="mt-1 truncate text-xs text-slate-500">
                    {review.email}
                  </p>
                  <p className="text-xs text-slate-500">{review.phone}</p>
                </div>
                {/* Row 3: rating. */}
                <div aria-label="5 out of 5 stars" role="img" className="mt-4 flex justify-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }, (_, s) => (
                    <Star key={s} className="size-5" />
                  ))}
                </div>
                {/* Row 4: the review. */}
                <blockquote className="mt-4 border-t border-slate-200 pt-4 text-sm leading-relaxed text-slate-700">
                  “{review.text}”
                </blockquote>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RowButton({ label, onClick, path }: { label: string; onClick: () => void; path: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white text-neutral-800 transition-colors outline-none hover:border-[#0b1f45] hover:bg-[#0b1f45] hover:text-white focus-visible:ring-2 focus-visible:ring-sky-400 active:scale-95"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" className="size-[18px]">
        <path d={path} />
      </svg>
    </button>
  );
}
