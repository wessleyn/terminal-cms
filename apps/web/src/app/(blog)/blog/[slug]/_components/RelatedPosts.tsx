'use client';

import { Badge, Box, Container, Grid, SimpleGrid, Text, Title } from '@repo/ui/components/mantine';
import Link from 'next/link';

interface RelatedPost {
    id: string;
    title: string;
    slug: string;
    category: string;
    imageUrl: string;
    publishedAt: Date | null;
    tags: Array<{
        id: string;
        color: string;
    }>;
}

interface RelatedPostsProps {
    posts: RelatedPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
    // Function to get category color
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
        return null;
    }

    return (
        <Box py="xl" >
            <Container size="xl">
                <Title order={2} mb="xl">Related Posts</Title>

                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    {/* Featured post (larger) */}
                    {posts[0] && (
                        <Link href={`/blog/${posts[0].slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Box
                                h={400}
                                style={{
                                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${posts[0].imageUrl})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderRadius: '8px',
                                    position: 'relative',
                                    padding: '20px'
                                }}
                            >
                                <Box style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
                                    <Badge color={getCategoryColor(posts[0].category)} mb="sm">
                                        {posts[0].category}
                                    </Badge>
                                    <Title order={3} c="white">{posts[0].title}</Title>
                                    <Text c="white" size="sm" mt="xs">
                                        {posts[0].publishedAt ? new Date(posts[0].publishedAt).toLocaleDateString() : ''}
                                    </Text>
                                </Box>
                            </Box>
                        </Link>
                    )}

                    {/* Smaller posts grid */}
                    <Grid>
                        {posts.slice(1, 4).map(post => (
                            <Grid.Col span={6} key={post.id}>
                                <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <Box
                                        h={190}
                                        style={{
                                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${post.imageUrl})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            borderRadius: '8px',
                                            position: 'relative',
                                            padding: '15px'
                                        }}
                                    >
                                        <Box style={{ position: 'absolute', bottom: '15px', left: '15px' }}>
                                            <Badge color={getCategoryColor(post.category)} mb="xs" size="sm">
                                                {post.category}
                                            </Badge>
                                            <Text fw={600} c="white" size="sm">{post.title}</Text>
                                            <Text c="white" size="xs" mt="xs">
                                                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
                                            </Text>
                                        </Box>
                                    </Box>
                                </Link>
                            </Grid.Col>
                        ))}
                    </Grid>
                </SimpleGrid>
            </Container>
        </Box>
    );
}
