'use server';

import { PostCategory, prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';

export type FeaturedPost = {
    id: string;
    title: string;
    slug: string;
    imageUrl: string;
    category: PostCategory;
    publishedAt: Date | null;
    color: string;
};

export async function getTrendingPosts(): Promise<FeaturedPost[]> {
    // In a real app, you might determine trending posts based on views, likes, etc.
    // Here we're just getting some published posts
    const posts = await prisma.blogPost.findMany({
        where: {
            publishedAt: {
                not: null,
            },
        },
        select: {
            id: true,
            title: true,
            slug: true,
            imageUrl: true,
            category: true,
            publishedAt: true,
            tags: {
                select: {
                    color: true,
                },
                take: 1,
            },
        },
        orderBy: {
            publishedAt: 'desc',
        },
        skip: 5, // Skip featured posts
        take: 4,
    });

    return posts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        imageUrl: post.imageUrl,
        category: post.category,
        publishedAt: post.publishedAt,
        color: post.tags[0]?.color || 'blue',
    }));
}

export async function revalidateTrendingPosts() {
    revalidatePath('/blog');
}
