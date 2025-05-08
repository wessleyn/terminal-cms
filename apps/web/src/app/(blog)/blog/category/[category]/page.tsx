import { PostCategory as CategoryEnum, prisma } from '@repo/db';
import { Container, Group, Pagination, Text } from '@repo/ui/components/mantine';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import UniversalNewsletter from '../../_components/UniversalNewsletter';
import CategoryHeader from './_components/CategoryHeader';
import PostGrid from './_components/PostGrid';

export const revalidate = 3600; // Revalidate at most every hour

interface CategoryPageProps {
    params: Promise<{
        category: string;
    }>;
    searchParams: Promise<{
        page?: string;
    }>;
}



// Map of URL-friendly category slugs to actual category enum values
const categoryMap: Record<string, string> = {
    'spells': CategoryEnum.SPELLS,
    'potions': CategoryEnum.POTIONS,
    'scrolls': CategoryEnum.SCROLLS,
    'artifacts': CategoryEnum.ARTIFACTS
};

// Get category descriptions
const categoryDescriptions: Record<string, string> = {
    [CategoryEnum.SPELLS]: 'Explore magical tutorials, guides, and tricks for modern web development. From React spells to TypeScript incantations.',
    [CategoryEnum.POTIONS]: 'Discover powerful solutions and mixtures of code to solve your development problems. Brew the perfect code recipes.',
    [CategoryEnum.SCROLLS]: 'Read our detailed documentation and long-form articles about programming concepts and best practices.',
    [CategoryEnum.ARTIFACTS]: 'Find useful tools, libraries, and resources to enhance your development workflow and projects.',
};

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
    const categoryEnum = categoryMap[categorySlug] as CategoryEnum;

    if (!categoryEnum) {
        notFound();
    }

    const currentPage = Number((await searchParams).page) || 1;
    const postsPerPage = 9;

    try {
        // Get posts by category
        const posts = await prisma.blogPost.findMany({
            where: {
                category: categoryEnum,
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
                tags: true,
            },
            orderBy: {
                publishedAt: 'desc',
            },
            skip: (currentPage - 1) * postsPerPage,
            take: postsPerPage,
        });

        // Get total count for pagination
        const totalPosts = await prisma.blogPost.count({
            where: {
                category: categoryEnum,
                publishedAt: {
                    not: null,
                }
            },
        });

        const totalPages = Math.ceil(totalPosts / postsPerPage);

        if (posts.length === 0 && currentPage === 1) {
            notFound();
        }

        // Get description for this category
        const description = categoryDescriptions[categoryEnum] ||
            'Explore our collection of articles, tutorials, and insights on this topic.';

        // Map the Prisma records to the Post type expected by PostGrid
        const formattedPosts = posts.map(post => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            category: post.category.toString(),
            imageUrl: post.imageUrl,
            publishedAt: post.publishedAt,
            author: {
                name: post.author.displayName,
                avatarUrl: post.author.avatars[0]?.url || null,
            },
            tags: post.tags
        }));

        return (
            <>
                <CategoryHeader
                    category={categoryEnum}
                    description={description}
                />

                <Container size="xl" py="xl">
                    <PostGrid posts={formattedPosts} />

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
                    category={categoryEnum}
                    title={`Subscribe to ${categoryEnum.charAt(0) + categoryEnum.slice(1).toLowerCase()} Updates`}
                    subtitle={`Get the latest articles from the ${categoryEnum.toLowerCase()} category delivered straight to your inbox.`}
                />
            </>
        );
    } catch (error) {
        console.error("Error loading category page:", error);
        return (
            <Container size="xl" py="xl">
                <Text>Sorry, there was an error loading this category. Please try again later.</Text>
            </Container>
        );
    }
}

export async function generateStaticParams() {
    // Generate only the category pages, not the individual paginated ones
    return Object.keys(categoryMap).map((category) => ({
        category,
    }));
}
