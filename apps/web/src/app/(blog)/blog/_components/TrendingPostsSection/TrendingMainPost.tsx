'use client';
import { Badge, Paper, Text, Title } from '@repo/ui/components/mantine';
import Link from 'next/link';
import { FeaturedPost } from '../../_actions/getTrendingPosts';

interface TrendingMainPostProps {
    post: FeaturedPost;
}

export function TrendingMainPost({ post }: TrendingMainPostProps) {
    return (
        <Link href={post.slug ? `/blog/${post.slug}` : '#'} style={{
            textDecoration: 'none',
            display: 'block',
            height: '100%',
            width: '100%'
        }}>
            <Paper
                shadow="md"
                radius="md"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${post.imageUrl || "/placeholder.jpg"})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: 400,
                    width: '100%',
                    cursor: post.slug ? 'pointer' : 'default',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                }}
            >
                <div style={{ padding: '20px' }}>
                    <Badge color={post.color} mb="md">{post.category}</Badge>
                    <Title order={3} c="white">{post.title}</Title>
                    <Text c="white" mt="md">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Coming soon"}
                    </Text>
                </div>
            </Paper>
        </Link>
    );
}
