import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./content/**/*.{md,mdx}", // <= include MDX files
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")], // <= pretty prose
};
export default config;
