import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

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
      {
        source: '/perf/:match*',
        destination: 'https://www.ctos.sh/_vercel/speed-insights/:match*',
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
