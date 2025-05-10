'use server';

import { prisma } from '@repo/db';

export type FeaturedPost = {
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
    featured: boolean;
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

export async function getFeaturedPosts(): Promise<FeaturedPost[]> {
    const posts = await prisma.blogPost.findMany({
        where: {
            featured: true,
            publishedAt: {
                not: null,
            },
        },
        select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            category: {
                select: {
                    name: true,
                    slug: true,
                    color: true
                }
            },
            imageUrl: true,
            publishedAt: true,
            featured: true,
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
        },
        orderBy: {
            publishedAt: 'desc',
        },
        take: 6,
    });

    return posts.map(post => ({
        ...post,
        author: post.author ? {
            id: post.author.id,
            name: post.author.displayName,
            avatarUrl: post.author.avatars[0]?.url || null
        } : null
    }));
}
