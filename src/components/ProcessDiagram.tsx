// "How we work" as a process diagram (About Us page). A condensed, visual
// version of the six steps described in full on the home page.
// - Desktop (1024px+): three phase brackets (Discover / Deliver / Support)
//   over a horizontal track with six numbered icon nodes, each with a short
//   title and one-line summary below. A soft light travels along the track.
// - Phones and tablets: a vertical timeline, the phase name shown as a small
//   label before the first step of each phase.

type Step = { title: string; summary: string; icon: string; phase?: string };

const STEPS: Step[] = [
  {
    phase: "Discover",
    title: "Order & Enquiry",
    summary: "Reach us through the website or contact us directly.",
    icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zM8 9h8M8 13h5",
  },
  {
    title: "Consultation",
    summary: "We learn your needs, goals and intended applications.",
    icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  },
  {
    title: "On-Site Assessment",
    summary: "If required, we review your site and existing infrastructure.",
    icon: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  },
  {
    phase: "Deliver",
    title: "Recommendation",
    summary: "The right tags, readers, printers and solutions for the job.",
    icon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96 12 12.01l8.73-5.05M12 22.08V12",
  },
  {
    title: "Installation & Integration",
    summary: "Equipment set-up, software configuration and integration.",
    icon: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  },
  {
    phase: "Support",
    title: "Testing & Support",
    summary: "We check everything works and stay on hand afterwards.",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4",
  },
];

// Phase brackets on desktop: how many steps (columns) each spans, and the
// bracket inset so it runs from the centre of its first node to the centre of
// its last (half a column on each side; columns are 24px apart). A single-step
// phase gets a short bracket centred on its node.
const PHASES = [
  { name: "Discover", span: "col-span-3", inset: "mx-[calc((100%-48px)/6)]" },
  { name: "Deliver", span: "col-span-2", inset: "mx-[calc((100%-24px)/4)]" },
  { name: "Support", span: "col-span-1", inset: "mx-[25%]" },
];

// Light travelling along the desktop track (every 5s); off for reduced motion.
const CSS = `
@keyframes rfdsl-track-pulse { 0% { left: -12%; opacity: 0; } 10% { opacity: 1; } 70% { opacity: 1; } 80%, 100% { left: 100%; opacity: 0; } }
.rfdsl-track-pulse { animation: rfdsl-track-pulse 5s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .rfdsl-track-pulse { animation: none; opacity: 0; } }
`;

export default function ProcessDiagram() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0b1f45] px-6 py-10 sm:px-8 md:px-10 lg:px-12 lg:py-14">
      <style>{CSS}</style>
      {/* Background: soft blue glows and a faint dot grid. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgb(56_189_248/0.16),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgb(37_99_235/0.28),transparent_60%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1px)] [background-size:22px_22px]"
      />

      <div className="relative">
        <p className="text-[clamp(15px,1.15vw,17px)] text-white/70">
          Six steps from your first enquiry to ongoing support.
        </p>

        {/* Phase brackets (desktop). */}
        <div aria-hidden="true" className="mt-10 hidden grid-cols-6 gap-6 lg:grid">
          {PHASES.map((p) => (
            <div key={p.name} className={`${p.span} text-center`}>
              <span className="text-xs font-semibold tracking-[0.2em] text-sky-300 uppercase">{p.name}</span>
              <span className={`${p.inset} mt-3 block h-2.5 rounded-t-md border-x border-t border-white/25`} />
            </div>
          ))}
        </div>

        <ol className="relative mt-8 grid grid-cols-1 gap-8 lg:mt-6 lg:grid-cols-6 lg:gap-6">
          {/* Connecting track on desktop (through the node centres). */}
          <span
            aria-hidden="true"
            className="absolute top-8 right-[calc(100%/12)] left-[calc(100%/12)] hidden h-px -translate-y-1/2 overflow-hidden bg-linear-to-r from-sky-400/70 via-blue-500/60 to-sky-300/70 lg:block"
          >
            <span className="rfdsl-track-pulse absolute top-0 h-px w-[12%] bg-linear-to-r from-transparent via-white to-transparent" />
          </span>

          {STEPS.map((step, i) => (
            <li key={step.title} className="relative flex gap-5 lg:flex-col lg:items-center lg:gap-0 lg:text-center">
              {/* Phones: line from this node down to the next (none after the last). */}
              {i < STEPS.length - 1 && (
                <span aria-hidden="true" className="absolute top-8 -bottom-8 left-8 w-px -translate-x-1/2 bg-linear-to-b from-sky-400/70 to-blue-500/60 lg:hidden" />
              )}
              {/* Node: icon in a navy circle with a sky ring; step number badge. */}
              <span className="relative z-10 flex size-16 shrink-0 items-center justify-center rounded-full bg-[#0f2a5c] text-sky-200 shadow-[0_0_0_6px_rgb(11_31_69),0_10px_30px_-8px_rgb(56_189_248/0.45)] ring-2 ring-sky-400/60">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="size-7">
                  <path d={step.icon} />
                </svg>
                <span className="absolute -top-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#0b1f45] tabular-nums shadow">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
              <div className="pt-1 lg:pt-0">
                {step.phase && (
                  <span className="mb-2 inline-block rounded-full border border-sky-300/40 px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.18em] text-sky-300 uppercase lg:hidden">
                    {step.phase}
                  </span>
                )}
                <h3 className="text-base leading-snug font-semibold text-white lg:mt-5">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/65">{step.summary}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
