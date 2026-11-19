"use client";

import { useEffect, useRef, useState } from "react";

export type Review = {
  name: string;
  email: string;
  phone: string;
  text: string;
};

// One colour scheme for every card: a muted champagne-gold border and rule,
// echoing the gold stars at the top of the card.
const CARD_BORDER = "border-[#c9a96e]";
const RULE_BG = "from-transparent via-[#c9a96e] to-transparent";

// Tilt (degrees) of the top card and the cards under it. The cards are the
// same size and stacked edge to edge; alternating small tilts make their
// corners stick out left and right in a zigzag, like a real stack of cards.
// Cards deeper than this list sit exactly under the last one.
const TILTS = [0, -4, 3.5, -2.5];
const FLY_MS = 320; // top card flying out to the side (or the bottom card coming out)
const SWIPE_PX = 80; // drag distance that sends the top card away
const DRAG_START_PX = 6;

// A stack of review cards: one card on top, the rest underneath like a deck.
// - Next (→ button, → key, or dragging/swiping the top card either way): the top
//   card flies off to the side and slides in at the bottom of the deck, and
//   every other card moves up one place.
// - Previous (← button / key): the bottom card comes out to the side and lands
//   on top.
// Visitors who prefer reduced motion get the same order changes without the fly-out.
export default function ReviewDeck({ reviews, className }: { reviews: Review[]; className?: string }) {
  const n = reviews.length;
  const [top, setTop] = useState(0); // index of the card on top (may grow/shrink past n; used modulo)
  // Card currently outside the deck: "out" = to the side above the deck (leaving),
  // "under" = to the side below the deck (about to come in on top).
  const [flying, setFlying] = useState<{ card: number; dir: number; layer: "out" | "under" } | null>(null);
  const [dragX, setDragX] = useState<number | null>(null);
  const press = useRef<{ x: number; id: number; active: boolean } | null>(null);
  const busy = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const mod = (i: number) => ((i % n) + n) % n;
  const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Top card leaves to `dir` (-1 left, 1 right) and goes to the bottom.
  const next = (dir = -1) => {
    if (busy.current || n < 2) return;
    const card = mod(top);
    setTop((t) => t + 1);
    if (reduced()) return;
    busy.current = true;
    setFlying({ card, dir, layer: "out" });
    timer.current = setTimeout(() => {
      setFlying(null); // now positioned at the bottom: slides in under the deck
      busy.current = false;
    }, FLY_MS);
  };

  // Bottom card comes out to the side (under the deck), then lands on top.
  const prev = () => {
    if (busy.current || n < 2) return;
    const card = mod(top - 1);
    if (reduced()) {
      setTop((t) => t - 1);
      return;
    }
    busy.current = true;
    setFlying({ card, dir: -1, layer: "under" });
    timer.current = setTimeout(() => {
      setTop((t) => t - 1);
      setFlying(null); // now the top card: slides in from the side
      busy.current = false;
    }, FLY_MS);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (busy.current || (e.pointerType === "mouse" && e.button !== 0)) return;
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
    }
    setDragX(dx);
  };
  const endPress = (e: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const p = press.current;
    if (p?.id !== e.pointerId) return;
    press.current = null;
    if (!p.active) return;
    const dx = cancelled ? 0 : e.clientX - p.x;
    setDragX(null);
    if (Math.abs(dx) >= SWIPE_PX) next(dx < 0 ? -1 : 1);
  };

  // Position of each card: depth 0 = top, then underneath, each tilted (see
  // TILTS); flying/dragged cards override.
  const cardStyle = (i: number): React.CSSProperties => {
    const depth = mod(i - top);
    const shown = Math.min(depth, TILTS.length - 1);
    const base = {
      transform: `rotate(${TILTS[shown]}deg)`,
      zIndex: n - depth,
      transition: "transform 450ms cubic-bezier(0.22, 1, 0.36, 1)",
    };
    if (flying?.card === i) {
      return {
        transform: `translateX(${flying.dir * 115}%) rotate(${flying.dir * 9}deg)`,
        zIndex: flying.layer === "out" ? n + 1 : 0,
        transition: `transform ${FLY_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      };
    }
    if (depth === 0 && dragX !== null) {
      return { ...base, transform: `translateX(${dragX}px) rotate(${dragX / 25}deg)`, transition: "none" };
    }
    return base;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") prev();
    else return;
    e.preventDefault();
  };

  const current = reviews[mod(top)];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer reviews (use the arrow buttons, the arrow keys or swipe the card)"
      tabIndex={0}
      onKeyDown={onKeyDown}
      // Previous button, deck, next button in a row; the buttons sit level with the deck's middle.
      className={`flex w-full max-w-[31.25rem] items-center justify-center gap-2 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-4 focus-visible:ring-offset-black sm:gap-5 ${className ?? ""}`}
    >
      <DeckButton label="Previous review" onClick={prev} path="M15 5l-7 7 7 7" />

      {/*
        Deck: all cards share one grid cell. The cards are tall, playing-card
        shaped (5:7), up to 340px wide, narrower on small phones so the buttons fit
        beside them; a card grows taller only if its text needs more room
        (then all cards match). Padding keeps the tilted corners inside the deck.
      */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => endPress(e, false)}
        onPointerCancel={(e) => endPress(e, true)}
        onDragStart={(e) => e.preventDefault()}
        className={`grid w-full max-w-[372px] min-w-0 flex-1 grid-cols-[minmax(0,1fr)] p-3 sm:p-4 touch-pan-y select-none ${
          dragX !== null ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <div aria-hidden="true" className="aspect-[5/7] [grid-area:1/1]" />
        {reviews.map((review, i) => {
          const isTop = mod(i - top) === 0;
          return (
            <article
              key={review.email}
              aria-hidden={!isTop || undefined}
              style={cardStyle(i)}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 bg-white px-4 py-6 text-center shadow-[0_18px_40px_-18px_rgb(0_0_0/0.7)] [grid-area:1/1] sm:px-7 sm:py-8 ${CARD_BORDER}`}
            >
              {/* Rating: large gold stars heading the card. */}
              <StarRating starClassName="size-7 sm:size-8" className="text-[28px] sm:text-[32px]" />
              <h3 className="mt-4 text-lg leading-tight font-bold text-neutral-950 sm:mt-5 sm:text-xl">{review.name}</h3>
              <p title={review.email} className="mt-1 max-w-full truncate text-xs text-slate-500 sm:text-sm">{review.email}</p>
              <p className="text-xs text-slate-500 sm:text-sm">{review.phone}</p>
              <span aria-hidden="true" className={`mt-4 h-0.5 w-12 shrink-0 rounded-full bg-linear-to-r ${RULE_BG}`} />
              <blockquote className="mt-4 text-[14px] leading-relaxed text-slate-700 sm:text-[15px]">
                “{review.text}”
              </blockquote>
            </article>
          );
        })}
      </div>

      <DeckButton label="Next review" onClick={() => next()} path="M9 5l7 7-7 7" />

      {/* Announces the new top card to screen readers. */}
      <p aria-live="polite" className="sr-only">
        Review {mod(top) + 1} of {n}: {current.name}
      </p>
    </div>
  );
}

function DeckButton({ label, onClick, path }: { label: string; onClick: () => void; path: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="relative z-10 flex size-10 shrink-0 cursor-pointer items-center sm:size-11 justify-center rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur-sm transition duration-200 outline-none hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-sky-400 active:scale-90"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d={path} />
      </svg>
    </button>
  );
}

// The five-star rating at the top of each review card: a row of gold stars
// with a faint warm shadow so they read as the card's emblem. `starClassName`
// sets the star size; the gap scales with it.
export function StarRating({ starClassName, className }: { starClassName: string; className?: string }) {
  return (
    <div
      aria-label="5 out of 5 stars"
      role="img"
      className={`flex shrink-0 items-center justify-center gap-[0.2em] text-amber-400 drop-shadow-[0_2px_3px_rgb(180_120_20/0.3)] ${className ?? ""}`}
    >
      {Array.from({ length: 5 }, (_, s) => (
        <Star key={s} className={starClassName} />
      ))}
    </div>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96L12 2.5z" />
    </svg>
  );
}
