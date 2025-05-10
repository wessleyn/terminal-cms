'use server';

import { prisma } from '@repo/db';

export type TrendingPost = {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: {
        name: string;
        slug: string;
        color: string;
    };
    imageUrl: string;
    publishedAt: Date | null;
    author: {
        id: string;
        name: string;
        avatarUrl: string | null;
    } | null;
    tags: {
        id: string;
        name: string;
        slug: string;
        color: string;
    }[];
};

export async function getTrendingPosts(): Promise<TrendingPost[]> {
    // Fetch posts with comment counts for trending calculation
    const posts = await prisma.blogPost.findMany({
        where: {
            publishedAt: {
                not: null,
            },
        },
        include: {
            category: {
                select: {
                    name: true,
                    slug: true,
                    color: true
                }
            },
            author: {
                select: {
                    id: true,
                    displayName: true,
                    avatars: {
                        select: {
                            url: true,
                        },
                        where: {
                            isActive: true,
                        },
                        take: 1,
                    }
                },
            },
            tags: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    color: true,
                },
            },
            _count: {
                select: {
                    comments: true
                }
            }
        },
        // Use a more Prisma-friendly way for ordering
        orderBy: [
            { comments: { _count: 'desc' } },
            { publishedAt: 'desc' }
        ],
        take: 4,
    });

    // Format the posts with proper structure
    return posts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        category: post.category,
        imageUrl: post.imageUrl,
        publishedAt: post.publishedAt,
        author: post.author ? {
            id: post.author.id,
            name: post.author.displayName,
            avatarUrl: post.author.avatars[0]?.url || null
        } : null,
        tags: post.tags
    }));
}

// Export this type alias for backward compatibility with any components
// that might be importing FeaturedPost
export type { TrendingPost as FeaturedPost };
