'use server';

import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { ApiResponse, PrivacySection } from '../_types/types';

export async function reorderPrivacySections(items: PrivacySection[]): Promise<ApiResponse<void>> {
    try {
        // Update each item with its new order
        await Promise.all(
            items.map((item, index) =>
                prisma.privacySection.update({
                    where: { id: item.id },
                    data: { order: index }
                })
            )
        );

        revalidatePath('/dashboard/privacy');
        revalidatePath('/privacy');

        return { success: true, data: undefined };
    } catch (error) {
        console.error('Failed to reorder privacy sections:', error);
        return {
            success: false,
            error: 'Failed to reorder privacy sections'
        };
    }
}
