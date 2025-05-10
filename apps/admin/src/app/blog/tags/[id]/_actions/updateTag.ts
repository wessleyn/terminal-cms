'use server';

import { BlogTagType, prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';

interface UpdateTagInput {
    id: string;
    name: string;
    description: string;
    color: string;
    type: BlogTagType;
}

interface UpdateTagResult {
    success: boolean;
    message?: string;
    tag?: {
        id: string;
        name: string;
        slug: string;
        description: string;
        color: string;
        type: BlogTagType;
    };
}

export async function updateTag(data: UpdateTagInput): Promise<UpdateTagResult> {
    try {
        // Generate a slug from the name using a simple function instead of relying on the slugify package
        const slug = data.name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')     // Remove non-word chars
            .replace(/\s+/g, '-')         // Replace spaces with hyphens
            .replace(/-+/g, '-')          // Replace multiple hyphens with single hyphen
            .trim();                       // Remove trailing spaces/hyphens

        // Check if slug already exists for another tag
        const existingTag = await prisma.blogTag.findFirst({
            where: {
                slug,
                id: { not: data.id },
            },
        });

        if (existingTag) {
            return {
                success: false,
                message: `A tag with slug "${slug}" already exists. Please use a different name.`,
            };
        }

        const updatedTag = await prisma.blogTag.update({
            where: { id: data.id },
            data: {
                name: data.name,
                slug,
                description: data.description,
                color: data.color,
                type: data.type,
            },
        });

        // Revalidate related paths
        revalidatePath('/blog/tags');
        revalidatePath(`/blog/tags/${data.id}`);

        return {
            success: true,
            tag: updatedTag,
            message: 'Tag updated successfully',
        };
    } catch (error) {
        console.error('Error updating tag:', error);
        return {
            success: false,
            message: 'Failed to update tag',
        };
    }
}
