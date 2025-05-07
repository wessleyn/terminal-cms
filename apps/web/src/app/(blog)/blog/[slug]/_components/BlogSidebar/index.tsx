'use client';

import { Badge, Group, Stack, Text, Title } from '@repo/ui/components/mantine';
import { IconArticle, IconCircleCheck, IconTestPipe, IconWand } from '@tabler/icons-react';
import PopularPosts from '../PopularPosts';
import BlogAuthorSidebar from './BlogAuthorSidebar';

export default function BlogSidebar() {

    const categories = [
        { name: 'Potions', count: 12, icon: <IconTestPipe size={16} /> },
        { name: 'Spells', count: 22, icon: <IconWand size={16} /> },
        { name: 'Scrolls', count: 37, icon: <IconArticle size={16} /> },
        { name: 'Artifacts', count: 14, icon: <IconCircleCheck size={16} /> }
    ];

    const tags = [
        'React', 'NextJS', 'TypeScript', 'JavaScript',
        'Prisma', 'Mantine', 'CSS', 'Tutorial',
        'Advanced', 'Beginner', 'API', 'Database'
    ];

    return (
        <Stack>

            {/* Author Bio */}
            <BlogAuthorSidebar author={{
                name: "Craig David",
                bio: "Professional writer and content creator specializing in technology, magic, and digital culture."
            }} />

            {/* Popular Posts */}
            <PopularPosts />

            {/* Categories */}
            <div style={{ padding: "1rem" }}>
                <Title order={4} mb="md">Categories</Title>
                <Stack gap="xs">
                    {categories.map(category => (
                        <Group key={category.name} style={{ cursor: 'pointer', padding: '8px', borderRadius: '4px', transition: 'background-color 0.2s' }}
                            className="category-item" wrap="nowrap">
                            <div style={{
                                width: '28px',
                                height: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--mantine-color-green-6)',
                            }}>
                                {category.icon}
                            </div>
                            <Text style={{ flex: 1 }}>{category.name}</Text>
                            <Badge size="sm" variant="light" color="gray">
                                {category.count}
                            </Badge>
                        </Group>
                    ))}
                </Stack>
            </div>

            {/* Tags */}
            <div style={{ padding: "1rem" }}>
                <Title order={4} mb="md">Tags</Title>
                <Group>
                    {tags.map(tag => (
                        <Badge key={tag} size="lg" radius="sm" variant="outline">
                            {tag}
                        </Badge>
                    ))}
                </Group>
            </div>
        </Stack>
    );
}
