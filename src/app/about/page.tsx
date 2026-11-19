import type { Metadata } from "next";
import Image from "next/image";
import HeroMesh from "@/components/HeroMesh";
import ContactColumn, { CONTACT_DETAILS } from "@/components/ContactColumn";
import CtaButton from "@/components/CtaButton";
import PartnerMarquee from "@/components/PartnerMarquee";
import ProcessDiagram from "@/components/ProcessDiagram";
import ReviewCarousel from "@/components/ReviewCarousel";
import { REVIEWS } from "@/content/reviews";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "RF Data Systems is an Auckland-based digital identification company providing RFID tags, labels, Bluetooth beacons, GPS devices, data-capture hardware and software.",
  alternates: { canonical: "/about" },
};

// Key people shown under the banner.
// PLACEHOLDER CONTENT: fictional names and roles until the real team details
// are available. To show a photo, put it in public/team/ and add e.g.
// photo: "/team/james.jpg" (square photos work best); initials show without one.
type TeamMember = { name: string; role: string; photo?: string };
const TEAM: TeamMember[] = [
  { name: "James Whitfield", role: "Managing Director" },
  { name: "Sophie Tan", role: "Operations Manager" },
  { name: "Rawiri Parata", role: "Technical Lead, RFID Solutions" },
  { name: "Emily Carter", role: "Sales & Customer Success Manager" },
];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function AboutPage() {
  return (
    <main className="flex-1">
      {/*
        About banner, like the home page's: full page width (up to 1536px, no
        side space on phones), layered bottom to top: black background, a faint
        Auckland skyline, the live node network, then the text. The banner is
        at least as tall as the home banner and grows to fit the text.
      */}
      <section aria-labelledby="about-title" className="relative mt-4 overflow-hidden bg-black lg:mt-9">
        <Image
          src="/images/auckland.jpg"
          alt=""
          fill
          preload
          sizes="(min-width: 1536px) 1536px, 100vw"
          className="object-cover object-[50%_60%] opacity-[0.16]"
        />
        {/* Darker towards the text side so it always reads clearly. */}
        <span aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent" />
        <HeroMesh />

        {/* Text (above the network; lets pointer effects pass through). */}
        <div className="pointer-events-none relative z-10 flex min-h-[clamp(300px,26vw,420px)] items-center px-6 py-12 md:px-10 md:py-14 lg:px-16">
          <div className="@container w-full">
            <span aria-hidden="true" className="block h-1 w-12 rounded-full bg-[#ecd590]" />
            <h1
              id="about-title"
              className="mt-6 text-[min(3.25rem,9.6cqw)] leading-none font-extrabold whitespace-nowrap tracking-[-0.01em] text-black drop-shadow-[0_2px_16px_rgb(0_0_0/0.9)] [-webkit-text-stroke:3px_#fff] [paint-order:stroke_fill]"
            >
              RF Data Systems Ltd
            </h1>

            {/* Body text: one style for every line (same size, regular weight, solid white). */}
            <p className="mt-7 text-[clamp(14px,1.05vw,16px)] leading-relaxed font-normal text-white">
              RF Data is a digital identification solutions company that provides a wide range of solutions that
              optimize labor and supply chain efficiency, reduce waste, and advance sustainability using electronic
              tracking equipment and software.
            </p>
            <p className="mt-4 text-[clamp(14px,1.05vw,16px)] leading-relaxed font-normal text-white">
              Our products and solutions include labeling, radio frequency identification (RFID) inlays and tags,
              Bluetooth beacons, GPS devices, and both RFID and active hardware for data capture.
            </p>
            <p className="mt-4 text-[clamp(14px,1.05vw,16px)] leading-relaxed font-normal text-white">
              We offer a broad range of software applications that bridge the physical and digital worlds, along with
              various products and solutions designed to enhance business processes—for both large and small
              organizations.
            </p>

            {/*
              One line on standard screens: on the left the location, phone and
              email (each with a round icon; phone and email are links), on the
              right the "Contact Us" button (styled like the home banner's "Get a
              quote"; scrolls down to the Contact Us form). Items wrap onto a
              second line when there isn't room; stacked on phones.
            */}
            <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[clamp(14px,1.05vw,16px)] text-white">
                <p className="inline-flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/30">
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className="size-[18px]">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                    </svg>
                  </span>
                  Our team is based on the North Shore in Auckland.
                </p>
                {CONTACT_DETAILS.filter((d) => d.label !== "Address").map((d) => (
                  <a
                    key={d.label}
                    href={d.href}
                    className="group pointer-events-auto inline-flex items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/30 transition-colors group-hover:bg-white group-hover:text-black">
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className="size-[18px]">
                        <path d={d.icon} />
                      </svg>
                    </span>
                    <span>
                      <span className="sr-only">{d.label}: </span>
                      <span className="underline-offset-4 group-hover:underline">{d.value}</span>
                    </span>
                  </a>
                ))}
              </div>
              <CtaButton href="#contact" ringOffset="focus-visible:ring-offset-black" className="self-start lg:self-auto">
                Contact Us
              </CtaButton>
            </div>
          </div>
        </div>
      </section>

      {/*
        Team: plain black title, then four
        people, each a round avatar (photo, or initials on navy) with their
        name and position below. Four in a row from 768px, two per row on
        phones. Same section gap and side alignment as the panel below.
      */}
      <section
        aria-labelledby="team-title"
        className="mt-8 md:mt-12 lg:mt-16 @max-[1537px]/page:px-6 @max-[640px]/page:px-4"
      >
        <div className="flex items-end gap-8">
          <div>
            <h2
              id="team-title"
              className="text-[clamp(1.75rem,3vw,2.75rem)] leading-tight font-bold tracking-[-0.02em] text-neutral-950"
            >
              Meet our team
            </h2>
          </div>
          <span aria-hidden="true" className="mb-[0.9em] hidden h-px flex-1 bg-linear-to-r from-slate-300 to-transparent sm:block" />
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6 lg:mt-10">
          {TEAM.map((person) => (
            <li key={person.name} className="flex flex-col items-center text-center">
              {/* Avatar: white ring and a thin slate outline, like the framed images elsewhere. */}
              <span className="relative flex size-28 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#1e3a6e] to-[#0b1f45] text-3xl font-bold tracking-wide text-white shadow-[0_12px_30px_-12px_rgb(11_31_69/0.55)] ring-4 ring-white outline outline-1 outline-offset-4 outline-slate-300 sm:size-32 lg:size-40 lg:text-4xl">
                {person.photo ? (
                  <Image src={person.photo} alt={person.name} fill sizes="160px" className="object-cover" />
                ) : (
                  <span aria-hidden="true">{initials(person.name)}</span>
                )}
              </span>
              <h3 className="mt-6 text-lg leading-tight font-bold text-neutral-950 lg:text-xl">{person.name}</h3>
              <p className="mt-1.5 text-[15px] leading-snug text-slate-600">{person.role}</p>
            </li>
          ))}
        </ul>
      </section>

      {/*
        How we work: the six steps from the home page, shown as a process
        diagram (phases, connected numbered nodes, one-line summaries). Title
        in the same style as "Meet our team"; same section gap and alignment.
      */}
      <section
        aria-labelledby="process-title"
        className="mt-8 md:mt-12 lg:mt-16 @max-[1537px]/page:px-6 @max-[640px]/page:px-4"
      >
        <div className="flex items-end gap-8">
          <div>
            <h2
              id="process-title"
              className="text-[clamp(1.75rem,3vw,2.75rem)] leading-tight font-bold tracking-[-0.02em] text-neutral-950"
            >
              How we work
            </h2>
          </div>
          <span aria-hidden="true" className="mb-[0.9em] hidden h-px flex-1 bg-linear-to-r from-slate-300 to-transparent sm:block" />
        </div>
        <div className="mt-8 lg:mt-10">
          <ProcessDiagram />
        </div>
      </section>

      {/*
        Customer reviews as a carousel of cards (the home page shows the same
        reviews as a card deck). Plain black title like the sections above;
        same section gap and side alignment.
      */}
      <section
        aria-labelledby="customers-title"
        className="mt-8 md:mt-12 lg:mt-16 @max-[1537px]/page:px-6 @max-[640px]/page:px-4"
      >
        <ReviewCarousel
          reviews={REVIEWS}
          title={
            <h2
              id="customers-title"
              className="text-[clamp(1.75rem,3vw,2.75rem)] leading-tight font-bold tracking-[-0.02em] text-neutral-950"
            >
              We have great customers
            </h2>
          }
        />
      </section>

      {/*
        Partners: plain black title like the sections above, then the partner
        logos flowing continuously. Same section gap and side alignment.
      */}
      <section
        aria-labelledby="partners-title"
        className="mt-8 md:mt-12 lg:mt-16 @max-[1537px]/page:px-6 @max-[640px]/page:px-4"
      >
        <div className="flex items-end gap-8">
          <h2
            id="partners-title"
            className="text-[clamp(1.75rem,3vw,2.75rem)] leading-tight font-bold tracking-[-0.02em] text-neutral-950"
          >
            Our partners
          </h2>
          <span aria-hidden="true" className="mb-[0.9em] hidden h-px flex-1 bg-linear-to-r from-slate-300 to-transparent sm:block" />
        </div>
        <div className="mt-8 lg:mt-10">
          <PartnerMarquee />
        </div>
      </section>

      {/*
        Panel below the banner, matching the home page's "How we work / Contact
        Us" panel (slate border, light grey background, same section gap and
        side alignment). Left: "Location" with a Google Map that stretches to
        the full height of the right column; right: the same "Contact Us"
        column as the home page. Stacked on phones (map 360px tall).
      */}
      <div className="mt-8 mb-16 md:mt-12 lg:mt-16 @max-[1537px]/page:px-6 @max-[640px]/page:px-4">
        <div className="grid grid-cols-1 gap-10 rounded-lg border border-slate-300 bg-slate-100 p-6 md:grid-cols-2 md:gap-11 md:p-8">
          <section aria-labelledby="location-title" className="flex flex-col">
            <h2
              id="location-title"
              className="text-[clamp(1.75rem,2.4vw,2.5rem)] leading-tight font-extrabold tracking-[-0.02em] text-neutral-950"
            >
              Location
            </h2>
            {/* Address, engraved like the Contact Us tagline opposite. */}
            <p className="mt-3 text-[clamp(15px,1.1vw,17px)] leading-snug font-normal text-[#94a0b1] [text-shadow:0_1px_0_rgb(255_255_255/0.95),0_-1px_0_rgb(15_23_42/0.12)]">
              5C Target Court, Wairau Valley, Auckland
            </p>

            {/* Map frame (1px slate border, 1px white gap, rounded corners, like the other images). */}
            <div className="mt-6 flex min-h-[360px] flex-1 flex-col rounded-lg border border-slate-300 bg-white p-px md:mt-8">
              <div className="relative flex-1 overflow-hidden rounded-[6px] bg-slate-200">
                <iframe
                  title="Map showing RF Data Systems at 5C Target Court, Wairau Valley, Auckland"
                  src="https://www.google.com/maps?q=5C%20Target%20Court%2C%20Wairau%20Valley%2C%20Auckland%2C%20New%20Zealand&z=16&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="absolute inset-0 size-full border-0"
                />
              </div>
            </div>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=5C+Target+Court,+Wairau+Valley,+Auckland,+New+Zealand"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 inline-flex w-fit items-center gap-2 rounded-md text-[15px] font-semibold text-blue-700 outline-none hover:text-blue-800 focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              Get directions
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" className="size-4 transition-transform group-hover:translate-x-0.5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </section>
          <ContactColumn compact />
        </div>
      </div>
    </main>
  );
}
