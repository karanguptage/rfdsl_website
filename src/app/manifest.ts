import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// /manifest.webmanifest - app name and colours for phones ("Add to home screen").
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.legalName,
    short_name: SITE.shortName,
    description: SITE.description,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#0b1f45",
    icons: [
      { src: "/favicon.ico", sizes: "16x16 32x32 48x48 64x64", type: "image/x-icon" },
      { src: "/icon.png", sizes: "144x144", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
