import "./globals.css";
import { Crisp } from "./(lib)/crisp";

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
      <body>
        <Crisp />
        {children}
      </body>
    </html>
  );
}


