import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Preview image shown when the site is shared (Facebook, LinkedIn, X, Teams,
// Slack, messaging apps). Generated once at build time: 1200x630, navy like
// the banner, with the logo on a white card and the core services.
export const alt = "RF Data Systems - RFID asset tracking and asset management in New Zealand";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/images/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #0b1f45 0%, #10295c 60%, #0b1f45 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex" }}>
          <div style={{ display: "flex", background: "white", borderRadius: 18, padding: "14px 22px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse needs a plain img */}
            <img src={logoSrc} width={264} height={110} alt="" />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: 72, height: 6, borderRadius: 3, background: "white", marginBottom: 28 }} />
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            RFID Asset Tracking &amp; Asset Management
          </div>
          <div style={{ fontSize: 30, marginTop: 22, color: "rgba(255,255,255,0.8)" }}>
            RFID readers, tags &amp; printers · Asset registration · IoT · Digitalisation
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "rgba(255,255,255,0.7)" }}>
          <span>Auckland, New Zealand</span>
          <span>rfdsl.co.nz</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
