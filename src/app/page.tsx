import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import HeroMesh from "@/components/HeroMesh";
import IndustryGrid, { type IndustryItem } from "@/components/IndustryGrid";
import ProductCarousel, { type Product } from "@/components/ProductCarousel";
import PopStars from "@/components/PopStars";
import ReviewDeck, { type Review } from "@/components/ReviewDeck";

// Home page: its own address is the canonical one (title and description come
// from the site defaults in layout.tsx).
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Products shown in the "most popular products" carousel (images in public/products).
// `description` appears over the image on hover; `href` is the product's page
// (opened by a click or tap). Product pages don't exist yet, so links show the
// "Page not found" page until they're added.
const POPULAR_PRODUCTS: Product[] = [
  {
    name: "AdvanReader-10",
    src: "/products/AdvanReader-10.png",
    href: "/products/advanreader-10",
    description:
      "A compact UHF RFID reader with USB connectivity and optional integrated antenna, ideal for embedded systems, access control and IoT applications.",
  },
  {
    name: "AdvanReader-70",
    src: "/products/AdvanReader-70.png",
    href: "/products/advanreader-70",
    description:
      "A standalone UHF RFID reader with integrated Linux computing, suitable for RFID portals, smart surfaces and automated inventory systems.",
  },
  {
    name: "AdvanReader-160",
    src: "/products/AdvanReader-160.png",
    href: "/products/advanreader-160",
    description:
      "A powerful four-port UHF RFID reader designed for multi-antenna applications, industrial automation and large-scale asset tracking.",
  },
  {
    name: "C5",
    src: "/products/C5.jpg",
    href: "/products/c5",
    description:
      "A rugged Android handheld RFID reader combining UHF tag identification, barcode scanning and NFC capabilities for efficient inventory and asset management.",
  },
  {
    name: "C61",
    src: "/products/C61.jpg",
    href: "/products/c61",
    description:
      "A high-performance handheld UHF RFID reader offering fast, long-range tag identification for retail, warehousing and logistics.",
  },
  {
    name: "CP20",
    src: "/products/CP20.jpg",
    href: "/products/cp20",
    description:
      "A compact thermal barcode printer supporting direct thermal and thermal transfer printing, ideal for product labels, shipping and inventory identification.",
  },
  {
    name: "CP30",
    src: "/products/CP30.jpg",
    href: "/products/cp30",
    description:
      "A professional RFID and barcode printer offering accurate label printing and RFID encoding for logistics, warehousing and asset management.",
  },
  {
    name: "Customised RFID Tags",
    src: "/products/CustomisedRFIDTags.png",
    href: "/products/customised-rfid-tags",
    description:
      "Custom-designed RFID tags available in various sizes, materials, shapes and frequencies to meet specific product identification and tracking requirements.",
  },
  {
    // Description to follow once the product specifications are confirmed.
    name: "GP60333",
    src: "/products/gp60333.jpg",
    href: "/products/gp60333",
  },
  {
    name: "MC50",
    src: "/products/MC50.jpg",
    href: "/products/mc50",
    description:
      "A 5G-enabled handheld RFID computer featuring long-range reading and a detachable RFID module for demanding industrial and logistics applications.",
  },
  {
    name: "MC95",
    src: "/products/MC95.jpg",
    href: "/products/mc95",
    description:
      "A versatile mobile computer with UHF RFID capabilities, designed for inventory management, asset tracking and field operations.",
  },
  {
    name: "ZT411",
    src: "/products/ZT411.jpg",
    href: "/products/zt411",
    description:
      "An industrial-grade label printer with optional RFID encoding, designed for high-volume printing in manufacturing, logistics and warehousing.",
  },
];

// Light sweep across the "Get a quote" button: crosses in ~1.2s, then rests,
// repeating every 4s. Disabled for visitors who prefer reduced motion.
const CTA_CSS = `
@keyframes rfdsl-cta-shine {
  0% { transform: translateX(-120%) skewX(-20deg); }
  30%, 100% { transform: translateX(420%) skewX(-20deg); }
}
.rfdsl-cta-shine { transform: translateX(-120%) skewX(-20deg); animation: rfdsl-cta-shine 4s ease-in-out 1s infinite; }
@media (prefers-reduced-motion: reduce) { .rfdsl-cta-shine { animation: none; opacity: 0; } }
`;

