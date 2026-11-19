import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// /sitemap.xml - tells Google which pages exist. Add each new page here
// (Products, Solutions, Industries, About Us, Contact) once it is built.
// Dates are fixed (this Next.js setup can't read the current date while
// prerendering); update LAST_UPDATED when the content changes.
const LAST_UPDATED = "2026-11-19";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: LAST_UPDATED,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
