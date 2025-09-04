/** @type {import('next').NextConfig} */
const commonsEnvs = { HOST: "host" }
const envs = {
  local: { ...commonsEnvs, BASE_URL_DEV: "http://localhost:8072/v1/ejemplo" }
}
module.exports = {
  output: "standalone",
  images: { unoptimized: true },
  env: envs[process.env.STAGE || "local"],
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false
}