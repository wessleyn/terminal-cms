'use client';

import { BlogTag } from '@repo/db'; // Remove PostCategory import
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import BlogPostSkeleton from './BlogPostSkeleton';

// Define proper types for the blog post based on project structure
interface BlogPostAuthor {
    id: string;
    displayName: string;
    bio?: string;
    avatars: Array<{ url: string; isActive?: boolean }>;
    socialLinks: Array<{ platform: string; url: string }>;
}

export interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    // Update category related fields
    category: string; // Now the category name
    categorySlug: string; // The category slug for links
    categoryColor: string; // The category color
    imageUrl: string;
    publishedAt: Date;
    author: BlogPostAuthor | null;
    tags: BlogTag[];
}

interface RelatedPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    imageUrl: string;
    // Update category field to use string instead of enum
    category: string;
    categorySlug: string;
    categoryColor: string;
    publishedAt: Date | null;
    tags: BlogTag[];
}

// Dynamically import the BlogPostClient component with SSR disabled
const BlogPostClient = dynamic(() => import('./BlogPostClient'), {
    loading: () => <BlogPostSkeleton />,
    ssr: false // Disable SSR here in a client component
});

interface LazyBlogPostContentProps {
    post: Post;
    relatedPosts: RelatedPost[];
}

export default function LazyBlogPostContent({ post, relatedPosts }: LazyBlogPostContentProps) {
    const [isClient, setIsClient] = useState(false);

    // Ensure hydration doesn't cause mismatches
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <BlogPostSkeleton />;
    }

    return (
        <Suspense fallback={<BlogPostSkeleton />}>
            <BlogPostClient post={post} relatedPosts={relatedPosts} />
        </Suspense>
    );
}