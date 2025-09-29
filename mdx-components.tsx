import type { MDXComponents } from "mdx/types";
import AutoTOC from "./components/AutoTOC";
import Callout from "./components/Callout";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { AutoTOC, Callout, ...components };
}
