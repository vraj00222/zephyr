import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* pressed editions live in data/papers — make sure the serverless bundle
     carries them so /paper/[slug] can read them on Vercel */
  outputFileTracingIncludes: {
    "/paper/[slug]": ["./data/papers/**"],
    "/paper/[slug]/poster": ["./data/papers/**"],
    "/api/papers/[slug]/ask": ["./data/papers/**"],
  },
};

export default nextConfig;
