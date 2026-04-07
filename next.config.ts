import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },

  async redirects() {
    return [
      {
        source: "/cadastro",
        destination: "/cadastro-geral",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;