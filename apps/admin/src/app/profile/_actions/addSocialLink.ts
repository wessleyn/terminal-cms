'use server';

import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { ApiResponse } from './types';

// Add new social link
export async function addSocialLink(platform: string, url: string): Promise<ApiResponse<{ id: string }>> {
    try {
        const profile = await prisma.portfolioProfile.findFirst();

        if (!profile) {
            return {
                success: false,
                error: 'Profile not found'
            };
        }

        const socialLink = await prisma.portfolioProfileSocialLink.create({
            data: {
                platform,
                url,
                portfolioProfileId: profile.id
            }
        });

        revalidatePath('/profile');
        revalidatePath('/');

        return {
            success: true,
            data: { id: socialLink.id }
        };
    } catch (error) {
        console.error('Error adding social link:', error);
        return {
            success: false,
            error: 'Failed to add social link'
        };
    }
}