'use client';
import { Container, Paper, SimpleGrid } from '@repo/ui/components/mantine';
import { FeaturedPost } from '../../_actions/getFeaturedPosts';
import { FeaturedMainPost } from './FeaturedMainPost';
import { FeaturedSidePost } from './FeaturedSidePost';

const PRIMARY_COL_HEIGHT = '300px';
const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

// Default post to use if data is missing
const defaultPost: FeaturedPost = {
    id: '0',
    title: "Loading...",
    slug: "",
    category: "SPELLS" as const,
    imageUrl: "/placeholder.jpg",
    color: "blue",
    publishedAt: null
};

interface FeaturedPostsSectionProps {
    posts: FeaturedPost[];
}

export function FeaturedPostsSection({ posts }: FeaturedPostsSectionProps) {
    // Ensure we have 5 posts, fill with default if needed
    const featuredPosts = [...posts];
    while (featuredPosts.length < 5) {
        featuredPosts.push({ ...defaultPost, id: `default-${featuredPosts.length}` });
    }

    // Create safe posts by ensuring each post is defined (never undefined)
    const safePosts = featuredPosts.map((post, index) =>
        post || { ...defaultPost, id: `default-${index}` }
    );

    return (
        <Paper
            shadow="md"
            p="md"
            radius="md"
            bg="var(--mantine-color-gray-9)"
            style={{
                width: '100%',
                minHeight: 'calc(100vh - 60px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem',
                paddingTop: '2rem',
                paddingBottom: '2rem',
            }}
        >
            <Container size="xl" style={{ width: '100%' }}>
                <SimpleGrid
                    cols={{ base: 1, md: 3 }}
                    spacing="md"
                >
                    {/* First column - Two stacked posts */}
                    <div>
                        <FeaturedSidePost
                            post={safePosts[0]!}
                            height={PRIMARY_COL_HEIGHT}
                            isPrimary={true}
                        />
                        <FeaturedSidePost
                            post={safePosts[1]!}
                            height={SECONDARY_COL_HEIGHT}
                            isPrimary={false}
                        />
                    </div>

                    {/* Center column - One large post */}
                    <FeaturedMainPost
                        post={safePosts[2]!}
                        height={`calc(${PRIMARY_COL_HEIGHT} + ${SECONDARY_COL_HEIGHT} + var(--mantine-spacing-md))`}
                    />

                    {/* Third column - Two stacked posts */}
                    <div>
                        <FeaturedSidePost
                            post={safePosts[3]!}
                            height={PRIMARY_COL_HEIGHT}
                            isPrimary={true}
                        />
                        <FeaturedSidePost
                            post={safePosts[4]!}
                            height={SECONDARY_COL_HEIGHT}
                            isPrimary={false}
                        />
                    </div>
                </SimpleGrid>
            </Container>
        </Paper>
    );
}
