/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'skillicons.dev',
                port: '',
                pathname: '/icons/**', // Note: Added leading slash to match exact URL pattern
            }
        ],
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    // Enable transpilation of packages from the UI library
    transpilePackages: ['@repo/ui'],
    // Add any other configuration options here
};

export default nextConfig;
