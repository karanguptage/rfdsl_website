"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Menu items. Pages other than Home don't exist yet and will 404 until added.
const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Solutions", href: "/solutions" },
  { label: "About Us", href: "/about" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

// Menu link states (text only): the selected page is deep black, other links
// are a slightly lighter black that darkens to deep black on hover.
// The focus ring only appears for keyboard navigation.
const LINK_BASE =
  "rounded-md font-semibold transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900";
const LINK_IDLE = "text-neutral-600 hover:text-neutral-950";
const LINK_ACTIVE = "text-neutral-950";

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu with the Escape key.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    // White bar that stays at the top of the screen while scrolling. Its
    // contents and bottom border span the 1536px page width.
    <header className="sticky top-0 z-50 bg-white text-slate-900">
      <div className="mx-auto flex h-20 max-w-[1536px] items-center justify-between border-b border-slate-200 px-4 lg:h-28 lg:px-6">
        <Link href="/" aria-label="RF Data Systems Limited – home" onClick={() => setMenuOpen(false)}>
          <Image
            src="/images/logo.png"
            alt="RF Data Systems Limited"
            width={360}
            height={150}
            preload
            className="h-14 w-auto lg:h-24"
          />
        </Link>

        {/* Desktop menu (nudged 8px below the header's vertical center) */}
        <nav aria-label="Main" className="hidden lg:block lg:translate-y-2">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`block px-3 py-2 text-[17px] xl:px-4 ${LINK_BASE} ${
                      active ? LINK_ACTIVE : LINK_IDLE
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-md hover:bg-slate-100 lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
            {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="absolute inset-x-0 top-full z-50 border-b border-slate-200 bg-white shadow-lg lg:hidden"
        >
          <ul className="flex flex-col py-2">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-3 text-lg ${LINK_BASE} ${
                      active ? LINK_ACTIVE : LINK_IDLE
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
