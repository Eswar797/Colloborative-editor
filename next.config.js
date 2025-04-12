/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  output: 'export',
  basePath: '/Colloborative-editor',
  assetPrefix: '/Colloborative-editor/',
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false
    };
    return config;
  },
}

module.exports = nextConfig 