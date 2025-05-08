import { getFeaturedPosts } from './_actions/getFeaturedPosts';
import { getRecentPosts } from './_actions/getRecentPosts';
import { getTrendingPosts } from './_actions/getTrendingPosts';
import BlogPageClient from './_components/BlogPageClient';

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
    <BlogPageClient
      featuredPosts={featuredPosts}
      recentPosts={recentPosts}
      trendingPosts={trendingPosts}
    />
  );
}