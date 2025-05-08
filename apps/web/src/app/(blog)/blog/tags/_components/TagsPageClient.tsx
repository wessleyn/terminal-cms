'use client';

import { Badge, Box, Container, Group, Input, SimpleGrid, Text, Title, useComputedColorScheme, useMantineTheme } from '@mantine/core';
import { IconSearch, IconTag } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import UniversalNewsletter from '../../_components/UniversalNewsletter';

interface Tag {
    id: string;
    name: string;
    slug: string;
    color: string;
    postCount: number;
}

interface TagsPageClientProps {
    tags: Tag[];
}

export default function TagsPageClient({ tags }: TagsPageClientProps) {
    const theme = useMantineTheme();
    const colorScheme = useComputedColorScheme('dark');
    const isDark = colorScheme === 'dark';

    const [searchQuery, setSearchQuery] = useState('');

    // Filter tags based on search query
    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Box py="xl" style={{
                backgroundColor: isDark ? theme.colors.dark[8] : theme.colors.gray[0]
            }}>
                <Container size="xl">
                    <Group mb="lg">
                        <IconTag size={32} color={theme.colors.green[6]} />
                        <Title order={1}>Browse All Tags</Title>
                    </Group>
                    <Text size="lg" mb="xl" maw={700}>
                        Explore all the topics covered in our blog. Click on any tag to see related articles.
                    </Text>

                    <Input
                        placeholder="Search tags..."
                        leftSection={<IconSearch />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        size="md"
                        maw={400}
                        mb="xl"
                    />
                </Container>
            </Box>

            <Container size="xl" py="xl">
                {filteredTags.length > 0 ? (
                    <SimpleGrid
                        cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
                        spacing="lg"
                    >
                        {filteredTags.map(tag => (
                            <Link
                                key={tag.id}
                                href={`/blog/tag/${tag.slug}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <Box
                                    p="md"
                                    style={{
                                        borderRadius: theme.radius.md,
                                        border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
                                        backgroundColor: isDark ? theme.colors.dark[7] : theme.colors.gray[0],
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        cursor: 'pointer',
                                        height: '100%',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: theme.shadows.md,
                                        }
                                    }}
                                >
                                    <Group justify="space-between" mb="xs">
                                        <Badge color={tag.color || 'blue'} size="lg">
                                            #{tag.name}
                                        </Badge>
                                        <Badge variant="outline">
                                            {tag.postCount} {tag.postCount === 1 ? 'post' : 'posts'}
                                        </Badge>
                                    </Group>
                                    <Text size="sm" c="dimmed">
                                        Click to browse all posts tagged with #{tag.name}
                                    </Text>
                                </Box>
                            </Link>
                        ))}
                    </SimpleGrid>
                ) : (
                    <Box py="xl" ta="center">
                        <Text size="lg">No tags found matching &quot;{searchQuery}&quot;</Text>
                    </Box>
                )}
            </Container>

            <UniversalNewsletter
                type="blog"
                title="Subscribe to our newsletter"
                subtitle="Get the latest articles delivered straight to your inbox."
            />
        </>
    );
}