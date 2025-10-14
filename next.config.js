import withPWA from 'next-pwa'

/** @type {import('next').NextConfig} */


const commonsEnvs = { HOST: "host" }

const envs = {
  local: { ...commonsEnvs, BASE_URL_DEV: "http://localhost:8072/v1/ejemplo" }
}


const nextConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})( {
  swcMinify: true,
  output: 'export',
  distDir: 'out',
  env: envs[process.env.STAGE || "local"],
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
})


export default nextConfig
