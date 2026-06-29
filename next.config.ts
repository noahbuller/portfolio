import type { NextConfig } from "next";
import { getAllProjectSlugs } from "./src/data/projects";

const nextConfig: NextConfig = {
  async redirects() {
    const projectRedirects = getAllProjectSlugs().map((slug) => ({
      source: `/projects/${slug}`,
      destination: `/#projects/${slug}`,
      permanent: false,
    }));

    return [
      { source: "/projects", destination: "/#projects", permanent: false },
      ...projectRedirects,
      { source: "/experience", destination: "/#experience", permanent: false },
    ];
  },
};

export default nextConfig;
