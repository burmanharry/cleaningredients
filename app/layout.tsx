import "./globals.css";
import Script from "next/script";

export const metadata = { title: "CleanIngredients", description: "Verified supplement ingredient marketplace" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Plausible */}
        <Script
          defer
          data-domain="cleaningredients.vercel.app"  // <-- use the exact domain shown in your Plausible snippet
          src="https://plausible.io/js/script.file-downloads.outbound-links.revenue.tagged-events.js" // <-- use the exact src from your snippet
        />
        <Script id="plausible-init">
          {`window.plausible = window.plausible || function(){(window.plausible.q = window.plausible.q || []).push(arguments)}`}
        </Script>
      </body>
    </html>
  );
}




