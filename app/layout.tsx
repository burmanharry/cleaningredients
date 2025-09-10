import "./globals.css";
import { Crisp } from "./(lib)/crisp";
import Footer from "@/components/Footer";

export const metadata = {
  title: "CleanIngredients",
  description: "Verified supplement ingredient marketplace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          data-domain="cleaningredients.vercel.app"
          src="https://plausible.io/js/script.file-downloads.outbound-links.revenue.tagged-events.js"
        ></script>
        <script
          id="plausible-init"
          dangerouslySetInnerHTML={{
            __html:
              'window.plausible = window.plausible || function(){(window.plausible.q = window.plausible.q || []).push(arguments)}',
          }}
        />
      </head>
      <body>
        <Crisp />
        {children}
      </body>
    </html>
  );
}
