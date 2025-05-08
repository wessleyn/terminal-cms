import { prisma } from '@repo/db';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import UniversalNewsletter from '../_components/UniversalNewsletter';
import fetchAuthorProfile from './_actions/fetchAuthorProfile';
import { getBlogPostBySlug } from './_actions/getBlogPostBySlug';
import BlogPostHeader from './_components/BlogPostHeader';
import BlogSidebar from './_components/BlogSidebar';
import MainContent from './_components/MainContent';
import RelatedPosts from './_components/RelatedPosts';

export const revalidate = 3600; // Revalidate at most every hour

interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Generate metadata for the page
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    
    const post = await getBlogPostBySlug(resolvedParams.slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }


    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.publishedAt?.toISOString(),
            authors: post.author ? [post.author.name] : [],
            images: [
                {
                    url: post.imageUrl,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const resolvedParams = await params;
    const post = await getBlogPostBySlug(resolvedParams.slug);
    
    if (!post) {
        notFound();
    }
    const author = await fetchAuthorProfile();

    // Fetch related posts
    const relatedPosts = await prisma.blogPost.findMany({
        where: {
            category: post.category,
            id: { not: post.id },
            publishedAt: { not: null }
        },
        include: {
            tags: true
        },
        take: 4
    });

    return (
        <>
            <BlogPostHeader
                title={post.title}
                category={post.category.toString()}
                author={post.author}
                date={post.publishedAt}
                imageUrl={post.imageUrl}
            />
            <MainContent post={post}>
                <BlogSidebar author={author} content={post.content} />
            </MainContent> 
            <RelatedPosts posts={relatedPosts} />
            <UniversalNewsletter
                type="post"
                postId={post.id}
                title="Subscribe to this post"
                subtitle="Get notified about updates and follow-ups to this article."
            />
        </>
    );
}

export async function generateStaticParams() {
    try {
        const posts = await prisma.blogPost.findMany({
            where: {
                publishedAt: {
                    not: null,
                },
            },
            select: {
                slug: true,
            },
        });

        return posts.map((post) => ({
            slug: post.slug,
        }));
    } catch (error) {
        console.error("Error generating static params:", error);
        return []; // Return empty array if there's an error
    }
}