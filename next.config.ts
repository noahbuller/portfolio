import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/projects", destination: "/#projects", permanent: false },
      { source: "/projects/:slug", destination: "/#projects/:slug", permanent: false },
      { source: "/experience", destination: "/#experience", permanent: false },
    ];
  },
};

export default nextConfig;
