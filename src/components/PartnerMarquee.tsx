import Image from "next/image";

// Partner logos (public/partners, all 298x77 on white).
const PARTNERS = [
  { name: "Chainway", src: "/partners/chainway.png" },
  { name: "Digital Matter", src: "/partners/digital.png" },
  { name: "Durabook", src: "/partners/durabook.png" },
  { name: "HID", src: "/partners/hid.png" },
  { name: "Invengo", src: "/partners/invengo.png" },
  { name: "Omni-ID", src: "/partners/omni-id.png" },
  { name: "Tellen", src: "/partners/tellen.png" },
  { name: "TrackSeal", src: "/partners/trackseal.png" },
];

// The logos are rendered twice in one long row that slides left by exactly
// half its width, then starts again: a seamless, endless flow (about 4s per
// logo). Each logo carries its own right spacing so both halves are identical.
// Visitors who prefer reduced motion see the logos as a still, centred,
// wrapping row instead.
const CSS = `
@keyframes rfdsl-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.rfdsl-marquee { animation: rfdsl-marquee 34s linear infinite; }
.rfdsl-marquee-wrap:hover .rfdsl-marquee { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) {
  .rfdsl-marquee { animation: none; flex-wrap: wrap; justify-content: center; width: 100%; row-gap: 24px; }
  .rfdsl-marquee-copy { display: none; }
}
`;

// Endless flowing row of partner logos. Logos are greyscale and slightly
// faded so they read as one calm band; hovering a logo shows it in full
// colour, and hovering the row pauses it. The ends fade out softly.
export default function PartnerMarquee() {
  const row = (copy: boolean) =>
    PARTNERS.map((p) => (
      <li
        key={(copy ? "copy-" : "") + p.name}
        aria-hidden={copy || undefined}
        className={`shrink-0 pr-12 lg:pr-16 ${copy ? "rfdsl-marquee-copy" : ""}`}
      >
        <Image
          src={p.src}
          alt={copy ? "" : `${p.name} logo`}
          width={298}
          height={77}
          sizes="232px"
          // Load straight away: logos waiting off to the right would otherwise load lazily and scroll in blank.
          loading="eager"
          className="h-12 w-auto opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 sm:h-14 lg:h-[60px]"
        />
      </li>
    ));

  return (
    <div className="rfdsl-marquee-wrap overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <style>{CSS}</style>
      <ul aria-label="Our partners" className="rfdsl-marquee flex w-max items-center">
        {row(false)}
        {row(true)}
      </ul>
    </div>
  );
}
