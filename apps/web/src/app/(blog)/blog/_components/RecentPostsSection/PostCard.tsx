'use client';
import { Avatar, Badge, Button, Card, Group, Image, Text } from '@repo/ui/components/mantine';
import Link from 'next/link';
import { BlogPost } from '../../_actions/getRecentPosts';

interface PostCardProps {
    post: BlogPost;
}

export function PostCard({ post }: PostCardProps) {
    return (
        <Card key={post.id} shadow="sm" p="lg" radius="md" withBorder>
            <Card.Section>
                <Image
                    src={post.imageUrl || "/placeholder.jpg"}
                    height={160}
                    alt={post.title}
                />
            </Card.Section>

            <Badge color={post.tags[0]?.color || "blue"} mt="md">{post.category}</Badge>
            <Text fw={500} size="lg" mt="md">{post.title}</Text>

            <Group mt="xs">
                {post.author && (
                    <>
                        <Avatar src={post.author.avatarUrl || undefined} size="sm" radius="xl" />
                        <Text size="sm">By {post.author.name}</Text>
                    </>
                )}
                <Text size="sm" c="dimmed">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Draft"}
                </Text>
            </Group>

            <Text mt="md" size="sm" c="dimmed" lineClamp={2}>
                {post.excerpt}
            </Text>

            <Button
                variant="light"
                color="blue"
                fullWidth
                mt="md"
                radius="md"
                component={Link}
                href={`/blog/${post.slug}`}
            >
                Read More
            </Button>
        </Card>
    );
}
