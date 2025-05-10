import { BlogTagType, prisma } from '@repo/db';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Use environment variable for base URL or default to production URL
    const baseUrl = process.env.WEB_PUBLIC_URL || 'https://wessleyn.me';
    const blogUrl = `${baseUrl}/blog`;

    // Basic blog pages with their metadata
    const blogPages = [
        // Main pages
        { path: '/', priority: 0.9, changeFrequency: 'daily' as const },
        { path: '/feed.xml', priority: 0.5, changeFrequency: 'daily' as const },
        // Additional pages from directory structure
        { path: '/tags', priority: 0.7, changeFrequency: 'weekly' as const },
        { path: '/privacy', priority: 0.5, changeFrequency: 'monthly' as const },
        { path: '/terms', priority: 0.5, changeFrequency: 'monthly' as const },
    ];

    // Create entries for all static blog pages
    const staticPageEntries = blogPages.map(page => ({
        url: `${blogUrl}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
    })).filter(entry => entry.url !== blogUrl); // Remove duplicate of root blog URL

    // Fetch all published blog posts
    const posts = await prisma.blogPost.findMany({
        where: {
            publishedAt: {
                not: null,
            },
        },
        select: {
            slug: true,
            updatedAt: true,
            publishedAt: true,
        },
        orderBy: {
            publishedAt: 'desc',
        },
    });

    // Generate sitemap entries for each blog post
    const postEntries = posts.map((post) => ({
        url: `${blogUrl}/${post.slug}`,
        lastModified: post.updatedAt || post.publishedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // Fetch all tags - add filter for BLOG type
    const tags = await prisma.blogTag.findMany({
        where: {
            type: BlogTagType.BLOG, // Use enum instead of string literal
        },
        select: {
            slug: true,
            updatedAt: true,
        },
    });

    // Generate sitemap entries for each tag page
    const tagEntries = tags.map((tag) => ({
        url: `${blogUrl}/tag/${tag.slug}`,
        lastModified: tag.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    // Fetch categories from enum (using posts to get all used categories)
    const categories = await prisma.blogPost.findMany({
        where: {
            publishedAt: {
                not: null,
            },
        },
        distinct: ['category'],
        select: {
            category: true,
        },
    });

    // Generate sitemap entries for category pages
    const categoryEntries = categories.map((item) => ({
        url: `${blogUrl}/category/${item.category.toLowerCase()}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    // Combine all entries
    return [
        ...staticPageEntries,
        ...postEntries,
        ...tagEntries,
        ...categoryEntries,
    ];
}
