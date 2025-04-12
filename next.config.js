/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/Colloborative-editor',
  assetPrefix: '/Colloborative-editor/',
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false
    };
    return config;
  },
}

module.exports = nextConfig 