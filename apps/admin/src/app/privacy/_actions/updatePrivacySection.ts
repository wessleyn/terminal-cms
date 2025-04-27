'use server';

import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { ApiResponse } from '../_types/types';

export async function updatePrivacySection(
    id: string,
    data: { title?: string; content?: string; order?: number }
): Promise<ApiResponse<void>> {
    try {
        await prisma.privacySection.update({
            where: { id },
            data
        });

        revalidatePath('/dashboard/privacy');
        revalidatePath('/privacy');

        return { success: true, data: undefined };
    } catch (error) {
        console.error('Failed to update privacy section:', error);
        return {
            success: false,
            error: 'Failed to update privacy section'
        };
    }
}
