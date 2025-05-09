import { prisma } from '@repo/db';
import { Metadata } from 'next';
import LazyTagsContent from './_components/LazyTagsContent';

export const revalidate = 3600; // Revalidate at most every hour

export const metadata: Metadata = {
    title: 'Tags | Blog',
    description: 'Browse all blog post tags and find content by topic',
};

export default async function TagsPage() {
    // Get all tags with post count
    const tags = await prisma.blogTag.findMany({
        where: {
            posts: {
                some: {
                    publishedAt: {
                        not: null,
                    }
                }
            }
        },
        select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            _count: {
                select: {
                    posts: {
                        where: {
                            publishedAt: {
                                not: null,
                            }
                        }
                    }
                }
            }
        },
        orderBy: {
            name: 'asc', // Order alphabetically
        }
    });

    const formattedTags = tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        color: tag.color || 'gray',
        postCount: tag._count.posts
    }));

    return <LazyTagsContent tags={formattedTags} />;
}