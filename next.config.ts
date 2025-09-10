// next.config.ts
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// Enable MDX pages/imports
const withMDX = createMDX({ extension: /\.mdx?$/ });

// Your existing image config (kept)
const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  { protocol: "https", hostname: "images.unsplash.com" },
];

const supa = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (supa) {
  try {
    const host = new URL(supa).host;
    remotePatterns.push({ protocol: "https", hostname: host });
  } catch {
    // ignore bad env URL
  }
}

const nextConfig: NextConfig = {
  images: { remotePatterns },
  pageExtensions: ["ts", "tsx", "md", "mdx"], // allow MD/MDX routes
};

export default withMDX(nextConfig);
