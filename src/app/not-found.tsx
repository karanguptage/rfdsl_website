import Link from "next/link";

// Shown for any URL without a page. It only fills the space below the header
// (Next.js's built-in 404 is a full 100vh tall, which overflowed the window).
export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-sm font-semibold tracking-widest text-neutral-500">404</p>
      <h1 className="mt-3 text-3xl font-semibold text-neutral-950 sm:text-4xl">Page not found</h1>
      <p className="mt-4 text-neutral-600">This page doesn&apos;t exist yet or may have been moved.</p>
      <Link
        href="/"
        className="mt-8 rounded-md font-semibold text-neutral-950 underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-neutral-900"
      >
        Back to home
      </Link>
    </main>
  );
}
