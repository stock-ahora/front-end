import withPWA from 'next-pwa'

/** @type {import('next').NextConfig} */

const commonsEnvs = { HOST: 'host' }
const envs = {
    local: { ...commonsEnvs, BASE_URL_DEV: 'http://localhost:8072/v1/ejemplo' },
}

const baseConfig = {
    swcMinify: true,
    env: envs[process.env.STAGE || 'local'],
    typescript: { ignoreBuildErrors: true },
    reactStrictMode: false,
    images: { unoptimized: true },
}

const withPwa = withPWA({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
})

const nextConfig = withPwa(baseConfig)
export default nextConfig
