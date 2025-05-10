import { prisma } from '@repo/db';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LazyCategoryContent from './_components/LazyCategoryContent';

export const revalidate = 3600; // Revalidate at most every hour

interface CategoryPageProps {
    params: Promise<{
        category: string;
    }>;
    searchParams: Promise<{
        page?: string;
    }>;
}

export async function generateMetadata({ params }: { params: CategoryPageProps['params'] }): Promise<Metadata> {
    const category = (await params).category;
    const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

    return {
        title: `${formattedCategory} | Blog Category`,
        description: `Browse all posts in the ${formattedCategory} category`,
    };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
    const categorySlug = (await params).category.toLowerCase();
    const currentPage = Number((await searchParams).page) || 1;
    //   TODO: Fetch this  metric from the database
    const postsPerPage = 9;

    try {
        // Get the category by slug
        const category = await prisma.blogCategory.findUnique({
            where: {
                slug: categorySlug,
            }
        });

        if (!category) {
            notFound();
        }

        // Get posts by category
        const posts = await prisma.blogPost.findMany({

            where: {
                category: {
                    slug: categorySlug,
                },
                publishedAt: {
                    not: null,
                }
            },
            include: {
                _count: true,
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
                tags: true,
            },
            orderBy: {
                publishedAt: 'desc',
            },
            skip: (currentPage - 1) * postsPerPage,
            take: postsPerPage,
        });

        // Get total count for pagination
        const totalPosts = posts.length
        if (totalPosts === 0 && currentPage === 1) {
            notFound();
        }

        // Map the Prisma records to the Post type expected by PostGrid
        const formattedPosts = posts.map(post => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            category: category.name,
            categorySlug: category.slug,
            categoryColor: category.color,
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
            <LazyCategoryContent
                posts={formattedPosts}
                category={category.name}
                color={category.color}
                description={category.description || ''}
                categorySlug={categorySlug}
                currentPage={currentPage}
                totalPages={Math.ceil(totalPosts / postsPerPage)}
            />
        );
    }
    catch (error) {
        console.error("Error loading category page:", error);
        return (
            <LazyCategoryContent
                posts={[]}
                category={''}
                description=""
                categorySlug={categorySlug}
                currentPage={1}
                totalPages={1}
                error={true}
            />
        );
    }
}

export async function generateStaticParams() {
    // Get all categories
    const categories = await prisma.blogCategory.findMany({
        select: {
            slug: true,
        }
    });

    // Generate static params for all categories
    return categories.map(category => ({
        category: category.slug,
    }));
}
