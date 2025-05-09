'use server';

import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

interface UploadAvatarResult {
    success: boolean;
    avatarId?: string;
    url?: string;
    error?: string;
}

// Server action to process avatar upload via Cloudinary
export async function saveUploadedAvatar(publicId: string, url: string): Promise<UploadAvatarResult> {
    try {

        const profile = await prisma.portfolioProfile.findFirst();

        if (!profile) {
            return {
                success: false,
                error: "Profile not found"
            };
        }

        // Reset isNew flag for all existing avatars
        await prisma.portfolioProfileAvatar.updateMany({
            where: {
                portfolioProfileId: profile.id,
                isNew: true
            },
            data: {
                isNew: false
            }
        });

        // Create the new avatar with isNew flag set to true
        const avatar = await prisma.portfolioProfileAvatar.create({
            data: {
                publicId,
                url,
                isNew: true,
                portfolioProfileId: profile.id
            }
        });

        // Revalidate paths that might show the profile
        revalidatePath('/profile');
        revalidatePath('/');

        return {
            success: true,
            avatarId: avatar.id,
            url: avatar.url
        };
    } catch (error) {
        console.error("Error uploading avatar:", error);
        return {
            success: false,
            error: "Failed to upload avatar"
        };
    }
}