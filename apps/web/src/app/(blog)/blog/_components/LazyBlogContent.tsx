'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import { FeaturedPost } from '../_actions/getFeaturedPosts';
import { BlogPost as RecentBlogPost } from '../_actions/getRecentPosts';

// Dynamically import the actual content component
const BlogPageClient = dynamic(() => import('./BlogPageClient'), {
    loading: () => <div className="loading-placeholder">Loading blog content...</div>,
    ssr: false // Only disable SSR here in a client component
});

interface LazyBlogContentProps {
    featuredPosts: FeaturedPost[];
    recentPosts: RecentBlogPost[];
    trendingPosts: FeaturedPost[];
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
        return <div className="loading-placeholder">Loading blog content...</div>;
    }

    return (
        <Suspense fallback={<div className="loading-placeholder">Loading blog content...</div>}>
            <BlogPageClient
                featuredPosts={featuredPosts}
                recentPosts={recentPosts}
                trendingPosts={trendingPosts}
            />
        </Suspense>
    );
}