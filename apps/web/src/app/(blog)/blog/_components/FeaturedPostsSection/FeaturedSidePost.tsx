'use client';
import { Badge, Paper, Text } from '@repo/ui/components/mantine';
import { FeaturedPost } from '../../_actions/getFeaturedPosts';

interface FeaturedSidePostProps {
    post: FeaturedPost;
    height: string;
    isPrimary: boolean;
}

export function FeaturedSidePost({ post, height, isPrimary }: FeaturedSidePostProps) {
    return (
        <Paper
            shadow="md"
            p="xl"
            radius="md"
            mb={isPrimary ? "md" : 0}
            h={height}
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${post.imageUrl || "/placeholder.jpg"})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
            }}
        >
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
                <Badge color={post.color} mb="xs">{post.category}</Badge>
                <Text size={isPrimary ? "xl" : "md"} fw={700} c="white">{post.title}</Text>
                <Text size="sm" c="white" mt="xs">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Coming soon"}
                </Text>
            </div>
        </Paper>
    );
}
