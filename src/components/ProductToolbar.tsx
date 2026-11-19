"use client";

import { useEffect, useRef, useState } from "react";
import CategorySelect, { type CategoryOption } from "@/components/CategorySelect";

// Product categories (icon = 24x24 stroked SVG path).
export const CATEGORIES: CategoryOption[] = [
  { value: "all", label: "All", icon: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" },
  { value: "reader", label: "Reader", icon: "M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" },
  { value: "tag", label: "Tag", icon: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01" },
  { value: "printer", label: "Printer", icon: "M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z" },
  { value: "software", label: "Software", icon: "M16 18l6-6-6-6M8 6l-6 6 6 6" },
];

// Products page toolbar, fixed just below the site header while scrolling
// (80px header on phones, 112px from 1024px). One row: the Select2-style
// category picker, then the search bar (magnifier, "/" shortcut badge, clear
// button and a Search button). Translucent white with a soft blur so the
// page shows faintly behind it as it scrolls.
// NOTE: the product list isn't built yet; `category` and `query` are kept here
// ready to filter it.
export default function ProductToolbar() {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // "/" jumps to the search bar (unless you're already typing somewhere).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="sticky top-20 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md lg:top-28">
      <form
        role="search"
        aria-label="Find products"
        onSubmit={(e) => e.preventDefault()}
        className="flex items-center gap-3 px-4 py-4 sm:gap-4 lg:px-6"
      >
        <CategorySelect options={CATEGORIES} value={category} onChange={setCategory} className="w-36 shrink-0 sm:w-56" />

        <div className="group relative min-w-0 flex-1">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#0b1f45] sm:left-4">
            <path d="M21 21l-4.35-4.35M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z" />
          </svg>
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setQuery("")}
            placeholder="Search products, models or keywords"
            aria-label="Search products"
            className="peer h-12 w-full rounded-xl border border-slate-300 bg-white pr-12 pl-11 sm:pl-12 text-[15px] text-neutral-950 shadow-[inset_0_1px_2px_rgb(15_23_42/0.04)] transition outline-none placeholder:text-slate-400 hover:border-slate-400 focus:border-[#0b1f45] focus:ring-4 focus:ring-sky-500/15 sm:pr-36 [&::-webkit-search-cancel-button]:hidden"
          />
          <div className="absolute inset-y-0 right-1.5 flex items-center gap-1.5">
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  searchRef.current?.focus();
                }}
                aria-label="Clear search"
                className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors outline-none hover:bg-slate-100 hover:text-neutral-950 focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" className="size-4">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            ) : (
              <kbd
                aria-hidden="true"
                className="hidden h-6 min-w-6 items-center justify-center rounded-md border border-slate-300 bg-slate-50 px-1.5 font-sans text-xs font-medium text-slate-500 sm:flex sm:group-focus-within:hidden"
              >
                /
              </kbd>
            )}
            <button
              type="submit"
              className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-[#0b1f45] px-3 text-sm font-semibold text-white transition-colors outline-none hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 sm:px-4"
            >
              <span className="hidden sm:inline">Search</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" className="size-4 sm:hidden">
                <path d="M21 21l-4.35-4.35M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z" />
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
