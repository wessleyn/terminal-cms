'use client';

import { BlogTag, PostCategory } from '@repo/db';
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

interface PostType {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    imageUrl: string;
    category: PostCategory;
    publishedAt: Date | null;
    author: BlogPostAuthor | null;
    tags: BlogTag[];
}

interface RelatedPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    imageUrl: string;
    category: PostCategory;
    publishedAt: Date | null;
    tags: BlogTag[];
}

// Dynamically import the BlogPostClient component with SSR disabled
const BlogPostClient = dynamic(() => import('./BlogPostClient'), {
    loading: () => <BlogPostSkeleton />,
    ssr: false // Disable SSR here in a client component
});

interface LazyBlogPostContentProps {
    post: PostType;
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