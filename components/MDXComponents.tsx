// components/MDXComponents.tsx
import dynamic from "next/dynamic";
import type { MDXComponents as MDXMap } from "mdx/types";

// Client-only AutoTOC (uses document)
const AutoTOC = dynamic(() => import("@/components/AutoTOC"), { ssr: false });

// Export a mapping for next-mdx-remote/rsc compileMDX(...)
export const MDXComponents: MDXMap = {
  AutoTOC,
};

// Optional: also re-export the global hook from root file
export { useMDXComponents } from "@/mdx-components";
