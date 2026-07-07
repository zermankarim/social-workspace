import type { NextConfig } from "next";

const apiUrl = process.env.API_URL ?? "http://localhost:8000";
const apiPath = (process.env.NEXT_PUBLIC_API_URL ?? "/api/v1").replace(
  /^\//,
  "",
);

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: `/${apiPath}/:path*`,
        destination: `${apiUrl}/${apiPath}/:path*`,
      },
    ];
  },
};

export default nextConfig;
