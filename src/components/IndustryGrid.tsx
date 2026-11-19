"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import TypingText from "@/components/TypingText";

export type IndustryItem = {
  label: string;
  src: string;
  alt: string;
  description: string;
};

// Industry images with a label along the bottom edge. Hovering an image (or
// tapping it on touch screens, or pressing Enter on it) fades in a navy layer
// and types out its description once. Screen readers get the full
// description straight away.
export default function IndustryGrid({ items, className }: { items: IndustryItem[]; className?: string }) {
  const [active, setActive] = useState<number | null>(null);
  const [activation, setActivation] = useState(0); // restarts typing on each new activation
  const lastPointer = useRef("mouse");
  const baseId = useId();

  const open = (index: number) => {
    setActive(index);
    setActivation((n) => n + 1);
  };

  return (
    <section aria-labelledby={`${baseId}-title`} className={className}>
      {/* Section heading for search engines and screen readers (the images speak for themselves visually). */}
      <h2 id={`${baseId}-title`} className="sr-only">
        RFID asset tracking by industry
      </h2>
      {items.map((item, index) => {
        const isActive = active === index;
        const descriptionId = `${baseId}-${index}`;
        return (
          <button
            key={item.src}
            type="button"
            aria-label={item.label}
            aria-describedby={descriptionId}
            aria-expanded={isActive}
            onPointerDown={(e) => (lastPointer.current = e.pointerType)}
            onKeyDown={() => (lastPointer.current = "keyboard")}
            // Mouse: show while hovering.
            onPointerEnter={(e) => e.pointerType === "mouse" && open(index)}
            onPointerLeave={(e) => e.pointerType === "mouse" && setActive((cur) => (cur === index ? null : cur))}
            // Touch, pen and keyboard: toggle on tap / Enter.
            onClick={() => {
              if (lastPointer.current === "mouse") return;
              if (isActive) setActive(null);
              else open(index);
            }}
            // Frame: 1px slate border with slightly rounded corners and a 1px
            // white gap (padding) between the border and the image.
            className="block aspect-[1600/976] w-full rounded-lg border border-slate-300 bg-white p-px text-left outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
          >
            {/* Image area, inset by the gap; its corners follow the frame (8px - 1px border - 1px gap). */}
            <span className="@container relative block h-full w-full overflow-hidden rounded-[6px]">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 1536px) 366px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />

              {/* Navy layer that fades in behind the description. */}
              <span
                aria-hidden="true"
                className={`absolute inset-0 bg-[#0b1f45]/85 transition-opacity duration-300 ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              />

              {/*
                Description, typed out once per hover and centered in the image
                (in the area above the label, so the two never overlap). Text
                size scales with the image width.
              */}
              <span className="absolute inset-x-0 top-0 bottom-[calc(clamp(12px,4.5cqw,16px)+min(17px,5.8cqw)*1.25)] flex items-center justify-center px-[clamp(10px,4.5cqw,20px)] py-[clamp(4px,2.5cqw,12px)] text-center text-[clamp(11px,4.4cqw,15px)] leading-normal text-white/95">
                {isActive && <TypingText key={activation} text={item.description} />}
              </span>

              {/*
                Label on a soft navy fade (the banner's colour) along the bottom
                edge. Bold, up to 17px; text size and side padding scale with the
                image's width (cqw) so even the longest label stays on one line
                on the narrowest images.
              */}
              <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[#0b1f45]/90 via-[#0b1f45]/55 to-transparent px-[clamp(10px,4.5cqw,20px)] pt-12 pb-[clamp(12px,4.5cqw,16px)] text-[min(17px,5.8cqw)] leading-tight font-bold tracking-[0.08em] whitespace-nowrap text-white uppercase">
                {item.label}
              </span>
            </span>

            <span id={descriptionId} className="sr-only">
              {item.description}
            </span>
          </button>
        );
      })}
    </section>
  );
}
