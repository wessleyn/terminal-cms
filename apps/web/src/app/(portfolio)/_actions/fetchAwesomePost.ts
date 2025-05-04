'use server';

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
    tags?: string[];
}

// Cache the function to avoid redundant DB calls
export const fetchAwesomePost = cache(
    async (): Promise<BlogPost[]> => {
        try {
            // TODO: Implement actual data fetching from your database
            // For now, return an empty array as a skeleton
            return [];

            // When you implement the actual fetching, it might look something like:
            // const posts = await prisma.blogPost.findMany({
            //   where: {
            //     featured: true,
            //     published: true
            //   },
            //   orderBy: {
            //     publishedAt: 'desc'
            //   },
            //   take: 4
            // });
            // return posts.map(post => ({
            //   id: post.id,
            //   title: post.title,
            //   excerpt: post.excerpt,
            //   coverImage: post.coverImage || undefined,
            //   date: post.publishedAt.toISOString(),
            //   readTime: post.readTime,
            //   slug: post.slug,
            //   tags: post.tags
            // }));
        } catch (error) {
            console.error('Error fetching awesome posts:', error);
            return [];
        }
    }
);

export default fetchAwesomePost;