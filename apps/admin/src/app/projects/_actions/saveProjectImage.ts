'use server';

import { prisma } from '@repo/db';
import { triggerPublicRevalidation } from '@utils/revalidation';
import { revalidatePath } from 'next/cache';

interface SaveImageResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Server action to save a project image uploaded to Cloudinary
 */
export async function saveProjectImage(
  projectId: string,
  publicId: string,
  url: string
): Promise<SaveImageResult> {
  try {
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        imageUrl: url,
      },
    });

    revalidatePath(`/dashboard/projects/${projectId}`);
    revalidatePath(`/projects/${projectId}`);
    revalidatePath('/dashboard/projects');
    revalidatePath('/projects');

    await triggerPublicRevalidation('/projects');
    await triggerPublicRevalidation(`/projects/${projectId}`);
    await triggerPublicRevalidation('/');

    return {
      success: true,
      url: updatedProject.imageUrl || undefined,
    };
  } catch (error) {
    console.error('Error saving project image:', error);
    return {
      success: false,
      error: 'Failed to save project image'
    };
  }
}
