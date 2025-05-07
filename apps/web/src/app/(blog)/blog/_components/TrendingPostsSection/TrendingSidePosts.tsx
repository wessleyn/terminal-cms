'use client';
import { Badge, Group, Paper, Stack, Text } from '@repo/ui/components/mantine';
import { FeaturedPost } from '../../_actions/getTrendingPosts';

interface TrendingSidePostsProps {
    posts: FeaturedPost[];
}

export function TrendingSidePosts({ posts }: TrendingSidePostsProps) {
    // Ensure we have exactly 3 posts
    const sidePosts = [...posts];
    const defaultPost: FeaturedPost = {
        id: '0',
        title: "Loading...",
        slug: "",
        category: "SPELLS" as const,
        imageUrl: "/placeholder.jpg",
        color: "blue",
        publishedAt: null
    };

    while (sidePosts.length < 3) {
        sidePosts.push({ ...defaultPost, id: `default-${sidePosts.length}` });
    }

    // Create safe post references that are guaranteed to exist
    const post1 = sidePosts[0] || defaultPost;
    const post2 = sidePosts[1] || defaultPost;
    const post3 = sidePosts[2] || defaultPost;

    return (
        <Stack>
            <Paper
                shadow="md"
                p="xl"
                radius="md"
                h={190}
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${post1.imageUrl || "/placeholder.jpg"})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <Badge color={post1.color} mb="xs">{post1.category}</Badge>
                <Text fw={700} c="white">{post1.title}</Text>
                <Text size="sm" c="white" mt="xs">
                    {post1.publishedAt ? new Date(post1.publishedAt).toLocaleDateString() : "Coming soon"}
                </Text>
            </Paper>

            <Group grow>
                <Paper
                    shadow="md"
                    p="md"
                    radius="md"
                    h={190}
                    style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${post2.imageUrl || "/placeholder.jpg"})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <Badge color={post2.color} mb="xs" size="sm">{post2.category}</Badge>
                    <Text fw={700} size="sm" c="white">{post2.title}</Text>
                    <Text size="xs" c="white" mt="xs">
                        {post2.publishedAt ? new Date(post2.publishedAt).toLocaleDateString() : "Coming soon"}
                    </Text>
                </Paper>

                <Paper
                    shadow="md"
                    p="md"
                    radius="md"
                    h={190}
                    style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${post3.imageUrl || "/placeholder.jpg"})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <Badge color={post3.color} mb="xs" size="sm">{post3.category}</Badge>
                    <Text fw={700} size="sm" c="white">{post3.title}</Text>
                    <Text size="xs" c="white" mt="xs">
                        {post3.publishedAt ? new Date(post3.publishedAt).toLocaleDateString() : "Coming soon"}
                    </Text>
                </Paper>
            </Group>
        </Stack>
    );
}
