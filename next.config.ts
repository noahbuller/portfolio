import type { NextConfig } from "next";
import { getAllProjectSlugs } from "./src/data/projects";

const nextConfig: NextConfig = {
  async redirects() {
    // `{/}?` makes the trailing slash optional so `/projects/<slug>/` (a
    // plausible shared/bookmarked form) redirects the same as the
    // non-trailing-slash version instead of 404ing.
    const projectRedirects = getAllProjectSlugs().map((slug) => ({
      source: `/projects/${slug}{/}?`,
      destination: `/#projects/${slug}`,
      permanent: false,
    }));

    return [
      { source: "/projects{/}?", destination: "/#projects", permanent: false },
      ...projectRedirects,
      // Fallback for slugs that no longer exist (old bookmarks/shared links
      // to a removed project) — land on the Projects list instead of a
      // hard 404. Must come after the specific slug entries above so a
      // known slug still lands on its own detail view.
      {
        source: "/projects/:slug*",
        destination: "/#projects",
        permanent: false,
      },
      {
        source: "/experience{/}?",
        destination: "/#experience",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
