import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // 🔥 FORÇAR TUDO PARA O CADASTRO GERAL (REGRA ÚNICA)
      {
        source: "/cadastro",
        destination: "/cadastro-geral",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;