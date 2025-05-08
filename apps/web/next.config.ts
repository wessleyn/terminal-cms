/** @type {import('next').NextConfig} */
const nextConfig = {}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'skillicons.dev',
                port: '',
                pathname: '/icons/**', // Note: Added leading slash to match exact URL pattern
            },
            // google
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            // github
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
        ],
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    transpilePackages: [
        '@mantine/core',
        '@mantine/hooks',
        '@mantine/dates',
        '@mantine/carousel',
        '@mantine/charts',
        '@mantine/code-highlight',
        '@mantine/dropzone',
        '@mantine/form',
        '@mantine/modals',
        '@mantine/notifications',
        '@mantine/nprogress',
        '@mantine/spotlight',
        '@mantine/tiptap',
        '@repo/ui',
        '@repo/ui/components/mantine',
    ],
    experimental: {
        optimizePackageImports: [
            '@mantine/core',
            '@mantine/hooks',
            '@mantine/dates',
            '@mantine/carousel',
            '@mantine/charts',
            '@mantine/code-highlight',
            '@mantine/dropzone',
            '@mantine/form',
            '@mantine/modals',
            '@mantine/notifications',
            '@mantine/nprogress',
            '@mantine/spotlight',
            '@mantine/tiptap',
            '@repo/ui',
            '@repo/ui/components/mantine',
        ],
        appDir: true,
        serverActions: true,
    },
    serverExternalPackages: [
        '@mantine',
        '@mantine/**',
        '@mantine/core',
        '@mantine/hooks',
        '@mantine/dates',
        '@mantine/carousel',
        '@mantine/charts',
        '@mantine/code-highlight',
        '@mantine/dropzone',
        '@mantine/form',
        '@mantine/modals',
        '@mantine/notifications',
        '@mantine/nprogress',
        '@mantine/spotlight',
        '@mantine/tiptap',
        '@repo/ui',
        '@repo/ui/components/mantine',
    ],

    enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
