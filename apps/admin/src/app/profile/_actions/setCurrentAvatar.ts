'use server';

import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { ApiResponse } from './types';

// Update active avatar
export async function setCurrentAvatar(avatarIndex: number): Promise<ApiResponse<void>> {
    try {
        const profile = await prisma.portfolioProfile.findFirst({
            include: {
                avatars: true
            }
        });

        if (!profile) {
            return {
                success: false,
                error: 'Profile not found'
            };
        }

        // Get the avatar that should be set as active
        const newActiveAvatar = profile.avatars[avatarIndex];
        
        if (!newActiveAvatar) {
            return {
                success: false,
                error: 'Avatar not found'
            };
        }

        // First, unset isActive for all avatars
        await prisma.portfolioProfileAvatar.updateMany({
            where: { 
                portfolioProfileId: profile.id 
            },
            data: { 
                isActive: false 
            }
        });

        // Then, set isActive for the selected avatar
        await prisma.portfolioProfileAvatar.update({
            where: { 
                id: newActiveAvatar.id 
            },
            data: { 
                isActive: true 
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
            error: error instanceof Error ? error.message : 'Failed to set current avatar'
        };
    }
}