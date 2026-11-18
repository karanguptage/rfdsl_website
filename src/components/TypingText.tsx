"use client";

import { useEffect, useState } from "react";

// Typing speed: ~29 characters per second, about reading pace, so the text can
// be followed as it appears (~6s for a 170-character description).
const MS_PER_CHAR = 35;

// Types `text` out once, from the moment it mounts. Remounting it (via a new
// `key`) starts the typing again. The untyped remainder is rendered invisibly
// so the block keeps its final size and lines never jump while typing.
// Visitors who prefer reduced motion see the whole text at once.
export default function TypingText({ text }: { text: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      frame = requestAnimationFrame(() => setCount(text.length));
      return () => cancelAnimationFrame(frame);
    }
    const start = performance.now();
    const tick = (now: number) => {
      const typed = Math.min(text.length, Math.floor((now - start) / MS_PER_CHAR));
      setCount(typed);
      if (typed < text.length) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text]);

  const typing = count < text.length;
  return (
    <span aria-hidden="true">
      {text.slice(0, count)}
      {typing && (
        // Letter-height box aligned to the text, so the cursor sits beside the letters.
        <span className="relative inline-block h-[1.1em] w-0 align-[-0.2em]">
          <span className="absolute inset-y-0 -left-px w-[2px] animate-pulse bg-sky-300" />
        </span>
      )}
      <span className="invisible">{text.slice(count)}</span>
    </span>
  );
}
