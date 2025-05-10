import { prisma } from '@repo/db';
import RSS from 'rss';

// Helper function to sanitize HTML content for RSS feeds
function sanitizeHtmlForRss(html: string): string {
    if (!html) return '';

    // Replace self-closing header tags that cause validation issues
    return html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        // Fix header tags - replace any self-closing headers with properly opened/closed pairs
        .replace(/<(h[1-6])\/>/g, '<$1></$1>')
        // Fix other common self-closing tags that should be paired in HTML
        .replace(/<(p|div|span|section|article|header|footer)\/>/g, '<$1></$1>');
}

export async function GET(): Promise<Response> {
    // Use environment variable for base URL
    const baseUrl = process.env.WEB_PUBLIC_URL || 'https://localhost:3000';
    const blogUrl = `${baseUrl}/blog`;

    try {
        // Get blog site information
        const siteTitle = 'Terminal Blog';
        const siteDescription = 'Tech articles and coding insights by Wessley N';

        // Create a new RSS feed instance
        const feed = new RSS({
            title: siteTitle,
            description: siteDescription,
            feed_url: `${blogUrl}/feed.xml`,
            site_url: blogUrl,
            image_url: `${baseUrl}/blog-dark.png`,
            managingEditor: 'blog@wessleyn.me (Wessley Nyakanyanga)',
            webMaster: 'blog@wessleyn.me (Wessley Nyakanyanga)',
            copyright: `${new Date().getFullYear()} Wessley N`,
            language: 'en',
            pubDate: new Date(),
            ttl: 60, // Time to live in minutes
        });

        // Fetch all published blog posts with author and tags
        const posts = await prisma.blogPost.findMany({
            where: {
                publishedAt: {
                    not: null,
                },
            },
            orderBy: {
                publishedAt: 'desc',
            },
            include: {
                author: true,
                tags: true,
            },
            take: 20, // Limit to last 20 posts for feed size
        });

        // Add each blog post to the feed
        for (const post of posts) {
            const postUrl = `${blogUrl}/${post.slug}`;

            feed.item({
                title: post.title,
                description: post.excerpt || '',
                url: postUrl,
                guid: post.id,
                categories: post.tags.map(tag => tag.name),
                author: `post@wessleyn.me (${post.author?.displayName})`,
                date: post.publishedAt || new Date(),
                enclosure: post.imageUrl ? {
                    url: post.imageUrl,
                    type: 'image/jpeg',
                } : undefined,
                custom_elements: [
                    {
                        'content:encoded': { _cdata: sanitizeHtmlForRss(post.content || '') }
                    },
                ],
            });
        }

        // Generate the XML and return the response
        const rssXml = feed.xml({ indent: true });

        return new Response(rssXml, {
            headers: {
                'Content-Type': 'application/rss+xml; charset=utf-8',
                'X-Content-Type-Options': 'nosniff',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
            },
        });
    } catch (error) {
        console.error("Error generating RSS feed:", error);
        return new Response('Error generating RSS feed', {
            status: 500,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }
}