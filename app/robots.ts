// app/robots.ts
import type { MetadataRoute } from "next";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // keep non-content routes out of the index
      disallow: ["/api/", "/cart", "/checkout", "/admin"],
    },
    sitemap: [`${siteUrl}/sitemap.xml`],
    host: siteUrl, // optional but nice
  };
}
