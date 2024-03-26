/** @type {import('next').NextConfig} */
const nextConfig = {
    // Добавляем webpack конфигурацию
    compiler: {
      removeConsole: false,
    },
    
    experimental: {
        esmExternals: "loose",
        serverComponentsExternalPackages: ["mongoose"]
      },
      reactStrictMode: false,
}

module.exports = nextConfig
