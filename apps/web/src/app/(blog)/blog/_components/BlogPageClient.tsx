'use client';

import { FeaturedPost } from '../_actions/getFeaturedPosts';
import { BlogPost as RecentBlogPost } from '../_actions/getRecentPosts';
import { FeaturedPostsSection } from './FeaturedPostsSection';
import { RecentPostsSection } from './RecentPostsSection';
import { TrendingPostsSection } from './TrendingPostsSection';
import UniversalNewsletter from './UniversalNewsletter';

// Define the props interface based on what the blog page needs
interface BlogPageClientProps {
    featuredPosts: FeaturedPost[];
    recentPosts: RecentBlogPost[];
    trendingPosts: FeaturedPost[];
}

export default function BlogPageClient({
    featuredPosts,
    recentPosts,
    trendingPosts
}: BlogPageClientProps) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            minHeight: 'calc(100vh - 60px)',
            overflow: 'hidden',
        }}>
            <div style={{ flex: 1, width: '100%' }}>
                <FeaturedPostsSection posts={featuredPosts} />

                <RecentPostsSection posts={recentPosts} />

                <TrendingPostsSection posts={trendingPosts} />

                <UniversalNewsletter
                    type="blog"
                    title="Subscribe to our newsletter"
                    subtitle="Stay updated with our latest articles, tutorials, and insights across all topics."
                />
            </div>
        </div>
    );
}