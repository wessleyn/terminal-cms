'use server';

import { prisma } from '@repo/db';

export interface ProfileData {
  displayName: string; // Combined greeting and name
  workEmail: string;
  tagline: string;
  bio: string;
  avatarUrl: string;
  socialLinks: {
    id?: string;
    platform: string;
    url: string;
  }[];
}

export async function fetchProfile(): Promise<ProfileData | null> {
  try {
    // Try to get first profile ID or use placeholder for upsert
    const profile = await prisma.portfolioProfile.findFirst({
      select: { id: true }
    });

    const fetchedProfile = await prisma.portfolioProfile.findFirst({
      where: {
        id: profile?.id || 'no-profile-exists'
      },
      include: {
        avatars: {
          select: {
            url: true,
          },
          where: {
            isActive: true
          },
          take: 1
        },
        socialLinks: true
      }
    });

    if (!fetchedProfile) {
      return null;
    }

    // Transform the data for the frontend
    // Return null if any required field is missing
    if (!fetchedProfile.displayName || !fetchedProfile.workEmail || !fetchedProfile.tagline || !fetchedProfile.bio) {
      return null;
    }

    return {
      displayName: fetchedProfile.displayName,
      workEmail: fetchedProfile.workEmail,
      tagline: fetchedProfile.tagline,
      bio: fetchedProfile.bio,
      avatarUrl: fetchedProfile.avatars[0]?.url || '',
      socialLinks: fetchedProfile.socialLinks?.map(link => ({
        id: link.id,
        platform: link.platform,
        url: link.url
      })) ?? []
    };
  } catch (error) {
    console.error('Failed to fetch profile data:', error);
    return null;
  }
}