// Industry images shown below the banner: a label along the bottom edge, and a
// description typed out over the image on hover (or tap on touch screens).
const INDUSTRY_IMAGES: IndustryItem[] = [
  {
    label: "Coolstore & Warehouse",
    src: "/images/rockit_1.jpg",
    alt: "Warehouse worker scanning palletised stock with a handheld scanner",
    description:
      "RFID Asset Tracking enables you to know at any time the exact location of your goods and load carriers such as pallets, racks, roll containers, crates and boxes.",
  },
  {
    label: "Manufacturing",
    src: "/images/rockit_2.jpg",
    alt: "Engineer checking a manufacturing production line on a tablet",
    description:
      "RFID enables an automatic and correct identification and tracking of compound products and their components throughout the manufacturing, assembly and quality control process.",
  },
  {
    label: "Healthcare",
    src: "/images/rockit_3.jpg",
    alt: "Nurse scanning medical equipment on hospital storage shelves",
    description:
      "Learn how RFID is applied for asset tracking, stock management, condition monitoring, product verification, access control and patient localisation.",
  },
  {
    label: "Rental",
    src: "/images/rockit_4.jpg",
    alt: "Stacked blue crates and roll cages outside a logistics facility",
    description:
      "By automating your pooling and rental process by means of RFID technology, you get an insight into the whereabouts of your assets.",
  },
];

// "How we work" steps, in order; images in public/howwork (359x240).
const HOW_WE_WORK = [
  {
    title: "Order & Enquiry",
    src: "/howwork/order.png",
    alt: "Customer service agent with a headset answering an enquiry at a laptop",
    description:
      "Submit your order or enquiry through our website's contact page, or get in touch with us directly using our contact details.",
  },
  {
    title: "Customer Consultation",
    src: "/howwork/consultation.png",
    alt: "Small team discussing requirements around a café table",
    description:
      "We discuss your requirements, business needs and intended applications to understand your expectations and identify the right approach.",
  },
  {
    title: "On-Site Assessment",
    src: "/howwork/Assessment.png",
    alt: "Corridor of storage units with red roller doors",
    description:
      "If required, our team visits your premises to evaluate the working environment, existing infrastructure and specific operational needs.",
  },
  {
    title: "Product & Solution Recommendation",
    src: "/howwork/product.png",
    alt: "Range of RFID handhelds, readers, printers and tags",
    description:
      "Based on your requirements and our assessment, we recommend the most appropriate RFID tags, readers, printers and related solutions.",
  },
  {
    title: "Installation & Integration",
    src: "/howwork/install.png",
    alt: "Warehouse entrance fitted with RFID gate antennas",
    description:
      "Where necessary, we provide equipment installation, software configuration and system integration to ensure everything works seamlessly with your existing operations.",
  },
  {
    title: "Testing & Support",
    src: "/howwork/Testing.png",
    alt: "Engineer checking a 3D warehouse model on a laptop",
    description:
      "We check the completed solution to ensure it meets your requirements and provide ongoing technical assistance whenever needed.",
  },
];

// Customer reviews for the card deck.
// PLACEHOLDER CONTENT: these are sample reviews, not real customers. Replace
// them with genuine reviews (and only show a customer's photo, email and phone
// with their permission) before the site goes live. `photo` is optional,
// e.g. "/reviews/sarah.jpg" in public/reviews; initials are shown without it.
const REVIEWS: Review[] = [
  {
    name: "Sarah Mitchell",
    email: "sarah.mitchell@example.com",
    phone: "+64 21 ••• 0142",
    text: "RF DATA helped us track pallets and crates across two coolstores. We now know where every load carrier is, and stocktakes take minutes instead of days.",
  },
  {
    name: "James Walker",
    email: "james.walker@example.com",
    phone: "+64 27 ••• 3318",
    text: "From the first consultation to installation, the team understood exactly what our production line needed. The readers and tags have worked flawlessly.",
  },
  {
    name: "Aroha Ngata",
    email: "aroha.ngata@example.com",
    phone: "+64 22 ••• 7765",
    text: "Finding medical equipment used to waste hours every week. With RFID asset tracking our staff can locate what they need straight away.",
  },
  {
    name: "Daniel Chen",
    email: "daniel.chen@example.com",
    phone: "+64 21 ••• 5094",
    text: "Our rental crates and roll cages kept going missing. RF DATA's solution gave us full visibility of our pool, and losses have dropped significantly.",
  },
  {
    name: "Emma Thompson",
    email: "emma.thompson@example.com",
    phone: "+64 29 ••• 2287",
    text: "Excellent support after go-live. Whenever we had a question, someone got back to us quickly and sorted it out. Highly recommended.",
  },
];

