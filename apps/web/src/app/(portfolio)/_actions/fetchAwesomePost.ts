'use server';

import { PostCategory, prisma } from '@repo/db';
import { cache } from 'react';

// Define the type for blog post data
export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    coverImage?: string;
    date: string;
    readTime?: string;
    slug: string;
    category: PostCategory;
    tags?: {
        id: string;
        name: string;
        color: string;
    }[];
}

// Cache the function to avoid redundant DB calls
export const fetchAwesomePost = cache(
    async (): Promise<BlogPost[]> => {
        try {
            // Fetch random published blog posts
            const posts = await prisma.blogPost.findMany({
                where: {
                    publishedAt: {
                        not: null,
                    }
                },
                include: {
                    tags: {
                        select: {
                            id: true,
                            name: true,
                            color: true
                        }
                    }
                },
                // Use random ordering to get different posts each time
                orderBy: {
                    // Use a random function in the database
                    id: 'asc' // Will be randomized by taking random skip count
                },
                take: 2
            });

            // Randomly select posts by using a random skip value
            const count = await prisma.blogPost.count({
                where: { publishedAt: { not: null } }
            });

            // Get 2 random posts using a different approach if count > 2
            const randomPosts = count > 2
                ? await prisma.blogPost.findMany({
                    where: { publishedAt: { not: null } },
                    include: {
                        tags: {
                            select: {
                                id: true,
                                name: true,
                                color: true
                            }
                        }
                    },
                    skip: Math.floor(Math.random() * (count - 2)),
                    take: 2
                })
                : posts;

            return randomPosts.map(post => ({
                id: post.id,
                title: post.title,
                excerpt: post.excerpt || '',
                coverImage: post.imageUrl,
                date: post.publishedAt?.toISOString() || new Date().toISOString(),
                readTime: '5 min', // You could calculate this based on content length
                slug: post.slug,
                category: post.category,
                tags: post.tags
            }));
        } catch (error) {
            console.error('Error fetching awesome posts:', error);
            return [];
        }
    }
);

export default fetchAwesomePost;