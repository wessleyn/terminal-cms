/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'skillicons.dev',
                port: '',
                pathname: '/icons/**',
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
        serverActions: {
            allowedOrigins: ['localhost:3000'],
        },
    },
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig)
