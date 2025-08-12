import "./globals.css";

export const metadata = {
  title: "CleanIngredients",
  description: "Verified supplement ingredient marketplace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Plausible analytics – use ALL your live domains */}
        <script
          defer
          data-domain="cleaningredients.vercel.app,cleaningredients-git-main-cleaningredients.vercel.app,cleaningredients-b1bh7oyye-cleaningredients-projects.vercel.app"
          src="https://plausible.io/js/script.file-downloads.outbound-links.revenue.tagged-events.js"
        ></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
