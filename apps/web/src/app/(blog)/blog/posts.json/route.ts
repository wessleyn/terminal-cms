import { prisma } from '@repo/db';

export async function GET(): Promise<Response> {
    // Use environment variable for base URL
    const baseUrl = process.env.WEB_PUBLIC_URL || 'https://localhost:3000';
    const blogUrl = `${baseUrl}/blog`;

    try {
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
            select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                imageUrl: true,
                publishedAt: true,
                updatedAt: true,
                category: true,
                author: {
                    select: {
                        displayName: true,
                        workEmail: true,
                        avatars: {
                            select: {
                                url: true,
                            },
                            where: {
                                isActive: true,
                            },
                            take: 1, // Get only the active avatar
                        }
                    },
                },
                tags: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });

        // Transform dates to ISO strings and add full URLs
        const serializedPosts = posts.map(post => ({
            ...post,
            publishedAt: post.publishedAt?.toISOString(),
            updatedAt: post.updatedAt?.toISOString(),
            url: `${blogUrl}/${post.slug}`, // Add the full URL to each post
        }));

        // Return the JSON response
        return new Response(JSON.stringify(serializedPosts), {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
            },
        });
    } catch (error) {
        console.error('Error generating JSON feed:', error);
        return new Response(JSON.stringify({ error: 'Error generating JSON feed' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}