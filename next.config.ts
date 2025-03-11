import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/.well-known/:file',
        destination: '/api/.well-known/:file',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
