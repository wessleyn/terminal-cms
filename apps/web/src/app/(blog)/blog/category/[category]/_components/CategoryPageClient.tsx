'use client';

import { Container, Group, Pagination, Text } from '@mantine/core';
import UniversalNewsletter from '../../../_components/UniversalNewsletter';
import CategoryHeader from './CategoryHeader';
import PostGrid from './PostGrid';

interface Author {
    name: string;
    avatarUrl: string | null;
}

interface Tag {
    id: string;
    name: string;
    color: string; // Required in PostGrid
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

interface CategoryPageClientProps {
    posts: Post[];
    category: string;
    description: string;
    categorySlug: string;
    currentPage: number;
    totalPages: number;
    error?: boolean;
}

export default function CategoryPageClient({
    posts,
    category,
    description,
    categorySlug,
    currentPage,
    totalPages,
    error = false
}: CategoryPageClientProps) {
    if (error) {
        return (
            <Container size="xl" py="xl">
                <Text>Sorry, there was an error loading this category. Please try again later.</Text>
            </Container>
        );
    }

    return (
        <>
            <CategoryHeader
                category={category}
                description={description}
            />

            <Container size="xl" py="xl">
                <PostGrid posts={posts} />

                {totalPages > 1 && (
                    <Group justify="center" mt="xl" py="xl">
                        <Pagination
                            total={totalPages}
                            value={currentPage}
                            getItemProps={(page) => ({
                                component: 'a',
                                href: `/blog/category/${categorySlug}?page=${page}`
                            })}
                        />
                    </Group>
                )}
            </Container>

            <UniversalNewsletter
                type="category"
                category={category}
                title={`Subscribe to ${category.charAt(0) + category.slice(1).toLowerCase()} Updates`}
                subtitle={`Get the latest articles from the ${category.toLowerCase()} category delivered straight to your inbox.`}
            />
        </>
    );
}