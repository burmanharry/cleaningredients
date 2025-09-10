// components/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-white/20 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            CleanIngredients
          </Link>

          <nav className="hidden items-center gap-6 text-base sm:flex">
            <Link href="/ingredients" className="hover:underline">Browse</Link>
            <Link href="/information" className="hover:underline">Information</Link>
            <Link href="/FAQ" className="hover:underline">FAQ</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="rounded-full border px-3 py-1.5 text-base shadow-sm hover:bg-neutral-50"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}