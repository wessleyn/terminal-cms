'use server';

import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { ApiResponse } from './types';

// Remove an avatar
export async function removeAvatar(avatarId: string): Promise<ApiResponse<void>> {
    try {
        // First, check if this is the last avatar
        const profile = await prisma.portfolioProfile.findFirst({
            include: {
                avatars: true
            }
        });

        if (!profile || profile.avatars.length <= 1) {
            return {
                success: false,
                error: 'Cannot delete the last avatar. At least one avatar must remain.'
            };
        }

        // Check if the avatar exists and belongs to the profile
        const avatarExists = profile.avatars.some(avatar => avatar.id === avatarId);
        if (!avatarExists) {
            return {
                success: false,
                error: 'Avatar not found'
            };
        }

        // If we have multiple avatars, proceed with deletion
        await prisma.portfolioProfileAvatar.delete({
            where: { id: avatarId }
        });

        revalidatePath('/profile');
        revalidatePath('/');

        return {
            success: true
        };
    } catch (error) {
        console.error('Error removing avatar:', error);
        return {
            success: false,
            error: 'Failed to remove avatar'
        };
    }
}