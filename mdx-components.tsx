// mdx-components.tsx
import type { MDXComponents } from 'mdx/types';

/**
 * Next auto-loads this for MDX pages. Marking it as a Client
 * component prevents the "createContext only works in Client Components" error.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components };
}
