"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LEGAL_DOCS, type LegalDoc } from "@/content/legal";

// Copyright year (fixed: this Next.js version can't read the current date while
// prerendering the page). Update it each new year.
const COPYRIGHT_YEAR = 2026;

// Site footer, on every page. A thin boundary line at the page width (like
// the header's bottom border), then one compact row: the copyright notice on
// the left and the legal document links on the right (stacked on phones).
// No logo: the sticky header always shows it. Each legal link opens its
// document in a modal.
export default function SiteFooter() {
  const [doc, setDoc] = useState<LegalDoc | null>(null);
  const [opens, setOpens] = useState(0); // bumps on each open, so the effect below runs after the content renders
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (opens === 0) return;
    dialogRef.current?.showModal();
    document.documentElement.style.overflow = "hidden"; // keep the page behind from scrolling
  }, [opens]);

  const openDoc = (d: LegalDoc) => {
    setDoc(d);
    setOpens((n) => n + 1);
  };

  return (
    <footer className="mx-auto w-full max-w-[1536px]">
      <div className="flex flex-col gap-5 border-t border-slate-200 px-4 py-7 md:flex-row md:items-center md:justify-between md:gap-12 lg:px-6">
        {/* Copyright notice (left). */}
        <div className="max-w-4xl text-[13px] leading-relaxed text-slate-500">
          <p className="font-medium text-slate-700">© {COPYRIGHT_YEAR} RF Data Systems Limited. All rights reserved.</p>
          <p className="mt-1">
            All content on this website, including text, images, graphics and logos, is the property of RF Data Systems
            Limited and is protected by New Zealand and international copyright law. It may not be copied, reproduced
            or used without our prior written permission.
          </p>
        </div>
        {/* Legal documents (right); each opens in the modal below. */}
        <nav aria-label="Legal" className="shrink-0">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {LEGAL_DOCS.map((d) => (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => openDoc(d)}
                  aria-haspopup="dialog"
                  className="cursor-pointer rounded-md text-sm font-semibold whitespace-nowrap text-neutral-600 transition-colors outline-none hover:text-neutral-950 focus-visible:ring-2 focus-visible:ring-neutral-900"
                >
                  {d.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/*
        Legal document modal (native <dialog>: focus stays inside, Esc closes).
        Also closes from the X button, the Close button or a click outside it.
        Header and footer stay put while the document scrolls.
      */}
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={() => (document.documentElement.style.overflow = "")}
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        className="m-auto max-h-[min(85vh,860px)] w-[min(calc(100%-32px),760px)] max-w-none overflow-hidden rounded-2xl bg-white p-0 shadow-2xl transition duration-200 backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm open:flex open:flex-col starting:open:translate-y-3 starting:open:opacity-0"
      >
        {doc && (
          <>
            <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5 sm:px-8">
              <div>
                <h2 id={titleId} className="text-xl font-extrabold tracking-[-0.01em] text-neutral-950 sm:text-2xl">
                  {doc.title}
                </h2>
                <p className="mt-1 text-[13px] text-slate-500">Last updated: {doc.updated}</p>
              </div>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                aria-label="Close"
                className="-mr-2 flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-500 transition-colors outline-none hover:bg-slate-100 hover:text-neutral-950 focus-visible:ring-2 focus-visible:ring-neutral-900"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="size-5">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-6 sm:px-8">{doc.body}</div>
            <div className="flex justify-end border-t border-slate-200 px-6 py-4 sm:px-8">
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="h-10 cursor-pointer rounded-md bg-[#0b1f45] px-6 text-sm font-semibold text-white transition-colors outline-none hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
              >
                Close
              </button>
            </div>
          </>
        )}
      </dialog>
    </footer>
  );
}
