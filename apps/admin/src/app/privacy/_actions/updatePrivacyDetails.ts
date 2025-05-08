'use server';

import { prisma, PrivacyType } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { ApiResponse } from '../_types/types';

export async function updatePrivacyDescription(
    type: PrivacyType = PrivacyType.PORTFOLIO,
    descPhrase: string
): Promise<ApiResponse<void>> {
    try {
        await prisma.privacy.update({
            where: { type },
            data: { descPhrase }
        });

        revalidatePath('/dashboard/privacy');
        revalidatePath('/privacy');

        return { success: true, data: undefined };
    } catch (error) {
        console.error('Failed to update privacy description:', error);
        return {
            success: false,
            error: 'Failed to update privacy description'
        };
    }
}
