'use server';

import { PostCategory, prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';

export type BlogPost = {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: PostCategory;
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

export async function getRecentPosts(): Promise<BlogPost[]> {
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
            excerpt: true,
            category: true,
            imageUrl: true,
            publishedAt: true,
            featured: true,
            author: {
                select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
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

    return posts;
}

export async function revalidateRecentPosts() {
    revalidatePath('/blog');
}
