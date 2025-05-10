'use client';

import { Badge, Paper, Text } from '@mantine/core';
import Link from 'next/link';
import { FeaturedPost } from '../../_actions/getFeaturedPosts';

interface FeaturedSidePostProps {
    post: FeaturedPost;
    height: string;
    isPrimary: boolean;
}

export function FeaturedSidePost({ post, height, isPrimary }: FeaturedSidePostProps) {
    return (
        <Link href={post.slug ? `/blog/${post.slug}` : '#'} style={{
            textDecoration: 'none',
            display: 'block',
            height,
            width: '100%',
            marginBottom: isPrimary ? 'var(--mantine-spacing-md)' : 0
        }}>
            <Paper
                shadow="md"
                p="xl"
                radius="md"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${post.imageUrl || "/placeholder.jpg"})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    cursor: post.slug ? 'pointer' : 'default',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                }}
            >
                <Badge
                    mb="xs" size='md'
                    color={post.category.color}
                    component={Link}
                    href={`/blog/category/${post.category.slug}`}>
                    {post.category.name}
                </Badge>

                <Text size={isPrimary ? "xl" : "md"} fw={700} c="white">
                    {isPrimary ? post.title : post.title.length > 19 ? post.title.substring(0, 19) + "..." : post.title}
                </Text>
                <Text size="sm" c="white" mt="xs">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Coming soon"}
                </Text>
            </Paper>
        </Link>
    );
}
