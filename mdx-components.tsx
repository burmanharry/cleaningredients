// /mdx-components.tsx
import dynamic from "next/dynamic";
import type { MDXComponents } from "mdx/types";

// Client-only since it touches `document`
const AutoTOC = dynamic(() => import("./components/AutoTOC"), { ssr: false });

export function useMDXComponents(components: MDXComponents): MDXComponents {
  // Components here become globally available in .mdx
  return { AutoTOC, ...components };
}
