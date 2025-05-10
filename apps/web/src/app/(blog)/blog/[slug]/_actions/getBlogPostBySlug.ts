'use server';

import { BlogTagType, prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';

export async function getBlogPostBySlug(slug: string) {
    try {
        const post = await prisma.blogPost.findUnique({
            where: {
                slug: slug,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        displayName: true,
                        tagline: true,
                        bio: true,
                        createdAt: true,
                        updatedAt: true,
                        workEmail: true,
                        avatars: {
                            select: {
                                url: true,
                            },
                            where: {
                                isActive: true,
                            },
                        },
                        socialLinks: {
                            select: {
                                platform: true,
                                url: true,
                            },
                        },
                    },
                },
                tags: {
                    where: {
                        type: BlogTagType.BLOG // Use enum instead of string literal
                    }
                },
                // Include the category relation
                category: true,
                comments: {
                    where: {
                        isApproved: true,
                        parentId: null, // Only top-level comments
                    },
                    include: {
                        replies: {
                            where: {
                                isApproved: true,
                            },
                            orderBy: {
                                createdAt: 'asc',
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });

        return post;
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return null;
    }
}

export async function revalidateBlogPost(slug: string) {
    revalidatePath(`/blog/${slug}`);
}
