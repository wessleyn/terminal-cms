'use client';

import { Container, Paper, SimpleGrid, Title } from '@mantine/core';
import { FeaturedPost } from '../../_actions/getTrendingPosts';
import { TrendingMainPost } from './TrendingMainPost';
import { TrendingSidePosts } from './TrendingSidePosts';

interface TrendingPostsSectionProps {
    posts: FeaturedPost[];
}

export function TrendingPostsSection({ posts }: TrendingPostsSectionProps) {
    // Ensure we have at least 4 posts
    const trendingPosts = [...posts];
    const defaultPost: FeaturedPost = {
        id: '0',
        title: "Loading...",
        slug: "",
        category: "SPELLS" as const,
        imageUrl: "/placeholder.jpg",
        color: "blue",
        publishedAt: null
    };

    while (trendingPosts.length < 4) {
        trendingPosts.push({ ...defaultPost, id: `default-${trendingPosts.length}` });
    }

    // Create a safe reference to the first post
    const mainPost = trendingPosts[0] || defaultPost;

    return (
        <Paper shadow="md" p="md" radius="md" mt="xl" bg="var(--mantine-color-gray-9)" style={{ marginBottom: '3rem' }}>
            <Container size="xl" py="xl">
                <Title order={2} mb="xl">Trending Now</Title>

                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                    <TrendingMainPost post={mainPost} />
                    <TrendingSidePosts posts={trendingPosts.slice(1)} />
                </SimpleGrid>
            </Container>
        </Paper>
    );
}
