'use client';
import { Badge, Group, Paper, Text } from '@repo/ui/components/mantine';
import { FeaturedPost } from '../../_actions/getFeaturedPosts';

interface FeaturedMainPostProps {
    post: FeaturedPost;
    height: string;
}

export function FeaturedMainPost({ post, height }: FeaturedMainPostProps) {
    return (
        <Paper
            shadow="md"
            p="xl"
            radius="md"
            h={height}
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${post.imageUrl || "/placeholder.jpg"})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
            }}
        >
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
                <Group gap="xs">
                    <Badge color={post.color}>{post.category}</Badge>
                    <Badge color="blue">Featured</Badge>
                </Group>
                <Text size="xl" fw={700} c="white" mt="md">{post.title}</Text>
                <Text size="sm" c="white" mt="xs">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Coming soon"}
                </Text>
            </div>
        </Paper>
    );
}
