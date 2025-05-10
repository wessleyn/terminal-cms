'use server';

import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';

export async function deleteCategory(categoryId: string) {
    try {
        // First check if the category exists
        const category = await prisma.blogCategory.findUnique({
            where: { id: categoryId },
            include: { posts: { select: { id: true } } }
        });

        if (!category) {
            return {
                success: false,
                message: 'Category not found'
            };
        }

        // Check if category has associated posts
        if (category.posts.length > 0) {
            return {
                success: false,
                message: 'Cannot delete category with associated posts. Please reassign posts first.'
            };
        }

        // Delete the category
        await prisma.blogCategory.delete({
            where: { id: categoryId }
        });

        // Revalidate related paths
        revalidatePath('/blog/categories');

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
