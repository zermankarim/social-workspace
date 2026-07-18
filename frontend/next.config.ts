import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const apiUrl = (process.env.API_URL ?? "http://localhost:8000").replace(
  /\/$/,
  "",
);
const apiPath = (process.env.NEXT_PUBLIC_API_URL ?? "/api/v1").replace(
  /^\//,
  "",
);

const frontendRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Keep Turbopack rooted at frontend/ even if a parent lockfile exists.
  turbopack: {
    root: frontendRoot,
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/feed",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: `/${apiPath}/:path*`,
        destination: `${apiUrl}/${apiPath}/:path*`,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
