'use client';

import { Avatar, Badge, Button, Card, Grid, Group, Image, Text, Title } from '@repo/ui/components/mantine';
import Link from 'next/link';

interface Author {
    name: string;
    avatarUrl: string | null;
}

interface Tag {
    id: string;
    name: string;
    color: string;
}

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    imageUrl: string;
    publishedAt: Date | null;
    author: Author | null;
    tags: Tag[];
}

interface PostGridProps {
    posts: Post[];
}

export default function PostGrid({ posts }: PostGridProps) {
    const getCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case 'spells': return 'blue';
            case 'potions': return 'green';
            case 'scrolls': return 'orange';
            case 'artifacts': return 'violet';
            default: return 'gray';
        }
    };

    if (!posts || posts.length === 0) {
        return (
            <Text ta="center" py="xl">No posts found in this category.</Text>
        );
    }

    return (
        <Grid>
            {posts.map((post) => (
                <Grid.Col key={post.id} span={{ base: 12, sm: 6, lg: 4 }}>
                    <Card withBorder shadow="sm" padding={0} radius="md">
                        <Card.Section>
                            <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                                <Image
                                    src={post.imageUrl}
                                    height={200}
                                    alt={post.title}
                                />
                            </Link>
                        </Card.Section>

                        <div style={{ padding: '1rem' }}>
                            <Badge
                                color={getCategoryColor(post.category)}
                                mb="xs"
                            >
                                {post.category}
                            </Badge>
                            {post.tags && post.tags.length > 0 && post.tags[0] && (
                                <Badge
                                    variant="outline"
                                    ml="xs"
                                    mb="xs"
                                >
                                    {post.tags[0].name}
                                </Badge>
                            )}

                            <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Title order={3} size="h4" mb="sm" lineClamp={2}>
                                    {post.title}
                                </Title>
                            </Link>

                            <Group mb="md" align="center">
                                {post.author && (
                                    <>
                                        <Avatar src={post.author.avatarUrl} size="sm" radius="xl" />
                                        <Text size="sm">By {post.author.name}</Text>
                                    </>
                                )}
                                <Text size="sm" c="dimmed">
                                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
                                </Text>
                            </Group>

                            <Text size="sm" c="dimmed" lineClamp={3} mb="md">
                                {post.excerpt}
                            </Text>

                            <Button
                                variant="light"
                                component={Link}
                                href={`/blog/${post.slug}`}
                                fullWidth
                            >
                                Read More
                            </Button>
                        </div>
                    </Card>
                </Grid.Col>
            ))}
        </Grid>
    );
}
