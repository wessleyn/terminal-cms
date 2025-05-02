'use server';

import { prisma } from '@repo/db';

export interface ProfileData {
  displayName: string; // Combined greeting and name
  workEmail: string;
  tagline: string;
  description: string;
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
        avatars: true,
        socialLinks: true
      }
    });

    if (!fetchedProfile) {
      return null;
    }

    // Get the current avatar URL
    const safeAvatarIndex = fetchedProfile.avatars && fetchedProfile.avatars.length > 0
      ? Math.min(fetchedProfile.currentAvatarIndex || 0, fetchedProfile.avatars.length - 1)
      : 0;

    // Since we've enforced that at least one avatar must exist in the system,
    // we can safely assert that avatarUrl will be a string
    const avatarUrl = (fetchedProfile.avatars && fetchedProfile.avatars.length > 0
      ? (fetchedProfile.avatars[safeAvatarIndex]?.url || fetchedProfile.avatars[0]?.url)
      : '/assets/img/profile.png') as string;

    // Transform the data for the frontend
    // Return null if any required field is missing
    if (!fetchedProfile.displayName || !fetchedProfile.workEmail || !fetchedProfile.tagline || !fetchedProfile.description) {
      return null;
    }

    return {
      displayName: fetchedProfile.displayName,
      workEmail: fetchedProfile.workEmail,
      tagline: fetchedProfile.tagline,
      description: fetchedProfile.description,
      avatarUrl,
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