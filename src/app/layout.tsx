import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RFDSL",
  description: "RFID equipment and solutions",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // scrollbar-gutter: stable always reserves the scrollbar's space, so the
      // layout doesn't shift sideways between pages that scroll and pages that don't.
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased [scrollbar-gutter:stable]`}
    >
      {/*
        The body is a size container named "page", so sections can react to the
        page's real width (excluding the scrollbar), e.g. to add side space only
        while the 1536px content area fills the whole width.
      */}
      <body className="@container/page min-h-full flex flex-col">
        <SiteHeader />
        <div className="mx-auto flex w-full max-w-[1536px] flex-1 flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
