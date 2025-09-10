// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="mx-auto max-w-6xl px-6 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
        
        {/* Logo / Branding */}
        <div className="col-span-2 sm:col-span-1">
          <h3 className="text-xl font-semibold text-white">CleanIngredients</h3>
          <p className="mt-3 text-sm text-neutral-400 leading-6">
            Trusted marketplace for verified, lab-tested natural ingredients.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-sm font-semibold text-white">Navigate</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/ingredients" className="hover:text-white transition">
                Browse
              </Link>
            </li>
            <li>
              <Link href="/members" className="hover:text-white transition">
                Members
              </Link>
            </li>
            <li>
              <Link href="/information/refund-policy" className="hover:underline">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/information/disclaimer" className="hover:underline">
                Disclaimer
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-semibold text-white">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/information/contact" className="hover:underline">
                Contact Form
              </Link>
            </li>
            <li>
              <a href="mailto:info@cleaningredients.com" className="hover:text-white transition">
                info@cleaningredients.com
              </a>
            </li>
            <li>
              <a
                href="https://www.google.com/maps/search/?api=1&query=211+Hope+St,+Mountain+View,+CA+94041"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                211 Hope St, Mountain View, CA 94041
              </a>
            </li>
          </ul>
        </div>

        {/* Get Started */}
        <div>
          <h4 className="text-sm font-semibold text-white">Get Started</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/signup" className="hover:text-white transition">
                Join Members
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-neutral-800 py-4 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} CleanIngredients. All rights reserved.
      </div>
    </footer>
  );
}