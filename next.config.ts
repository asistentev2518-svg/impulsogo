import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  adapterPath: process.env.NEXT_ADAPTER_PATH
    ? path.join(process.cwd(), "vercel-next-adapter.cjs")
    : undefined,
};

export default nextConfig;
