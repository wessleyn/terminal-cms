'use server';

import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { ApiResponse, ProfileData } from './types';

// Update profile information
export async function updateProfile(data: Partial<ProfileData>): Promise<ApiResponse<void>> {
  try {
    // Get the profile ID
    const profile = await prisma.portfolioProfile.findFirst({
      select: { id: true }
    });

    if (!profile) {
      return {
        success: false,
        error: 'Profile not found'
      };
    }

    // Update basic profile data
    await prisma.portfolioProfile.update({
      where: { id: profile.id },
      data: {
        displayName: data.displayName,
        workEmail: data.workEmail,
        tagline: data.tagline,
        description: data.description,
        ...(data.currentAvatarIndex !== undefined && { currentAvatarIndex: data.currentAvatarIndex })
      }
    });

    // Revalidate paths to update the profile data
    revalidatePath('/profile');
    revalidatePath('/');

    return {
      success: true
    };
  } catch (error) {
    console.error('Error updating profile:', error);
    return {
      success: false,
      error: 'Failed to update profile'
    };
  }
}