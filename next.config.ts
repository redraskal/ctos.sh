import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  transpilePackages: ['three'],
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  rewrites: async () => {
    return [
      {
        source: '/science/:match*',
        destination: 'https://www.ctos.sh/_vercel/insights/:match*',
      },
    ];
  },
};

export default nextConfig;
