'use server';

import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { ApiResponse } from './types';

// Update avatar order
export async function setCurrentAvatar(avatarIndex: number): Promise<ApiResponse<void>> {
    try {
        const profile = await prisma.portfolioProfile.findFirst();

        if (!profile) {
            return {
                success: false,
                error: 'Profile not found'
            };
        }

        await prisma.portfolioProfile.update({
            where: { id: profile.id },
            data: {
                currentAvatarIndex: avatarIndex
            }
        });

        revalidatePath('/profile');
        revalidatePath('/');

        return {
            success: true
        };
    } catch (error) {
        console.error('Error setting current avatar:', error);
        return {
            success: false,
            error: 'Failed to set current avatar'
        };
    }
}