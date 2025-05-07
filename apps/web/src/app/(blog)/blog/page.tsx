import { Suspense } from 'react';
import { getFeaturedPosts } from './_actions/getFeaturedPosts';
import { getRecentPosts } from './_actions/getRecentPosts';
import { getTrendingPosts } from './_actions/getTrendingPosts';
import { FeaturedPostsSection } from './_components/FeaturedPostsSection';
import { RecentPostsSection } from './_components/RecentPostsSection';
import { TrendingPostsSection } from './_components/TrendingPostsSection';
import UniversalNewsletter from './_components/UniversalNewsletter';
// Set revalidation time to 1 hour
export const revalidate = 3600;

export default async function BlogPage() {
  // Fetch data in parallel
  const [featuredPosts, recentPosts, trendingPosts] = await Promise.all([
    getFeaturedPosts(),
    getRecentPosts(),
    getTrendingPosts(),
  ]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      minHeight: 'calc(100vh - 60px)',
      overflow: 'hidden',
    }}>
      <div style={{ flex: 1, width: '100%' }}>
        {/* Featured Posts Section - Full viewport height initially */}
        <Suspense fallback={<div>Loading featured posts...</div>}>
          <FeaturedPostsSection posts={featuredPosts} />
        </Suspense>

        {/* Recent Posts Section */}
        <Suspense fallback={<div>Loading recent posts...</div>}>
          <RecentPostsSection posts={recentPosts} />
        </Suspense>

        {/* Trending Posts Section */}
        <Suspense fallback={<div>Loading trending posts...</div>}>
          <TrendingPostsSection posts={trendingPosts} />
        </Suspense>

        <UniversalNewsletter
          type="blog"
          title="Subscribe to our newsletter"
          subtitle="Stay updated with our latest articles, tutorials, and insights across all topics."
        />
      </div>

    </div>
  );
}