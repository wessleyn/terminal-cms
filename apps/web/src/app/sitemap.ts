import type { MetadataRoute } from 'next';

// Single source of truth for all base routes in the application
const routes = [
    {
        path: '/',  // portfolio home
        priority: 1.0,
        changeFrequency: 'monthly' as const
    },
    {
        path: '/projects',
        priority: 0.8,
        changeFrequency: 'monthly' as const
    },
    {
        path: '/blog',
        priority: 0.8,
        changeFrequency: 'weekly' as const
    },
    {
        path: '/privacy',
        priority: 0.5,
        changeFrequency: 'yearly' as const
    },
    {
        path: '/hireMe',
        priority: 0.9,
        changeFrequency: 'monthly' as const
    }
    // Dynamic routes that need special handling are not included here
    // '/projects/[slug]' will be generated from database entries
];

export default function sitemap(): MetadataRoute.Sitemap {
    // Use environment variable for base URL or default to production URL
    const baseUrl = process.env.WEB_PUBLIC_URL || 'https://wessleyn.me';

    // Generate sitemap entries from our single source of truth
    return routes
        .map(route => ({
            url: `${baseUrl}${route.path}`,
            lastModified: new Date(),
            changeFrequency: route.changeFrequency,
            priority: route.priority,
        }));
}

// Export routes for use in other parts of the application
export { routes };
