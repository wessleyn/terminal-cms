import { prisma } from '@repo/db';
import { Avatar, Button, Group, Stack, Text, Title } from '@repo/ui/components/mantine';
import { SocialIcon } from '@repo/ui/components/shared';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import UniversalNewsletter from '../_components/UniversalNewsletter';
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
                <BlogSidebar content={post.content}>
                     <div style={{ padding: "1rem" }} className="mb-4">
                                <Stack align="center">
                                    <Avatar
                                        src={post.author?.avatars[0]?.url}
                                        size={100}
                                        radius="xl"
                                        mb="sm"
                                    />
                                    <Title order={4}>{post.author?.displayName}</Title>
                                    <Text size="sm" ta="center" c="dimmed" mb="md">
                                        {post.author?.bio}
                                    </Text>
                                    <Button variant="outline" size="sm" radius="md">
                                        <Link href='/#bio'>Read my bio</Link>
                                    </Button>
                                    <Group mt="md">
                                        {post.author?.socialLinks.map((link, index) => (
                                            <Link
                                                key={`social-link-${index}`}
                                                className="text-reset"
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener"
                                                aria-label={`${link.platform} Profile`}
                                            >
                                                <SocialIcon
                                                    platform={link.platform}
                                                    size={20}
                                                    className="bi fs-5"
                                                />
                                            </Link>
                                        ))}
                                    </Group>
                                </Stack>
                            </div>
                </BlogSidebar>
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