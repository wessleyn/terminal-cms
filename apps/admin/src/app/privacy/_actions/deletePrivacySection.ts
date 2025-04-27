'use server';

import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { ApiResponse } from '../_types/types';

export async function deletePrivacySection(id: string): Promise<ApiResponse<void>> {
    try {
        await prisma.privacySection.delete({
            where: { id }
        });

        revalidatePath('/dashboard/privacy');
        revalidatePath('/privacy');

        return { success: true, data: undefined };
    } catch (error) {
        console.error('Failed to delete privacy section:', error);
        return {
            success: false,
            error: 'Failed to delete privacy section'
        };
    }
}
