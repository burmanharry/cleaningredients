import type { MDXComponents as MDXMap } from "mdx/types";

// Import client components directly (each file should start with "use client")
import AutoTOC from "./AutoTOC";
import Callout from "./Callout";

// This constant is what lib/posts.ts expects
export const MDXComponents: MDXMap = {
  AutoTOC,
  Callout,
};

// Optional: re-export the root global hook (defined in /mdx-components.tsx)
export { useMDXComponents } from "@/mdx-components";
