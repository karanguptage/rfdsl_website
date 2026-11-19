import type { Metadata } from "next";
import ProductToolbar from "@/components/ProductToolbar";

export const metadata: Metadata = {
  title: "Products",
  description:
    "RFID readers, tags, printers and software from RF Data Systems, Auckland: browse by category or search for a model.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <main className="flex-1">
      {/* Category picker + search, fixed below the site header while scrolling. */}
      <ProductToolbar />

      {/*
        PLACEHOLDER: the product list goes here next. The tall empty area only
        lets the fixed toolbar be seen working while scrolling.
      */}
      <div className="mt-8 mb-16 min-h-[150vh] rounded-lg border border-dashed border-slate-300 @max-[1537px]/page:mx-6 @max-[640px]/page:mx-4" />
    </main>
  );
}
