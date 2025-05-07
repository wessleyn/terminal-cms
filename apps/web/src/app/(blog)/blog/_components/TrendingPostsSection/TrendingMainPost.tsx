'use client';
import { Badge, Paper, Text, Title } from '@repo/ui/components/mantine';
import { FeaturedPost } from '../../_actions/getTrendingPosts';

interface TrendingMainPostProps {
    post: FeaturedPost;
}

export function TrendingMainPost({ post }: TrendingMainPostProps) {
    return (
        <Paper
            shadow="md"
            p="xl"
            radius="md"
            h={400}
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${post.imageUrl || "/placeholder.jpg"})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end'
            }}
        >
            <Badge color={post.color} mb="md">{post.category}</Badge>
            <Title order={3} c="white">{post.title}</Title>
            <Text c="white" mt="md">
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Coming soon"}
            </Text>
        </Paper>
    );
}
