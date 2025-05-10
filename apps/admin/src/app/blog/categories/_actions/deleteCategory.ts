'use server';

import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

interface DeleteCategoryResult {
    success: boolean;
    message: string;
}

export async function deleteCategory(categoryId: string): Promise<DeleteCategoryResult> {
    try {
        // First check if there's a default category to move posts to
        const defaultCategory = await prisma.blogCategory.findFirst({
            where: {
                NOT: {
                    id: categoryId
                }
            },
            orderBy: {
                createdAt: 'asc' // Get the oldest category as default
            }
        });

        // If this is the only category, prevent deletion
        if (!defaultCategory) {
            return {
                success: false,
                message: 'Cannot delete the only category. Create another category first.'
            };
        }

        // Move posts to the default category
        await prisma.blogPost.updateMany({
            where: {
                categoryId
            },
            data: {
                categoryId: defaultCategory.id
            }
        });

        // Now delete the category
        await prisma.blogCategory.delete({
            where: {
                id: categoryId
            }
        });

        // Revalidate category paths
        revalidatePath('/blog/categories');
        revalidatePath('/blog/posts');

        return {
            success: true,
            message: 'Category deleted successfully'
        };
    } catch (error) {
        console.error('Error deleting category:', error);
        return {
            success: false,
            message: 'Failed to delete category'
        };
    }
}
