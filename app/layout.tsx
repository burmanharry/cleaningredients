// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


const siteUrl =
 process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
   ? process.env.NEXT_PUBLIC_SITE_URL
   : process.env.VERCEL_URL
     ? `https://${process.env.VERCEL_URL}`
     : "http://localhost:3000";


export const metadata: Metadata = {
 title: "CleanIngredients",
 description: "Verified supplement ingredient marketplace",
 metadataBase: new URL(siteUrl),
};


export const viewport: Viewport = {
 width: "device-width",
 initialScale: 1,
 colorScheme: "light",
 themeColor: "#ffffff",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
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


       <Header />
       {children}
       <Footer />
     </body>
   </html>
 );
}



