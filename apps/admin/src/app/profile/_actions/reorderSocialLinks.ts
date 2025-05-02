'use server';

import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { ApiResponse } from './types';

// ReorderSocialLinks: Update the order of social links
export async function reorderSocialLinks(links: { id: string; order: number }[]): Promise<ApiResponse<void>> {
    try {
        // Update each link with its new order
        await Promise.all(
            links.map((link) =>
                prisma.portfolioProfileSocialLink.update({
                    where: { id: link.id },
                    data: { order: link.order }
                })
            )
        );

        // Revalidate paths
        revalidatePath('/profile');
        revalidatePath('/');

        return {
            success: true
        };
    } catch (error) {
        console.error('Error reordering social links:', error);
        return {
            success: false,
            error: 'Failed to reorder social links'
        };
    }
}