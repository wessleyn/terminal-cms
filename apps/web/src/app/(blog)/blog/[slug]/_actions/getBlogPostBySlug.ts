'use server';

import { BlogTagType, prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';

export async function getBlogPostBySlug(slug: string) {
    try {
        const post = await prisma.blogPost.findUnique({
            where: {
                slug
            },
            include: {
                author: {
                    include: {
                        socialLinks: {
                            select: {
                                platform: true,
                                url: true
                            }
                        },
                        avatars: {
                            select: {
                                url: true,
                            },
                            where: {
                                isActive: true
                            }
                        }
                    }
                },
                tags: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        color: true,
                        createdAt: true,
                        updatedAt: true
                    },
                    where: {
                        type: BlogTagType.BLOG // Use enum instead of string literal
                    }
                },
                comments: {
                    where: {
                        isApproved: true,
                        parentId: null // Only get top-level comments
                    },
                    orderBy: { createdAt: 'desc' },
                    include: {
                        replies: {
                            where: { isApproved: true },
                            orderBy: { createdAt: 'asc' }
                        }
                    }
                }
            }
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
