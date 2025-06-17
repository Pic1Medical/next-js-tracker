const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@amplify": path.resolve(__dirname, "amplify"),
      "@components": path.resolve(__dirname, "src/components"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@app": path.resolve(__dirname, "src/app"),
      "@src": path.resolve(__dirname, "src"),
      "@lib": path.resolve(__dirname, "lib"),
      "@": path.resolve(__dirname),
    };
    return config;
  },
};

module.exports = nextConfig;
