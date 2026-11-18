import Image from "next/image";
import HeroMesh from "@/components/HeroMesh";
import IndustryGrid, { type IndustryItem } from "@/components/IndustryGrid";
import ProductCarousel, { type Product } from "@/components/ProductCarousel";

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
      */}
      <section
        aria-label="Banner"
        className="relative mt-4 overflow-hidden bg-[#0b1f45] md:h-[clamp(320px,32vw,490px)] lg:mt-9"
      >
        {/* Headline (above the network; lets pointer effects pass through). */}
        <div className="pointer-events-none relative z-10 px-6 pt-10 pb-2 md:absolute md:inset-y-0 md:left-0 md:flex md:w-1/2 md:items-center md:py-0 md:pr-6 md:pl-10 lg:pl-16">
          <div>
            <span aria-hidden="true" className="block h-1 w-12 rounded-full bg-linear-to-r from-sky-300 to-blue-500" />
            {/*
              Two-part headline: a large, extra-bold gradient "RFID tracking"
              with a fine translucent white outline, then a lighter supporting line.
            */}
            <h1 className="mt-6 text-balance drop-shadow-[0_2px_16px_rgb(11_31_69/0.9)]">
              <span className="block bg-linear-to-r from-sky-200 via-sky-400 to-blue-500 bg-clip-text pb-1 text-[clamp(2.5rem,5vw,4.5rem)] leading-none font-extrabold tracking-[-0.03em] text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.35)]">
                RFID tracking
              </span>{" "}
              <span className="mt-4 block text-[clamp(1.25rem,2.1vw,2rem)] leading-snug font-normal tracking-[-0.01em] text-white/90">
                for NZ warehouses, healthcare, laundry and manufacturers
              </span>
            </h1>
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
        className="mt-8 mb-16 md:mt-12 lg:mt-16 @max-[1537px]/page:px-6 @max-[640px]/page:px-4"
      >
        <div className="flex items-end gap-8">
          <div>
            <span aria-hidden="true" className="block h-1 w-12 rounded-full bg-linear-to-r from-sky-400 to-blue-600" />
            <h2
              id="popular-products-title"
              className="mt-4 text-[clamp(1.75rem,3vw,2.75rem)] leading-tight font-bold tracking-[-0.02em] text-[#0b1f45]"
            >
              The most{" "}
              <span className="bg-linear-to-r from-sky-600 to-blue-700 bg-clip-text whitespace-nowrap text-transparent">
                popular products
              </span>
            </h2>
          </div>
          <span aria-hidden="true" className="mb-[0.9em] hidden h-px flex-1 bg-linear-to-r from-slate-300 to-transparent sm:block" />
        </div>

        <ProductCarousel products={POPULAR_PRODUCTS} className="mt-8 lg:mt-10" />
      </section>
    </main>
  );
}
