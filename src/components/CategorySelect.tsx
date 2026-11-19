"use client";

import { useEffect, useId, useRef, useState } from "react";

export type CategoryOption = { value: string; label: string; icon: string };

// Select2-style category picker (built in React, no jQuery):
// - A button showing a small "Category" caption, the chosen category and its icon.
// - Opens a panel with a search box at the top that filters the options as you
//   type, each option with an icon and a check mark on the selected one.
// - Keyboard: Enter / Space / Arrow Down opens; Arrow Up / Down move; Enter
//   picks; Esc or Tab closes. Clicking outside closes it.
export default function CategorySelect({
  options,
  value,
  onChange,
  className,
}: {
  options: CategoryOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const selected = options.find((o) => o.value === value) ?? options[0];
  const filtered = options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase()));

  const openPanel = () => {
    setQuery("");
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };
  const closePanel = (refocus = true) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  };
  const pick = (option: CategoryOption) => {
    onChange(option.value);
    closePanel();
  };

  // Focus the search box when the panel opens; close on a click outside.
  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (filtered.length === 0) return;
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((a) => (a + step + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[active]) pick(filtered[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      closePanel();
    } else if (e.key === "Tab") {
      closePanel(false);
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className ?? ""}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={`Category: ${selected.label}`}
        onClick={() => (open ? closePanel() : openPanel())}
        onKeyDown={(e) => {
          if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            openPanel();
          }
        }}
        className={`group flex h-12 w-full cursor-pointer items-center gap-3 rounded-xl border bg-white pr-3 pl-3.5 text-left transition outline-none hover:border-slate-400 focus-visible:border-[#0b1f45] focus-visible:ring-4 focus-visible:ring-sky-500/15 ${
          open ? "border-[#0b1f45] ring-4 ring-sky-500/15" : "border-slate-300"
        }`}
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#0b1f45] text-white">
          <Icon path={selected.icon} className="size-4" />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-[10px] font-semibold tracking-[0.14em] text-slate-500 uppercase">Category</span>
          <span className="block truncate text-[15px] font-semibold text-neutral-950">{selected.label}</span>
        </span>
        <Icon
          path="M6 9l6 6 6-6"
          className={`size-4 shrink-0 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-2 w-full min-w-60 origin-top rounded-xl border border-slate-200 bg-white p-2 shadow-[0_20px_50px_-15px_rgb(11_31_69/0.35)] transition duration-150 starting:-translate-y-1 starting:opacity-0">
          {/* Search box (the Select2 hallmark). */}
          <div className="relative">
            <Icon path="M21 21l-4.35-4.35M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onSearchKey}
              placeholder="Search categories"
              aria-label="Search categories"
              aria-controls={`${id}-list`}
              aria-activedescendant={filtered[active] ? `${id}-opt-${filtered[active].value}` : undefined}
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pr-3 pl-9 text-sm text-neutral-950 outline-none placeholder:text-slate-400 focus:border-slate-300 focus:bg-white"
            />
          </div>
          <ul id={`${id}-list`} role="listbox" aria-label="Categories" className="mt-2 max-h-72 overflow-y-auto">
            {filtered.length === 0 && <li className="px-3 py-3 text-sm text-slate-500">No matching category</li>}
            {filtered.map((o, i) => {
              const isSelected = o.value === value;
              return (
                <li
                  key={o.value}
                  id={`${id}-opt-${o.value}`}
                  role="option"
                  aria-selected={isSelected}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => pick(o)}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] transition-colors ${
                    i === active ? "bg-slate-100" : ""
                  } ${isSelected ? "font-semibold text-[#0b1f45]" : "text-neutral-700"}`}
                >
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${
                      isSelected ? "bg-[#0b1f45] text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Icon path={o.icon} className="size-4" />
                  </span>
                  <span className="flex-1">{o.label}</span>
                  {isSelected && <Icon path="M5 12l5 5L20 7" className="size-4 text-[#0b1f45]" />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function Icon({ path, className }: { path: string; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={path} />
    </svg>
  );
}
