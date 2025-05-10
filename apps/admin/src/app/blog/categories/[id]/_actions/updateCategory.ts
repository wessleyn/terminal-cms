'use server';

import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

interface UpdateCategoryInput {
    id: string;
    name: string;
    slug?: string;
    description: string | null;
    color: string;
}

// Simple function to generate slug without external dependencies
function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')  // Remove special chars
        .replace(/[\s_-]+/g, '-')   // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, '');   // Remove leading/trailing hyphens
}

export async function updateCategory(data: UpdateCategoryInput) {
    try {
        // Format the slug if not provided
        const slug = data.slug || generateSlug(data.name);

        // Check if another category with the same slug exists (excluding current)
        const existingCategory = await prisma.blogCategory.findFirst({
            where: {
                slug,
                id: { not: data.id }
            }
        });

        if (existingCategory) {
            return {
                success: false,
                message: 'A category with this slug already exists'
            };
        }

        // Update the category
        const updatedCategory = await prisma.blogCategory.update({
            where: { id: data.id },
            data: {
                name: data.name,
                slug,
                description: data.description || '', // Provide a default empty string if null
                color: data.color
            }
        });

        // Revalidate relevant paths
        revalidatePath('/blog/categories');
        revalidatePath(`/blog/categories/${data.id}`);

        return {
            success: true,
            message: 'Category updated successfully',
            category: {
                id: updatedCategory.id,
                name: updatedCategory.name,
                slug: updatedCategory.slug,
                description: updatedCategory.description || '', // Ensure we don't return null
                color: updatedCategory.color
            }
        };
    } catch (error) {
        console.error('Error updating category:', error);
        return {
            success: false,
            message: 'Failed to update category'
        };
    }
}
