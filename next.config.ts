import type { NextConfig } from "next";
// import { webpack } from "next/dist/compiled/webpack/webpack";
import webpack from "webpack";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true
  },
  reactStrictMode: true,
  webpack: config => {
    config.plugins.push(
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify('cesium')
      })
    )
    return config;
  }
};

export default nextConfig;
