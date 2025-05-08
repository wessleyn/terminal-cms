import { Metadata } from 'next';
import { getFeaturedPosts } from './_actions/getFeaturedPosts';
import { getRecentPosts } from './_actions/getRecentPosts';
import { getTrendingPosts } from './_actions/getTrendingPosts';
import LazyBlogContent from './_components/LazyBlogContent';

// Set revalidation time to 1 hour
export const revalidate = 3600;

// Add metadata with dynamic: 'force-static' to ensure this page is built statically
export const metadata: Metadata = {
  title: 'Blog | Magical Insights',
  description: 'Explore articles about spells, potions, scrolls, and magical artifacts',
  alternates: {
    canonical: '/blog'
  }
};

// Add generateStaticParams to ensure this page is pre-rendered at build time
export async function generateStaticParams() {
  return [{}]; // Empty object indicates we want to pre-render the index route
}

export default async function BlogPage() {
  // Fetch data in parallel
  const [featuredPosts, recentPosts, trendingPosts] = await Promise.all([
    getFeaturedPosts(),
    getRecentPosts(),
    getTrendingPosts(),
  ]);

  return (
    <LazyBlogContent
      featuredPosts={featuredPosts}
      recentPosts={recentPosts}
      trendingPosts={trendingPosts}
    />
  );
}