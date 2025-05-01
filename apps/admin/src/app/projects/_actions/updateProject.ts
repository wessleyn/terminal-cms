'use server';

import { ActivityStatus, HappyIndex, Prisma, prisma, PublishStatus } from '@repo/db';
import { triggerPublicRevalidation } from '@utils/revalidation';
import { revalidatePath } from 'next/cache';

export type UpdateField = 'publishStatus' | 'activityStatus' | 'happyIndex'
export type newStatus = PublishStatus | ActivityStatus | HappyIndex

interface UpdateProjectData {
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  githubUrl: string;
  liveUrl: string;
}

interface UpdateProjectResult {
  success: boolean;
  data?: {
    id: string;
    [key: string]: unknown;
  };
  error?: string;
}

/**
 * Server action to update a project's status (publish or activity)
 */
export async function updateProjectStatus(
  id: string,
  field: UpdateField,
  newStatus: newStatus
) {
  try {
    // Update the project in the database
    await prisma.project.update({
      where: { id },
      data: {
        [field]: newStatus
      },
    });

    // Revalidate the projects page to show updated data
    revalidatePath('/dashboard/projects');

    // Trigger revalidation on the public frontend
    await triggerPublicRevalidation('/projects');
    await triggerPublicRevalidation(`/projects/${id}`);

    // Also revalidate the landing page since it shows featured projects
    await triggerPublicRevalidation('/');

    return { success: true };
  } catch (error) {
    console.error(`Error updating project ${field}:`, error);
    return {
      success: false,
      error: `Failed to update project ${field}`
    };
  }
}

/**
 * Server action to update a project's details
 */
export async function updateProject(id: string, data: UpdateProjectData): Promise<UpdateProjectResult> {
  try {
    // Update the project in the database
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl === '' ? null : data.imageUrl,
        tags: data.tags,
        githubUrl: data.githubUrl === '' ? null : data.githubUrl,
        liveUrl: data.liveUrl === '' ? null : data.liveUrl,
      } as Prisma.ProjectUpdateInput,
    });

    // Revalidate both dashboard and frontend routes
    revalidatePath(`/dashboard/projects/${id}`);
    revalidatePath(`/projects/${id}`);
    revalidatePath('/dashboard/projects');
    revalidatePath('/projects');

    // Trigger revalidation on the public frontend
    await triggerPublicRevalidation('/projects');
    await triggerPublicRevalidation(`/projects/${id}`);
    await triggerPublicRevalidation('/');

    return {
      success: true,
      data: updatedProject,
    };
  } catch (error) {
    console.error('Error updating project:', error);
    return {
      success: false,
      error: 'Failed to update project',
    };
  }
}

/**
 * Server action to delete a project
 */
export async function deleteProject(id: string) {
  try {
    // Delete the project from the database
    await prisma.project.delete({
      where: { id },
    });

    // Revalidate the projects page to show updated data
    revalidatePath('/dashboard/projects');

    // Trigger revalidation on the public frontend
    await triggerPublicRevalidation('/projects');
    await triggerPublicRevalidation('/');

    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    return {
      success: false,
      error: 'Failed to delete project'
    };
  }
}