import "./globals.css";
import Script from "next/script";

export const metadata = { title: "CleanIngredients", description: "Verified supplement ingredient marketplace" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script defer data-domain="cleaningredients.vercel.app" src="https://plausible.io/js/script.js" />
      </body>
    </html>
  );
}



