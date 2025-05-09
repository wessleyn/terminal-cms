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
        take: 5,
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

export async function revalidateFeaturedPosts() {
    revalidatePath('/blog');
}
