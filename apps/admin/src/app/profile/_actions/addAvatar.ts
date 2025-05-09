'use server';

import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { ApiResponse } from './types';

// Add a new avatar
export async function addAvatar(url: string): Promise<ApiResponse<{ id: string }>> {
    try {
        const profile = await prisma.portfolioProfile.findFirst();

        if (!profile) {
            return {
                success: false,
                error: 'Profile not found'
            };
        }

        const avatar = await prisma.portfolioProfileAvatar.create({
            data: {
                url,
                portfolioProfileId: profile.id
            }
        });

        revalidatePath('/profile');
        revalidatePath('/');

        return {
            success: true,
            data: { id: avatar.id }
        };
    } catch (error) {
        console.error('Error adding avatar:', error);
        return {
            success: false,
            error: 'Failed to add avatar'
        };
    }
}