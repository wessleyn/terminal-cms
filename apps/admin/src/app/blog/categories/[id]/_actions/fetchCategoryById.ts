'use server';

import { prisma } from '@repo/db';

export interface CategoryDetail {
    id: string;
    name: string;
    slug: string;
    description: string;
    color: string;
    createdAt: Date;
    updatedAt: Date;
    postCount: number;
}

export async function fetchCategoryById(id: string): Promise<CategoryDetail | null> {
    try {
        const category = await prisma.blogCategory.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });

        if (!category) {
            return null;
        }

        return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            color: category.color,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
            postCount: category._count.posts,
        };
    } catch (error) {
        console.error('Error fetching category details:', error);
        return null;
    }
}