// Contact details shown under the contact form (icon = SVG path, 24x24, stroked).
const CONTACT_DETAILS = [
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

export default function Home() {
  return (
    <main className="flex-1">
      {/*
        Hero section, layered bottom to top: dark navy background, banner
        image, live elastic node network, headline.
        - Standard screens (md+): headline in the left half, image in the right
          half. Full page width (up to 1536px), 490px tall on desktop and
          scaling down with the screen (32vw), never shorter than 320px.
        - Phones: headline on top, image centered below it; the banner grows
          to fit both.
        The text column sets the banner's height (at least the sizes above),
        so the banner grows rather than clipping if the text needs more room.
      */}
      <section aria-label="Banner" className="relative mt-4 overflow-hidden bg-[#0b1f45] lg:mt-9">
        {/* Headline (above the network; lets pointer effects pass through, except the button). */}
        <div className="pointer-events-none relative z-10 px-6 pt-10 pb-2 md:flex md:min-h-[clamp(320px,32vw,490px)] md:w-1/2 md:items-center md:py-8 md:pr-6 md:pl-10 lg:pl-16">
          <div>
            <span aria-hidden="true" className="block h-1 w-12 rounded-full bg-white" />
            {/*
              Two-part headline: a large, extra-bold "RFID tracking" in solid black
              with a crisp white outline (drawn behind the letters, so they keep
              their full shape; matches the black-and-white button), then a
              lighter supporting line.
            */}
            <h1 className="mt-6 text-balance drop-shadow-[0_2px_16px_rgb(11_31_69/0.9)]">
              <span className="block pb-1 text-[clamp(2.5rem,5vw,4.5rem)] leading-none font-extrabold tracking-[-0.02em] text-black [-webkit-text-stroke:3px_#fff] [paint-order:stroke_fill]">
                RFID tracking
              </span>{" "}
              <span className="mt-4 block text-[clamp(1.25rem,2.1vw,2rem)] leading-snug font-normal tracking-[-0.01em] text-white/90">
                for NZ warehouses, healthcare, laundry and manufacturers
              </span>
            </h1>
            {/* Supporting sentence: smaller, lighter and softer white than the headline; uses the full text width (no early wrapping). */}
            <p className="mt-5 text-[clamp(0.875rem,1.05vw,1.0625rem)] leading-relaxed font-light text-white/70 drop-shadow-[0_2px_12px_rgb(11_31_69/0.9)]">
              RF DATA supports everyone who wishes to manage their assets effectively. The information you collect through our service enables more convenient utilization.
            </p>
            {/*
              Call to action, right after the text the eye has just read:
              black pill with a crisp white border and a faint white halo, the
              arrow in a white circle. A soft light sweeps across it every 4s to
              catch the eye (not for reduced motion). On hover it inverts to
              white with black text and the arrow slides right. Scrolls down to
              the Contact Us form.
            */}
            <style>{CTA_CSS}</style>
            <a
              href="#contact"
              className="group pointer-events-auto relative mt-7 inline-flex h-12 items-center gap-4 overflow-hidden rounded-full border-[1.5px] border-white bg-black pr-1.5 pl-6 text-[15px] font-semibold tracking-[0.02em] text-white shadow-[0_0_0_5px_rgb(255_255_255/0.07),0_14px_34px_-12px_rgb(0_0_0/0.9)] transition-colors duration-300 outline-none hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0b1f45] active:scale-[0.98] md:mt-6 lg:mt-8 lg:h-14 lg:gap-5 lg:pr-2 lg:pl-8 lg:text-base"
            >
              <span aria-hidden="true" className="rfdsl-cta-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-white/25 to-transparent" />
              <span className="relative">Get a quote</span>
              <span className="relative flex size-9 items-center justify-center rounded-full bg-white text-black transition-colors duration-300 group-hover:bg-black group-hover:text-white lg:size-10">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" className="size-[18px] transition-transform duration-300 group-hover:translate-x-0.5">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </a>
          </div>
        </div>

        {/*
          Banner image: centered on phones; on standard screens it fills the
          right half (resting on the bottom edge), leaving the left half for text.
        */}
        <div className="pointer-events-none relative mx-4 my-4 aspect-[3/2] md:absolute md:inset-auto md:top-8 md:right-6 md:bottom-0 md:left-1/2 md:m-0 md:aspect-auto">
          <Image
            src="/images/banner_img.webp"
            alt="RFID specialist with a handheld scanner, next to an RFID reader, tags and an asset-tracking dashboard"
            fill
            sizes="(min-width: 1536px) 768px, (min-width: 768px) 50vw, 100vw"
            preload
            className="object-contain object-center md:object-bottom"
          />
        </div>

        <HeroMesh />
      </section>

      {/*
        Industry images: four per row on desktop, two on tablets, one on
        phones; each keeps its 1600x976 shape. Side space follows the banner:
        while the page is 1536px or narrower (the banner touches the browser
        edges) they get 24px side padding (16px on phones); once the banner
        has white space beside it, they align exactly with its edges.
        (Measured on the "page" container = page width without the scrollbar.)
        Gap between sections (larger than the header-to-banner gap): 32px on
        phones, 48px from 768px, 64px from 1024px.
      */}
      <IndustryGrid
        items={INDUSTRY_IMAGES}
        className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-12 lg:mt-16 lg:grid-cols-4 lg:gap-6 @max-[1537px]/page:px-6 @max-[640px]/page:px-4"
      />

      {/*
        "The most popular products" section. Same section gap as above
        (32px phones, 48px from 768px, 64px from 1024px) and the same side alignment as the
        industry images. Title: accent bar (as in the banner), bold navy text
        with a gradient on "popular products", and a fading hairline.
      */}
      <section
        aria-labelledby="popular-products-title"
        className="mt-8 md:mt-12 lg:mt-16 @max-[1537px]/page:px-6 @max-[640px]/page:px-4"
      >
        <div className="flex items-end gap-8">
          <div>
          
            <h2
              id="popular-products-title"
              className="text-[clamp(1.75rem,2.4vw,2.5rem)] leading-tight font-extrabold tracking-[-0.02em] text-neutral-950"
            >
              The most popular products             
            </h2>
          </div>
          <span aria-hidden="true" className="mb-[0.9em] hidden h-px flex-1 bg-linear-to-r from-slate-300 to-transparent sm:block" />
        </div>

        <ProductCarousel products={POPULAR_PRODUCTS} className="mt-8 lg:mt-10" />
      </section>

      {/*
        Large panel below the products. Same border colour and corners as the
        other panels (slate-300, 8px), on a light grey (slate-100). Same section
        gap and side alignment as the sections above; at least 240px tall on
        phones up to 420px on desktop, growing with its content.
        Inside: "How we work" on the left and "Contact Us" on the right on
        standard screens (768px+), stacked on phones. Each starts with a large,
        bold, deep-black title.
      */}
      <div className="mt-8 md:mt-12 lg:mt-16 @max-[1537px]/page:px-6 @max-[640px]/page:px-4">
        <div className="grid min-h-[clamp(240px,28vw,420px)] grid-cols-1 content-start gap-10 rounded-lg border border-slate-300 bg-slate-100 p-6 md:grid-cols-2 md:gap-11 md:p-8">
          <section aria-labelledby="how-we-work-title">
            <h2
              id="how-we-work-title"
              className="text-[clamp(1.75rem,2.4vw,2.5rem)] leading-tight font-extrabold tracking-[-0.02em] text-neutral-950"
            >
              How we work
            </h2>

            {/*
              Steps: image on the left, white text panel on the right; the two
              are always the same height (the image fills its frame, cropping
              if the text is taller). Image frame: 1px slate border, 1px white
              gap, slightly rounded corners (as the industry images). When the
              column is narrower than 512px (phones, tablets, 1024px screens), the image
              sits above its panel instead.
            */}
            <ol className="@container mt-6 flex flex-col gap-4 md:mt-8">
              {HOW_WE_WORK.map((step, i) => (
                <li key={step.src} className="grid grid-cols-1 gap-3 @[32rem]:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] @[32rem]:gap-4">
                  <div className="rounded-lg border border-slate-300 bg-white p-px">
                    <div className="relative h-full overflow-hidden rounded-[6px]">
                      {/* Sets the minimum height (the image's 359x240 shape). */}
                      <div aria-hidden="true" className="aspect-[359/240]" />
                      <Image
                        src={step.src}
                        alt={step.alt}
                        fill
                        sizes="(min-width: 1536px) 280px, (min-width: 768px) 20vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center rounded-lg border border-slate-300 bg-white p-4 lg:p-5">
                    <h3 className="flex items-baseline gap-2.5 text-[clamp(1rem,1.15vw,1.125rem)] leading-snug font-bold text-neutral-950">
                      <span className="bg-linear-to-r from-sky-600 to-blue-700 bg-clip-text font-extrabold tabular-nums text-transparent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          {/* id="contact": target of the banner's "Get a quote" button (stops below the sticky header). */}
          <section id="contact" aria-labelledby="contact-us-title" className="flex scroll-mt-28 flex-col lg:scroll-mt-36">
            <h2
              id="contact-us-title"
              className="text-[clamp(1.75rem,2.4vw,2.5rem)] leading-tight font-extrabold tracking-[-0.02em] text-neutral-950"
            >
              Contact Us
            </h2>
            {/* Tagline: medium-large, semibold, in the blue gradient used for "popular products". */}
            <p className="mt-3 text-[clamp(1.0625rem,1.35vw,1.25rem)] leading-snug font-semibold">
              <span className="bg-linear-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
                We’d love to hear from you, get in touch with us!
              </span>
            </p>
            {/* Intro text. */}
            <p className="mt-4 text-[clamp(15px,1.1vw,17px)] leading-relaxed text-slate-600 md:mt-5">
              RF DATA works closely with customers to accurately identify their requirements and provide the most
              suitable RFID products and solutions. Whether you need individual equipment or a complete RFID system,
              RF DATA supports customers throughout the entire process.
            </p>
            <ContactForm className="mt-6 md:mt-8" />

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
          </section>
        </div>
      </div>

      {/*
        Customer reviews. Like the banner: full page width (up to 1536px) with
        no side space even on phones, no border, black background, and the
        same live node network behind the content.
        - Left (centred): five large gold stars that pop one after another on
          a loop, the heading (always one line: its size follows the column
          width, up to 56px), a short line, and below it the team's promise
          on working closely with each client until they're happy.
        - Right: the review card deck, at its own width, with the left side
          taking the rest. Stacked on phones and tablets, side by side from 1280px.
      */}
      <section
        aria-labelledby="reviews-title"
        className="relative mt-8 mb-16 overflow-hidden bg-black md:mt-12 lg:mt-16"
      >
        <HeroMesh />
        <div className="relative grid grid-cols-1 items-center gap-12 px-6 py-14 md:px-10 md:py-20 lg:px-16 xl:grid-cols-[minmax(0,1fr)_auto] xl:gap-16">
          {/* Lets the network react to the pointer through the text. */}
          <div className="@container pointer-events-none flex flex-col items-center text-center">
            <PopStars />
            <h2
              id="reviews-title"
              className="mt-7 text-[min(3.5rem,9.2cqw)] leading-[1.1] font-extrabold whitespace-nowrap tracking-[-0.03em] text-white"
            >
              Our customers{" "}
              <span className="bg-linear-to-r from-amber-300 to-amber-500 bg-clip-text whitespace-nowrap text-transparent">love us</span>
            </h2>
            <p className="mt-4 text-[clamp(15px,1.15vw,17px)] leading-relaxed text-white/65">
              Here&apos;s what they say about working with RF DATA.
            </p>
            {/* Our promise: a short gold rule, the statement, then the team sign-off. */}
            <span aria-hidden="true" className="mt-9 h-px w-12 bg-linear-to-r from-transparent via-amber-400 to-transparent" />
            <p className="mt-6 max-w-3xl text-[clamp(16px,1.3vw,19px)] leading-relaxed font-medium text-balance text-white/90">
              We stay close to every client, from the first conversation to long after the system is up and running.
              The job isn&apos;t finished until you&apos;re happy with it.
            </p>
            <p className="mt-3 text-xs font-semibold tracking-[0.16em] text-amber-300/90 uppercase">The RF DATA team</p>
          </div>
          <ReviewDeck reviews={REVIEWS} className="justify-self-center xl:justify-self-end" />
        </div>
      </section>
    </main>
  );
}
