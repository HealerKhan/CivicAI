/** @type {import('next').NextConfig} */
const nextConfig = {
  // Leaflet requires this for SSR
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};

export default nextConfig;
