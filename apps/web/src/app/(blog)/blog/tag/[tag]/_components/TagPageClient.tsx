'use client';

import { Container, Group, Pagination, Text } from '@mantine/core';
import PostGrid from '../../../_components/PostGrid';
import UniversalNewsletter from '../../../_components/UniversalNewsletter';
import TagHeader from './TagHeader';
import { LegacyBlogPost } from '../../../_types/types';


interface TagPageClientProps {
    posts: LegacyBlogPost[];
    tag: string;
    color: string;
    description: string;
    tagSlug: string;
    currentPage: number;
    totalPages: number;
    error?: boolean;
}

export default function TagPageClient({
    posts,
    tag,
    color,
    description,
    tagSlug,
    currentPage,
    totalPages,
    error = false
}: TagPageClientProps) {
    if (error) {
        return (
            <Container size="xl" py="xl">
                <Text>Sorry, there was an error loading this tag. Please try again later.</Text>
            </Container>
        );
    }

    return (
        <>
            <TagHeader
                tag={tag}
                color={color}
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
                                href: `/blog/tag/${tagSlug}?page=${page}`
                            })}
                        />
                    </Group>
                )}
            </Container>

            <UniversalNewsletter
                type="blog"
                title="Subscribe to our newsletter"
                subtitle={`Get the latest articles including ${tag} content delivered straight to your inbox.`}
            />
        </>
    );
}