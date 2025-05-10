'use client';

import { Grid } from '@mantine/core';
import { TrendingPost } from '../../_actions/getTrendingPosts';
import TrendingMainPost from './TrendingMainPost';
import TrendingSidePosts from './TrendingSidePosts';

// Make sure we're correctly importing and using these components
import './TrendingMainPost';
import './TrendingSidePosts';

interface TrendingPostsSectionProps {
    posts: TrendingPost[];
}

export default function TrendingPostsSection({ posts }: TrendingPostsSectionProps) {
    if (!posts || posts.length === 0) {
        return null;
    }

    // Ensure we have at least 4 posts for the section
    const allPosts = [...posts];

    // The first post is the main featured post
    const mainPost = allPosts.length > 0 ? allPosts[0] : null;

    // The remaining posts are shown in the side section
    const sidePosts = allPosts.slice(1);

    if (!mainPost) return null;

    return (
        <Grid gutter="lg">
            <Grid.Col span={{ base: 12, md: 6 }}>
                <TrendingMainPost post={mainPost} />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
                <TrendingSidePosts posts={sidePosts} />
            </Grid.Col>
        </Grid>
    );
}
