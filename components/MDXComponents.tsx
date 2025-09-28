import type { MDXComponents as MDXMap } from "mdx/types";

// These files should each start with: "use client"
import AutoTOC from "@/components/AutoTOC";
import Callout from "@/components/Callout";

export const MDXComponents: MDXMap = {
  AutoTOC,
  Callout,
};

// Optional re-export if other code imports this
export { useMDXComponents } from "@/mdx-components";
