import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { SITE, SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Search engine and social sharing settings for every page. Pages can set
// their own `title` (shown as "<title> | RF Data Systems") and `description`.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE.title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  keywords: [...SITE.keywords],
  applicationName: SITE.legalName,
  authors: [{ name: SITE.legalName, url: SITE_URL }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  category: "technology",
  openGraph: {
    type: "website",
    locale: "en_NZ",
    siteName: SITE.legalName,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  formatDetection: { telephone: true, email: true, address: true },
  // Google Search Console ownership check: set GOOGLE_SITE_VERIFICATION to the
  // code Search Console gives you (HTML tag method).
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  other: { "geo.region": "NZ-AUK", "geo.placename": "Auckland", "geo.country": "NZ" },
};

export const viewport: Viewport = {
  themeColor: "#0b1f45",
};

// Structured data (schema.org JSON-LD): tells Google who the business is,
// where it is, what it offers and that it serves all of New Zealand. Used for
// the knowledge panel, local results and rich results.
const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#business`,
      name: SITE.legalName,
      legalName: SITE.legalName,
      alternateName: [SITE.shortName, "RF DATA", SITE.name],
      description: SITE.description,
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/images/logo.png`,
      image: `${SITE_URL}/opengraph-image`,
      email: SITE.email,
      telephone: SITE.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.address.street,
        addressLocality: SITE.address.locality,
        addressRegion: SITE.address.region,
        addressCountry: SITE.address.country,
      },
      areaServed: { "@type": "Country", name: "New Zealand" },
      knowsAbout: [
        "RFID",
        "Asset tracking",
        "Asset management",
        "Property management",
        "Asset registration",
        "Digitalisation",
        "Internet of Things (IoT)",
        "Software configuration and system integration",
        "Inventory management",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "RFID products and solutions",
        itemListElement: [
          "RFID asset tracking",
          "Asset management and asset registration",
          "RFID readers, tags and printers",
          "Customised RFID tags",
          "On-site assessment and consultation",
          "Installation, software configuration and system integration",
          "IoT and digitalisation solutions",
          "Testing and ongoing technical support",
        ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name, areaServed: "New Zealand" } })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE.legalName,
      alternateName: SITE.shortName,
      inLanguage: "en-NZ",
      publisher: { "@id": `${SITE_URL}/#business` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      // New Zealand English: helps Google match the site to NZ searches.
      lang="en-NZ"
      // scrollbar-gutter: stable always reserves the scrollbar's space, so the
      // layout doesn't shift sideways between pages that scroll and pages that don't.
      // Smooth scrolling for in-page links (e.g. "Get a quote"); data-scroll-behavior
      // lets Next.js keep page-to-page navigation instant. Off for reduced motion.
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased [scrollbar-gutter:stable] motion-safe:scroll-smooth`}
    >
      {/*
        The body is a size container named "page", so sections can react to the
        page's real width (excluding the scrollbar), e.g. to add side space only
        while the 1536px content area fills the whole width.
      */}
      <body className="@container/page min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA).replace(/</g, "\u003c") }}
        />
        <SiteHeader />
        <div className="mx-auto flex w-full max-w-[1536px] flex-1 flex-col">
          {children}
        </div>
        <SiteFooter />
      </body>
    </html>
  );
}
