import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/entrada",
        permanent: false,
      },
      {
        source: "/cadastro",
        destination: "/cadastro-geral",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;