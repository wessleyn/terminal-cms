import { prisma } from '@repo/db';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from './_actions/getBlogPostBySlug';
import LazyBlogPostContent from './_components/LazyBlogPostContent';

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
            authors: post.author ? [post.author.displayName] : [],
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

    // Include category in relatedPosts query
    const relatedPosts = await prisma.blogPost.findMany({
        where: {
            categoryId: post.categoryId,
            id: { not: post.id },
            publishedAt: { not: null }
        },
        include: {
            tags: true,
            category: true // Include category relation
        },
        take: 4
    });

    // Format post data for the component
    return <LazyBlogPostContent
        post={{
            ...post,
            // Use category properties from the relation
            category: post.category.name,
            categorySlug: post.category.slug,
            categoryColor: post.category.color,
            // Ensure publishedAt is never null for component use
            publishedAt: post.publishedAt || new Date()
        }}
        relatedPosts={relatedPosts.map(rPost => ({
            ...rPost,
            category: rPost.category.name,
            categorySlug: rPost.category.slug,
            categoryColor: rPost.category.color
        }))}
    />;
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