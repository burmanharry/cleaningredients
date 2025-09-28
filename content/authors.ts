// content/authors.ts
export type Author = {
  slug: string;
  name: string;
  title?: string;
  avatar?: string;        // e.g. /images/authors/harry.jpg
  bio?: string;
  sameAs?: string[];      // LinkedIn, etc.
};

export const AUTHORS: Record<string, Author> = {
  "harry-burman": {
    slug: "harry-burman",
    name: "Harry Burman",
    title: "Founder",
    avatar: "/images/authors/harry.jpg",
    bio: "Founder at CleanIngredients. Focused on supplier verification, lab testing, and buyer protection.",
    sameAs: ["https://www.linkedin.com/in/harry-burman-77669186/"],
  },
};
