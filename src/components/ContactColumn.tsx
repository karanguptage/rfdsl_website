import Image from "next/image";
import ContactForm from "@/components/ContactForm";

// Contact details shown under the contact form (icon = SVG path, 24x24, stroked).
export const CONTACT_DETAILS = [
  {
    label: "Phone",
    value: "+64 09 553 7261",
    href: "tel:+6495537261",
    icon: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
  },
  {
    label: "Email",
    value: "info@rfdsl.co.nz",
    href: "mailto:info@rfdsl.co.nz",
    icon: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm18 2-10 7L2 6",
  },
  {
    label: "Address",
    value: "5C Target Court Wairau Valley, Auckland, New Zealand",
    href: "https://www.google.com/maps/search/?api=1&query=5C+Target+Court,+Wairau+Valley,+Auckland,+New+Zealand",
    external: true,
    wide: true,
    icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  },
];

// "Contact Us" column, used on the home page and the About Us page: heading,
// tagline, intro, the contact form, and the Auckland panorama with the
// contact details on top. Expects to sit in a grid/flex column (it stretches
// to the column's height from 1280px). `compact` (About Us page) shows only
// the heading, tagline and form, without the intro text and the panorama.
export default function ContactColumn({ compact = false }: { compact?: boolean }) {
  return (
    <>
    {/* id="contact": target of the banner's "Get a quote" button (stops below the sticky header). */}
    <section id="contact" aria-labelledby="contact-us-title" className="flex scroll-mt-28 flex-col lg:scroll-mt-36">
      <h2
        id="contact-us-title"
        className="text-[clamp(1.75rem,2.4vw,2.5rem)] leading-tight font-extrabold tracking-[-0.02em] text-neutral-950"
      >
        Contact Us
      </h2>
      {/* Tagline: engraved look, one colour a little darker than the panel, with a
          white highlight below and a faint dark edge above, as if pressed in. */}
      <p className="mt-3 text-[clamp(15px,1.1vw,17px)] leading-snug font-normal text-[#94a0b1] [text-shadow:0_1px_0_rgb(255_255_255/0.95),0_-1px_0_rgb(15_23_42/0.12)]">
        We’d love to hear from you, get in touch with us!
      </p>
      {!compact && (
      <>
      {/* Intro text. */}
      <p className="mt-4 text-[clamp(15px,1.1vw,17px)] leading-relaxed text-slate-600 md:mt-5">
        RF DATA works closely with customers to accurately identify their requirements and provide the most
        suitable RFID products and solutions. Whether you need individual equipment or a complete RFID system,
        RF DATA supports customers throughout the entire process.
      </p>
      </>
      )}
      <ContactForm className="mt-6 md:mt-8" />

      {!compact && (
      <>
      {/*
        Auckland panorama with the contact information on top of it.
        Frame like the other images (1px slate border, 1px white gap,
        slightly rounded corners). A navy tint (darker on the left) keeps
        the white text readable over the photo.
        Height: at least the photo's own 2400x820 shape and always tall
        enough for the text; from 1280px (where the steps sit side by
        side) it also fills the rest of the column, so its bottom lines
        up with the last "How we work" step. The photo crops around the
        skyline to fit. Phone and email sit side by side when the frame is
        wide enough (480px+), address below; each value is a link
        (call, email, map).
      */}
      <div className="mt-6 flex flex-col rounded-lg border border-slate-300 bg-white p-px md:mt-8 xl:flex-1">
        <div className="@container relative grid flex-1 grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[6px] bg-[#0b1f45]">
          <Image
            src="/images/auckland.jpg"
            alt="Auckland city skyline and Sky Tower across the harbour at sunset"
            fill
            sizes="(min-width: 1536px) 720px, (min-width: 768px) 50vw, 100vw"
            className="object-cover object-[50%_60%]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-r from-[#0b1f45]/90 via-[#0b1f45]/70 to-[#0b1f45]/35"
          />
          {/* Sets the minimum height (the photo's shape); shares the grid cell with the text. */}
          <div aria-hidden="true" className="aspect-[2400/820] w-full self-start [grid-area:1/1]" />
          <div className="relative p-5 [grid-area:1/1] md:p-6 lg:p-8">
            <h3 className="text-[clamp(1.25rem,1.6vw,1.5rem)] leading-tight font-bold tracking-[-0.01em] text-white">
              Contact Information
            </h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-white/80">
              Reach out to RF DATA SYSTEMS LIMITED for expert RFID solutions
            </p>
            <address className="mt-5 grid grid-cols-1 gap-4 not-italic @[30rem]:grid-cols-2">
              {CONTACT_DETAILS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`group flex items-center gap-3.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
                    item.wide ? "@[30rem]:col-span-2" : ""
                  }`}
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur-sm transition-colors group-hover:bg-white group-hover:text-[#0b1f45]">
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className="size-5">
                      <path d={item.icon} />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold tracking-[0.08em] text-sky-200 uppercase">{item.label}</span>
                    <span className="block text-[15px] font-semibold text-white underline-offset-4 group-hover:underline">
                      {item.value}
                    </span>
                  </span>
                </a>
              ))}
            </address>
          </div>
        </div>
      </div>
      </>
      )}
    </section>
    </>
  );
}
