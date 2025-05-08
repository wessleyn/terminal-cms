'use client';

import { Avatar, Badge, Container, Group, Text, Title } from '@repo/ui/components/mantine';
import Link from 'next/link';

interface Author {
    name: string;
    avatarUrl?: string | null;
}

interface BlogPostHeaderProps {
    title: string;
    category: string;
    author: Author | null;
    date: Date | null;
    imageUrl: string;
}

export default function BlogPostHeader({ title, category, author, date, imageUrl }: BlogPostHeaderProps) {
    const getCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case 'spells': return 'blue';
            case 'potions': return 'green';
            case 'scrolls': return 'orange';
            case 'artifacts': return 'violet';
            default: return 'gray';
        }
    };

    const formatDate = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Date(date).toLocaleDateString('en-US', options);
    };

    return (
        <div
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '100px 0',
                color: 'white',
                marginBottom: '2rem'
            }}
        >
            <Container size="xl" ta="center">
                <Link href={`/blog/category/${category.toLocaleLowerCase()}`}>
                    <Badge
                        size="lg"
                        color={getCategoryColor(category)}
                        mb="lg"
                        radius="sm"
                    >
                        {category}
                    </Badge>
                </Link>
                <Title order={1} mb="xl" style={{ color: 'white' }}>{title}</Title>

                <Group justify="center" align="center">
                    {author && (
                        <>
                            <Avatar
                                src={author.avatarUrl}
                                size="md"
                                radius="xl"
                                mr="xs"
                            />
                            <Text size="lg" mr="md">By {author.name}</Text>
                        </>
                    )}
                    <Text size="lg">{date ? formatDate(date) : ''}</Text>
                </Group>
            </Container>
        </div>
    );
}
