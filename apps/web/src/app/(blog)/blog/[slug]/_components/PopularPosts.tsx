'use client';

import { Group, Image, Stack, Text, Title } from '@repo/ui/components/mantine';
import Link from 'next/link';

export default function PopularPosts() {
    const posts = [
        {
            id: 1,
            title: "The Magic of React Hooks: A Beginner's Guide",
            date: "July 19, 2023",
            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000",
            slug: "magic-of-react-hooks"
        },
        {
            id: 2,
            title: "Brewing Perfect TypeScript Interfaces",
            date: "July 15, 2023",
            image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=1000",
            slug: "brewing-perfect-typescript-interfaces"
        },
        {
            id: 3,
            title: "Ancient Scrolls of Next.js API Routes",
            date: "July 10, 2023",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000",
            slug: "ancient-scrolls-nextjs-api-routes"
        }
    ];

    return (
        <div style={{ padding: "1rem" }}>
            <Title order={4} mb="md">Popular Posts</Title>
            <Stack>
                {posts.map(post => (
                    <Link href={`/blog/${post.slug}`} key={post.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Group align="flex-start" wrap="nowrap">
                            <div style={{ minWidth: '80px' }}>
                                <Image
                                    src={post.image}
                                    width={80}
                                    height={60}
                                    radius="md"
                                    alt={post.title}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <Text fw={500} size="sm" lineClamp={2}>{post.title}</Text>
                                <Text size="xs" c="dimmed">{post.date}</Text>
                            </div>
                        </Group>
                    </Link>
                ))}
            </Stack>
        </div>
    );
}
