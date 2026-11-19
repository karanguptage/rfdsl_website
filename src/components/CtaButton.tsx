// Call-to-action button used on dark banners (home "Get a quote", About Us
// "Contact Us"): black pill with a crisp white border and a faint white halo,
// the arrow in a white circle. A soft light sweeps across it every 4s to catch
// the eye (not for reduced motion). On hover it inverts to white with black
// text and the arrow slides right. `className` sets its outer spacing;
// `ringOffset` matches the focus-ring gap to the background behind it.

const CTA_CSS = `
@keyframes rfdsl-cta-shine {
  0% { transform: translateX(-120%) skewX(-20deg); }
  30%, 100% { transform: translateX(420%) skewX(-20deg); }
}
.rfdsl-cta-shine { transform: translateX(-120%) skewX(-20deg); animation: rfdsl-cta-shine 4s ease-in-out 1s infinite; }
@media (prefers-reduced-motion: reduce) { .rfdsl-cta-shine { animation: none; opacity: 0; } }
`;

export default function CtaButton({
  href,
  children,
  className,
  ringOffset = "focus-visible:ring-offset-[#0b1f45]",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  ringOffset?: string;
}) {
  return (
    <>
      <style>{CTA_CSS}</style>
      <a
        href={href}
        className={`group pointer-events-auto relative inline-flex h-12 shrink-0 items-center gap-4 overflow-hidden rounded-full border-[1.5px] border-white bg-black pr-1.5 pl-6 text-[15px] font-semibold tracking-[0.02em] text-white shadow-[0_0_0_5px_rgb(255_255_255/0.07),0_14px_34px_-12px_rgb(0_0_0/0.9)] transition-colors duration-300 outline-none hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-4 active:scale-[0.98] lg:h-14 lg:gap-5 lg:pr-2 lg:pl-8 lg:text-base ${ringOffset} ${className ?? ""}`}
      >
        <span aria-hidden="true" className="rfdsl-cta-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-white/25 to-transparent" />
        <span className="relative">{children}</span>
        <span className="relative flex size-9 items-center justify-center rounded-full bg-white text-black transition-colors duration-300 group-hover:bg-black group-hover:text-white lg:size-10">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" className="size-[18px] transition-transform duration-300 group-hover:translate-x-0.5">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </a>
    </>
  );
}
