import "./globals.css";

export const metadata = {
  title: "CleanIngredients",
  description: "Verified supplement ingredient marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
import "./globals.css";
import { Crisp } from "./(lib)/crisp";

export const metadata = { title: "CleanIngredients" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Crisp />
        {children}
        import Script from "next/script";
// ...
<Script
  defer
  data-domain="yourdomain.com" // or vercel.app domain
  src="https://plausible.io/js/script.js"
/>

      </body>
    </html>
  );
}


