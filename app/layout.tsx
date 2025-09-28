// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
    ? process.env.NEXT_PUBLIC_SITE_URL!
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CleanIngredients",
    template: "%s • CleanIngredients",
  },
  description: "Verified supplement ingredient marketplace",
  // Let per-page canonicals override; layout-level canonical is optional
  openGraph: {
    type: "website",
    siteName: "CleanIngredients",
    url: siteUrl,
    title: "CleanIngredients",
    description: "Verified supplement ingredient marketplace",
    images: [{ url: "/og/information-default.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CleanIngredients",
    description: "Verified supplement ingredient marketplace",
    images: ["/og/information-default.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // --- JSON-LD payloads (define once; inject below) ---
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CleanIngredients",
    url: siteUrl,
    logo: `${siteUrl}/favicon.ico`,
    sameAs: [
      // add real profiles as you create them
      // "https://www.linkedin.com/company/cleaningredients",
      // "https://twitter.com/cleaningredients",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "info@cleaningredients.com",
      },
    ],
  };

  const webSiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CleanIngredients",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/information?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Harry Burman",
    jobTitle: "Founder",
    sameAs: ["https://www.linkedin.com/in/harry-burman-77669186/"],
    worksFor: { "@type": "Organization", name: "CleanIngredients", url: siteUrl },
  };

  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased pt-16">
        {/* Plausible */}
        <Script
          src="https://plausible.io/js/script.file-downloads.outbound-links.revenue.tagged-events.js"
          data-domain="cleaningredients.co"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`window.plausible = window.plausible || function(){(window.plausible.q = window.plausible.q || []).push(arguments)}`}
        </Script>

        {/* JSON-LD (inject once) */}
        <Script id="ld-org" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
        <Script id="ld-website" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteLd) }} />
        <Script id="ld-person" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />

        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
