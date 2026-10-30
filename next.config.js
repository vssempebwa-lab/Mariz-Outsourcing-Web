const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

// Keep dev chunks separate so production builds cannot overwrite a running server.
module.exports = (phase) => ({
  ...nextConfig,
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
  async redirects() {
    return [
      {
        source: '/team',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/industries',
        destination: '/clients',
        permanent: true,
      },
      {
        source: '/services/software-development',
        destination: '/services/software',
        permanent: true,
      },
      {
        source: '/services/corporate-branding',
        destination: '/services/branding',
        permanent: true,
      },
      {
        source: '/services/media-production',
        destination: '/services/media',
        permanent: true,
      },
      {
        source: '/services/call-center',
        destination: '/services/call-support-audio',
        permanent: true,
      },
      {
        source: '/services/talent-clinic',
        destination: '/programs',
        permanent: true,
      },
      {
        source: '/services/community-skilling',
        destination: '/programs',
        permanent: true,
      },
    ];
  },
});
