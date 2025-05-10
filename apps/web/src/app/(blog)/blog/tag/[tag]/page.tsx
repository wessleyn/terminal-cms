import { BlogTagType, prisma } from '@repo/db';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LazyTagContent from './_components/LazyTagContent';

export const revalidate = 3600; // Revalidate at most every hour

interface TagPageProps {
    params: Promise<{
        tag: string;
    }>;
    searchParams: Promise<{
        page?: string;
    }>;
}

export async function generateMetadata({ params }: { params: TagPageProps['params'] }): Promise<Metadata> {
    const tag = (await params).tag;
    const formattedTag = tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();

    return {
        title: `#${formattedTag} | Blog Tag`,
        description: `Browse all posts with the ${formattedTag} tag`,
    };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
    const tagSlug = (await params).tag.toLowerCase();
    const currentPage = Number((await searchParams).page) || 1;
    //   TODO: Fetch this  metric from the database
        const postsPerPage = 9;

    try {
        // Get the tag by slug with proper enum type
        const tag = await prisma.blogTag.findFirst({
            where: {
                slug: tagSlug,
                type: BlogTagType.BLOG,
            }
        });

        if (!tag) {
            notFound();
        }

        // Get posts by tag - include category in the query
        const posts = await prisma.blogPost.findMany({
            where: {
                tags: {
                    some: {
                        slug: tagSlug,
                    },
                },
                publishedAt: {
                    not: null,
                }
            },
            include: {
                author: {
                    select: {
                        displayName: true,
                        avatars: {
                            select: {
                                url: true,
                            },
                            where: {
                                isActive: true,
                            },
                            take: 1,
                        }
                    }
                },
                category: {
                    select: {
                        name: true,
                        slug: true,
                        color: true
                    }
                },
                tags: true,
            },
            orderBy: {
                publishedAt: 'desc',
            },
            skip: (currentPage - 1) * postsPerPage,
            take: postsPerPage,
        });

        const totalPosts = posts.length
        if (totalPosts === 0 && currentPage === 1) {
            notFound();
        }
        const totalPages = Math.ceil(totalPosts / postsPerPage);

        // Map the Prisma records to the Post type
        const formattedPosts = posts.map(post => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            category: post.category.name,
            categorySlug: post.category.slug,
            categoryColor: post.category.color,
            imageUrl: post.imageUrl,
            publishedAt: post.publishedAt,
            author: {
                name: post.author.displayName,
                avatarUrl: post.author.avatars[0]?.url || null,
            },
            tags: post.tags.map(tag => ({
                id: tag.id,
                name: tag.name,
                color: tag.color || 'gray'
            }))
        }));

        return (
            <LazyTagContent
                posts={formattedPosts}
                tag={tag.name}
                color={tag.color}
                description={tag.description}
                tagSlug={tagSlug}
                currentPage={currentPage}
                totalPages={totalPages}
            />
        );
    } catch (error) {
        console.error("Error loading tag page:", error);
        return (
            <LazyTagContent
                posts={[]}
                tag={tagSlug}
                color="gray"
                description=""
                tagSlug={tagSlug}
                currentPage={1}
                totalPages={1}
                error={true}
            />
        );
    }
}

export async function generateStaticParams() {
    // Get all tags that have at least one published post
    const tags = await prisma.blogTag.findMany({
        where: {
            type: BlogTagType.BLOG, // Use enum instead of string literal
            posts: {
                some: {
                    publishedAt: {
                        not: null,
                    }
                }
            }
        },
        select: {
            slug: true,
        }
    });

    // Generate static params for all valid tags
    return tags.map(tag => ({
        tag: tag.slug,
    }));
}