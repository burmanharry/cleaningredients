import dynamic from "next/dynamic";
import type { MDXComponents as MDXMap } from "mdx/types";

// Client-only components
const AutoTOC = dynamic(() => import("@/components/AutoTOC"), { ssr: false });
const Callout = dynamic(() => import("@/components/Callout"), { ssr: false }); // ✅ add this import

// Export a mapping for next-mdx-remote/rsc compileMDX(...)
export const MDXComponents: MDXMap = {
  AutoTOC,
  Callout,  // ✅ now it’s defined
};

// Optional: also re-export the global hook from root file
export { useMDXComponents } from "@/mdx-components";
