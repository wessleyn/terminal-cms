'use server';

import { prisma } from '@repo/db';
import { randomBytes } from 'crypto';

export interface CreateDefaultCategoryResult {
    success: boolean;
    id?: string;
    error?: string;
}

export async function createDefaultCategory(): Promise<CreateDefaultCategoryResult> {
    try {
        // First check if we already have 4 categories
        const categoryCount = await prisma.blogCategory.count();

        if (categoryCount >= 4) {
            return {
                success: false,
                error: 'Maximum of 4 categories allowed. Please delete an existing category before creating a new one.'
            };
        }

        // Generate unique random values for name and slug
        const randomSuffix = randomBytes(4).toString('hex');
        const name = `New Category ${randomSuffix}`;
        const slug = `new-category-${randomSuffix}`;

        // Create a new category with default values
        const category = await prisma.blogCategory.create({
            data: {
                name,
                slug,
                color: '#228be6', // Default blue color
                description: 'Category description'
            },
        });

        return {
            success: true,
            id: category.id,
        };
    } catch (error) {
        console.error('Error creating default category:', error);
        return {
            success: false,
            error: 'Failed to create new category',
        };
    }
}
