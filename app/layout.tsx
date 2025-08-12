import "./globals.css";
import Script from "next/script";

export const metadata = { title: "CleanIngredients", description: "Verified supplement ingredient marketplace" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Put Plausible in <head> and list ALL live domains */}
        <Script
          defer
          data-domain="cleaningredients-git-main-burmanharry.vercel.app,cleaningredients.vercel.app"
          src="https://plausible.io/js/script.file-downloads.outbound-links.revenue.tagged-events.js"
        />
        <Script id="plausible-init">
          {`window.plausible = window.plausible || function(){(window.plausible.q = window.plausible.q || []).push(arguments)}`}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}




