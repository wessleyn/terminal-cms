'use client';

import { Avatar, Button, Group, Stack, Text, Title } from '@mantine/core';
import { BlogTag } from '@repo/db';
import SocialIcon from '@repo/ui/components/shared/SocialIcon';
import Link from 'next/link';
import UniversalNewsletter from '../../_components/UniversalNewsletter';
import BlogPostHeader from './BlogPostHeader';
import BlogSidebar from './BlogSidebar';
import MainContent from './MainContent';
import RelatedPosts from './RelatedPosts';

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
    category: string; // Changed from PostCategory to string
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
    category: string; // Changed from PostCategory to string
    publishedAt: Date | null;
    tags: BlogTag[];
}

interface BlogPostClientProps {
    post: PostType;
    relatedPosts: RelatedPost[];
}

export default function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
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