import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX({
  // Allow importing .md/.mdx files as pages or modules
  pageExtensions: ["ts", "tsx", "md", "mdx"],
});
