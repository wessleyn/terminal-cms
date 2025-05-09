'use server';

import { prisma } from '@repo/db';
import { ApiResponse, DEFAULT_AVATARS, DEFAULT_PROFILE, DEFAULT_SOCIAL_LINKS, ProfileAvatar, ProfileData } from './types';

// Fetch profile data with auto-creation if not exists
export async function fetchProfileData(): Promise<ApiResponse<ProfileData>> {
  try {
    // First, try to find an existing profile
    const existingProfile = await prisma.portfolioProfile.findFirst({
      select: { id: true }
    });

    // Prepare the profile ID for upsert - use existing ID or a placeholder
    const profileId = existingProfile?.id || 'no-profile-exists';

    // Use upsert to create/fetch the profile
    const profile = await prisma.portfolioProfile.upsert({
      where: { id: profileId },
      update: {}, // No updates if found, just return it
      create: {
        displayName: `${DEFAULT_PROFILE.greeting} ${DEFAULT_PROFILE.name}`,
        workEmail: DEFAULT_PROFILE.workEmail,
        tagline: DEFAULT_PROFILE.tagline,
        bio: DEFAULT_PROFILE.bio,

        // Create default avatars
        avatars: {
          create: DEFAULT_AVATARS.map(avatar => ({
            url: avatar.url,
            publicId: avatar.publicId,
            isNew: avatar.isNew,
            isActive: true // Set first avatar as active
          }))
        },

        // Create default social links
        socialLinks: {
          create: DEFAULT_SOCIAL_LINKS.map(link => ({
            platform: link.platform,
            url: link.url,
            order: link.order || 0
          }))
        }
      },
      include: {
        avatars: true,
        socialLinks: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    // Find the current "active" avatar (using isActive flag from schema)
    const currentAvatar = profile.avatars.find((avatar: ProfileAvatar) => avatar.isActive === true);
    const currentAvatarIndex = currentAvatar
      ? profile.avatars.findIndex((avatar: ProfileAvatar) => avatar.id === currentAvatar.id)
      : 0;

    // Map from DB schema to our ProfileData interface
    const profileData: ProfileData = {
      id: profile.id,
      name: DEFAULT_PROFILE.name, // Using default since DB doesn't store this separately
      greeting: DEFAULT_PROFILE.greeting, // Using default since DB doesn't store this separately
      displayName: profile.displayName,
      tagline: profile.tagline,
      bio: profile.bio,
      workEmail: profile.workEmail,
      avatars: profile.avatars,
      socialLinks: profile.socialLinks,
      currentAvatarIndex: currentAvatarIndex >= 0 ? currentAvatarIndex : 0
    };

    // Return formatted profile data
    return {
      success: true,
      data: profileData
    };
  } catch (error) {
    console.error('Error fetching/creating profile data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch or create profile data'
    };
  }
}