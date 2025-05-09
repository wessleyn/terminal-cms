'use server';

import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { ApiResponse } from './types';

// Update social link
export async function updateSocialLink(id: string, url: string, platform: string): Promise<ApiResponse<void>> {
    try {
        await prisma.portfolioProfileSocialLink.update({
            where: { id },
            data: { url, platform }
        });

        revalidatePath('/profile');
        revalidatePath('/');

        return {
            success: true
        };
    } catch (error) {
        console.error('Error updating social link:', error);
        return {
            success: false,
            error: 'Failed to update social link'
        };
    }
}