'use server';

import { prisma } from '@repo/db';

export interface CategoryWithPostCount {
    id: string;
    name: string;
    slug: string;
    color: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    postCount: number;
}

export async function fetchAllCategories(): Promise<CategoryWithPostCount[]> {
    try {
        const categories = await prisma.blogCategory.findMany({
            include: {
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });

        return categories.map(category => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            color: category.color,
            description: category.description || '',
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
            postCount: category._count.posts,
        }));
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}
