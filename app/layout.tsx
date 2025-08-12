import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "CleanIngredients",
  description: "Verified supplement ingredient marketplace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          defer
          data-domain="cleaningredients.vercel.app,cleaningredients-git-main-cleaningredients.vercel.app,cleaningredients-b1bh7oyye-cleaningredients-projects.vercel.app"
          src="https://plausible.io/js/script.file-downloads.outbound-links.revenue.tagged-events.js"
        />
        <Script id="plausible-init">
          {`window.plausible = window.plausible || function(){(wind





