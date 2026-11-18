"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import TypingText from "@/components/TypingText";

export type Product = {
  name: string;
  src: string;
  href: string; // product page, opened by a click or tap
  description?: string; // typed out over the image on hover
};

const STEP_EVERY_MS = 3000; // time between automatic moves
const SLIDE_MS = 700; // duration of each move
const DRAG_START_PX = 6; // pointer movement before a press counts as a drag (shorter = a click)
const FLICK_PX = 40; // a drag shorter than one panel but longer than this still moves one panel

// Auto-advancing, draggable product row. Shows 1 panel below 450px, 2 from
// 450px, 3 from 600px and 4 from 1250px; every few seconds the row glides one
// panel to the left, looping seamlessly in both directions.
// - Drag with the mouse or swipe with a finger to move it either way; on
//   release it settles on the nearest panel. Vertical swipes still scroll the page.
// - Each panel links to its product page: a click or tap opens it, while a
//   drag or swipe only moves the row. Hovering (or keyboard focus) fades in a
//   navy tint over the image and types the description out once, exactly like
//   the industry images above.
// - Arrow keys step through it when it has keyboard focus; tabbing to a
//   product slides it into view.
// - It pauses while hovered by a mouse, while it has keyboard focus, while
//   dragging and while the tab is hidden, and never moves on its own for
//   visitors who prefer reduced motion.
export default function ProductCarousel({ products, className }: { products: Product[]; className?: string }) {
  const count = products.length;
  // The products are rendered three times in a row and the view stays within
  // the middle copy, so there is always content on both sides while moving or
  // dragging. After each move it is shifted back into the middle copy unseen.
  const slides = [...products, ...products, ...products];
  const toMiddle = (i: number) => (((i % count) + count) % count) + count;

  const [index, setIndex] = useState(count); // first visible slide
  const [animate, setAnimate] = useState(true);
  const [dragPx, setDragPx] = useState<number | null>(null); // offset while dragging
  const [hovered, setHovered] = useState(false);
  const [focusedWithin, setFocusedWithin] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  // Panel showing its description, and a counter that restarts the typing on each new hover/focus.
  const [activeSlide, setActiveSlide] = useState<number | null>(null);
  const [activation, setActivation] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // Current press: `active` turns true once it has moved far enough to be a drag.
  const press = useRef<{ x: number; pointerId: number; active: boolean } | null>(null);
  const suppressClick = useRef(false); // swallow the click that follows a drag
  const baseId = useId();
  const dragging = dragPx !== null;

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Automatic moves; the timer restarts after hovering, focus or dragging ends.
  useEffect(() => {
    if (hovered || focusedWithin || tabHidden || dragging) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      setAnimate(true);
      setIndex((i) => i + 1);
    }, STEP_EVERY_MS);
    return () => clearInterval(timer);
  }, [hovered, focusedWithin, tabHidden, dragging]);

  const move = (panels: number) => {
    setAnimate(true);
    setIndex((i) => i + panels);
  };

  // After a move ends, shift back into the middle copy without animation.
  const onTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    if (index < count || index >= 2 * count) {
      setAnimate(false);
      setIndex(toMiddle(index));
    }
  };

  // Distance between the starts of two neighbouring panels (panel + gap), in px.
  const stepPx = () => {
    const [a, b] = trackRef.current?.children ?? [];
    return a && b ? b.getBoundingClientRect().left - a.getBoundingClientRect().left : 1;
  };

  // A press only becomes a drag once it moves a few pixels; until then it is a
  // normal click on the product link. The pointer is captured only for real
  // drags, so plain clicks still reach the link.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    press.current = { x: e.clientX, pointerId: e.pointerId, active: false };
    suppressClick.current = false;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = press.current;
    if (p?.pointerId !== e.pointerId) return;
    const dx = e.clientX - p.x;
    if (!p.active) {
      if (Math.abs(dx) < DRAG_START_PX) return;
      p.active = true;
      suppressClick.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      setAnimate(false);
      setIndex((i) => toMiddle(i));
    }
    setDragPx(dx);
  };

  // Release: settle on the nearest panel (a short flick still moves one).
  // A cancelled gesture (e.g. the page started scrolling vertically) springs back.
  const endPress = (e: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const p = press.current;
    if (p?.pointerId !== e.pointerId) return;
    press.current = null;
    if (!p.active) return; // a plain click: let the link handle it
    const dx = cancelled ? 0 : e.clientX - p.x;
    let panels = Math.round(-dx / stepPx());
    if (panels === 0 && Math.abs(dx) > FLICK_PX) panels = dx < 0 ? 1 : -1;
    setDragPx(null);
    move(panels);
  };

  // Don't open a product page at the end of a drag.
  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClick.current) return;
    suppressClick.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  const showDescription = (slide: number) => {
    setActiveSlide(slide);
    setActivation((n) => n + 1);
  };
  const hideDescription = (slide: number) => setActiveSlide((cur) => (cur === slide ? null : cur));

  // Keyboard focus on a product that is out of view: slide it into view.
  const revealSlide = (slide: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollLeft = 0; // undo the browser's own scroll-into-view inside the clipped row
    const visible = Math.max(1, Math.round(viewport.clientWidth / stepPx()));
    const current = toMiddle(index);
    if (slide < current || slide >= current + visible) {
      setAnimate(true);
      setIndex(slide < current ? slide : slide - visible + 1);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") move(1);
    else if (e.key === "ArrowLeft") move(-1);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={viewportRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Popular products (drag, swipe or use the arrow keys)"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onFocus={() => setFocusedWithin(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocusedWithin(false)}
      // Hover pause is for a real mouse only (taps on touch screens also fire "enter").
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={(e) => endPress(e, false)}
      onPointerCancel={(e) => endPress(e, true)}
      onClickCapture={onClickCapture}
      onDragStart={(e) => e.preventDefault()}
      // --n: panels visible at once by window width: 1 below 450px, 2 from 450px,
      // 3 from 600px, 4 from 1250px. --gap: space between panels (matches the industry images).
      // touch-pan-y: the browser keeps vertical scrolling, horizontal swipes drag the row.
      className={`touch-pan-y overflow-hidden rounded-lg outline-none select-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-4 [--gap:16px] [--n:1] min-[450px]:[--n:2] min-[600px]:[--n:3] lg:[--gap:24px] min-[1250px]:[--n:4] ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      } ${className ?? ""}`}
    >
      <div
        ref={trackRef}
        onTransitionEnd={onTransitionEnd}
        className="flex gap-(--gap)"
        style={{
          // One step = one panel width + one gap; while dragging, follow the pointer.
          transform: `translateX(calc(${-index} * (100% + var(--gap)) / var(--n) + ${dragPx ?? 0}px))`,
          transition: animate && !dragging ? `transform ${SLIDE_MS}ms cubic-bezier(0.65, 0, 0.35, 1)` : "none",
        }}
      >
        {slides.map((product, i) => {
          const isCopy = i < count || i >= 2 * count;
          const descriptionId = `${baseId}-${i}`;
          const isActive = activeSlide === i;
          return (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={isCopy ? undefined : `${i - count + 1} of ${count}: ${product.name}`}
              aria-hidden={isCopy || undefined}
              className="shrink-0 basis-[calc((100%-(var(--n)-1)*var(--gap))/var(--n))]"
            >
              {/* Frame (1px slate border, 1px white gap, slightly rounded corners) linking to the product page. */}
              <Link
                href={product.href}
                prefetch={false}
                draggable={false}
                tabIndex={isCopy ? -1 : undefined}
                aria-label={product.name}
                aria-describedby={product.description && !isCopy ? descriptionId : undefined}
                // Mouse hover / keyboard focus show the description; a tap on touch screens opens the page.
                onPointerEnter={(e) => e.pointerType === "mouse" && showDescription(i)}
                onPointerLeave={(e) => e.pointerType === "mouse" && hideDescription(i)}
                onFocus={() => {
                  if (isCopy) return;
                  revealSlide(i);
                  showDescription(i);
                }}
                onBlur={() => hideDescription(i)}
                className="block rounded-lg border border-slate-300 bg-white p-px outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
              >
                <div className="overflow-hidden rounded-[6px] bg-white">
                  {/* Product photo, centered on white and never cropped. */}
                  <div className="@container relative aspect-square">
                    <Image
                      src={product.src}
                      alt={isCopy ? "" : product.name}
                      fill
                      draggable={false}
                      sizes="(min-width: 1536px) 366px, (min-width: 1250px) 25vw, (min-width: 600px) 33vw, (min-width: 450px) 50vw, 100vw"
                      className="object-contain p-[10%]"
                    />
                    {/*
                      Description, as on the industry images: a navy tint fades
                      in over the photo and the text types out once per hover,
                      centered in white. Text size and padding scale with the
                      panel width. Screen readers get the full text straight away.
                    */}
                    {product.description && (
                      <>
                        <span
                          aria-hidden="true"
                          className={`absolute inset-0 bg-[#0b1f45]/85 transition-opacity duration-300 ${
                            isActive ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        <span className="absolute inset-0 flex items-center justify-center p-[clamp(10px,7cqw,28px)] text-center text-[clamp(12px,4.6cqw,16px)] leading-[1.45] text-white/95">
                          {isActive && <TypingText key={activation} text={product.description} />}
                        </span>
                        <span id={descriptionId} className="sr-only">
                          {product.description}
                        </span>
                      </>
                    )}
                  </div>
                  {/* Name strip: black background, white text. */}
                  <p className="bg-black px-3 py-3 text-center text-[15px] font-semibold tracking-tight text-white lg:py-4 lg:text-base">
                    {product.name}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
