'use server';

import { BlogTagType, prisma } from '@repo/db';
import { randomBytes } from 'crypto';

export interface CreateDefaultTagResult {
    success: boolean;
    id?: string;
    error?: string;
}

export async function createDefaultTag(): Promise<CreateDefaultTagResult> {
    try {
        // Generate unique random values for name and slug
        const randomSuffix = randomBytes(4).toString('hex');
        const name = `New Tag ${randomSuffix}`;
        const slug = `new-tag-${randomSuffix}`;

        // Create a new tag with default values
        const tag = await prisma.blogTag.create({
            data: {
                name,
                slug,
                type: BlogTagType.BLOG,
            },
        });

        return {
            success: true,
            id: tag.id,
        };
    } catch (error) {
        console.error('Error creating default tag:', error);
        return {
            success: false,
            error: 'Failed to create new tag',
        };
    }
}
