import { prisma } from '@repo/db';

export async function GET(): Promise<Response> {
    // Use environment variable for base URL
    const baseUrl = process.env.WEB_PUBLIC_URL || 'https://localhost:3000';
    const blogUrl = `${baseUrl}/blog`;

    try {
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
        });

        // Start building the XML sitemap
        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${blogUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

        // Add each blog post to the sitemap
        for (const post of posts) {
            const lastMod = post.updatedAt || post.publishedAt;
            sitemap += `
  <url>
    <loc>${blogUrl}/${post.slug}</loc>
    <lastmod>${lastMod.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
        }

        // Close the XML structure
        sitemap += `
</urlset>`;

        // Return the XML response
        return new Response(sitemap, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
            },
        });
    } catch (error) {
        console.error('Error generating sitemap:', error);
        return new Response('Error generating sitemap', {
            status: 500,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }
}