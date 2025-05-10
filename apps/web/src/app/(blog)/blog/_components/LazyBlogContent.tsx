'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import { FeaturedPost } from '../_actions/getFeaturedPosts';
import { BlogPost as RecentBlogPost } from '../_actions/getRecentPosts';
import { BlogPageSkeleton } from './PostSkeleton';
import { TrendingPost } from '../_actions/getTrendingPosts';

// Dynamically import the actual content component
const BlogPageClient = dynamic(() => import('./BlogPageClient'), {
    loading: () => <BlogPageSkeleton />,
    ssr: false // Only disable SSR here in a client component
});

interface LazyBlogContentProps {
    featuredPosts: FeaturedPost[];
    recentPosts: RecentBlogPost[];
    trendingPosts: TrendingPost[];
}

export default function LazyBlogContent({
    featuredPosts,
    recentPosts,
    trendingPosts
}: LazyBlogContentProps) {
    const [isClient, setIsClient] = useState(false);

    // Ensure hydration doesn't cause mismatches
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <BlogPageSkeleton />;
    }

    return (
        <Suspense fallback={<BlogPageSkeleton />}>
            <BlogPageClient
                featuredPosts={featuredPosts}
                recentPosts={recentPosts}
                trendingPosts={trendingPosts}
            />
        </Suspense>
    );
}