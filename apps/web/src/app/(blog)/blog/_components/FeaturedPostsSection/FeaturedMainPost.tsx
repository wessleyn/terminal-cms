'use client';

import { Badge, Group, Paper, Text } from '@mantine/core';
import Link from 'next/link';
import { FeaturedPost } from '../../_actions/getFeaturedPosts';

interface FeaturedMainPostProps {
    post: FeaturedPost;
    height: string;
}

export function FeaturedMainPost({ post, height }: FeaturedMainPostProps) {
    return (
        <Link href={post.slug ? `/blog/${post.slug}` : '#'} style={{
            textDecoration: 'none',
            display: 'block',
            height: '100%',
            width: '100%'
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
                    height,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                }}
            >
                <div style={{ padding: '20px' }}>
                    <Group gap="xs">
                        <Badge color={post.category.color} component={Link} href={`/blog/category/${post.category.slug}`}>{post.category.name}</Badge>
                        <Badge color="blue">Featured</Badge>
                    </Group>
                    <Text size="xl" fw={700} c="white" mt="md">{post.title}</Text>
                    <Text size="sm" c="white" mt="xs">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Coming soon"}
                    </Text>
                </div>
            </Paper>
        </Link>
    );
}
