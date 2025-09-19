'use server';

import { ActivityStatus, prisma, PublishStatus } from '@repo/db';
import { triggerPublicRevalidation } from '@utils/revalidation';
import { revalidatePath } from 'next/cache';

interface CreateProjectResult {
    success: boolean;
    data?: {
        id: string;
    };
    error?: string;
}

export async function createProject(): Promise<CreateProjectResult> {
    try {
        // Create a new project with default values and associated engagement
        const newProject = await prisma.project.create({
            data: {
                title: 'New Project',
                description: 'Project description goes here',
                imageUrl: '/assets/img/projects/project1.webp', // Default placeholder
                tags: ['New'],
                featured: false,
                publishStatus: PublishStatus.DRAFT,
                activityStatus: ActivityStatus.NOT_STARTED,
                projectEngagement: {
                    create: {
                        shares: 0,
                        bookmarks: 0,
                        likes: 0,
                    }
                }
            },
        });

        // Revalidate the projects page to show the new project
        revalidatePath('/dashboard/projects');

        // Trigger revalidation on the public frontend if the project is published
        if (newProject.publishStatus === PublishStatus.PUBLISHED) {
            await triggerPublicRevalidation('/projects');
        }

        return {
            success: true,
            data: {
                id: newProject.id,
            },
        };
    } catch (error) {
        console.error('Error creating project:', error);
        return {
            success: false,
            error: 'Failed to create project',
        };
    }
}