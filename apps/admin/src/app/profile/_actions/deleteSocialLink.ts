'use server';

import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { ApiResponse } from './types';

export async function deleteSocialLink(id: string): Promise<ApiResponse<void>> {
    try {
        await prisma.portfolioProfileSocialLink.delete({
            where: { id }
        });

        revalidatePath('/profile');
        revalidatePath('/');

        return {
            success: true
        };
    } catch (error) {
        console.error('Error deleting social link:', error);
        return {
            success: false,
            error: 'Failed to delete social link'
        };
    }
}