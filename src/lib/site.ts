// Site-wide facts used for SEO (metadata, structured data, sitemap, robots).
// Set NEXT_PUBLIC_SITE_URL to the live address (e.g. https://www.rfdsl.co.nz)
// in the hosting environment; it must match the domain Google indexes.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rfdsl.co.nz").replace(/\/$/, "");

export const SITE = {
  name: "RF Data Systems",
  legalName: "RF Data Systems Limited",
  shortName: "RFDSL",
  // Shown in Google results (keep titles under ~60 characters, descriptions under ~160).
  title: "RFID Asset Tracking & Asset Management NZ | RF Data Systems",
  description:
    "RFID asset tracking and asset management for NZ businesses: RFID readers, tags, printers, asset registration software, IoT and digitalisation. Auckland based.",
  email: "info@rfdsl.co.nz",
  phone: "+64-9-553-7261",
  address: {
    street: "5C Target Court, Wairau Valley",
    locality: "Auckland",
    region: "Auckland",
    postalCode: "0627",
    country: "NZ",
  },
  // Search terms the business wants to be found for (also used in structured data).
  keywords: [
    "RFID",
    "RFID NZ",
    "RFID New Zealand",
    "RFID Auckland",
    "asset tracking",
    "RFID asset tracking",
    "asset management",
    "asset management software",
    "property management",
    "asset registration",
    "asset register",
    "digitalisation",
    "digitization",
    "IoT",
    "IoT solutions",
    "software",
    "programming",
    "system integration",
    "RFID readers",
    "RFID tags",
    "RFID printers",
    "inventory management",
    "warehouse tracking",
    "healthcare asset tracking",
    "laundry tracking",
    "manufacturing tracking",
  ],
} as const;
