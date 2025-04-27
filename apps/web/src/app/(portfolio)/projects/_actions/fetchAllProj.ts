'use server';

import { prisma, Project, PublishStatus } from "@repo/db";

export async function fetchAllProjects(): Promise<{ success: boolean; data?: Project[]; error?: string }> {
    try {
        const projects = await prisma.project.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            where: {
                publishStatus: PublishStatus.PUBLISHED
            }
        });

        return { success: true, data: projects };
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        return { success: false, error: 'Failed to fetch projects' };
    }
}

export async function fetchFeaturedProjects(): Promise<{ success: boolean; data?: Project[]; error?: string }> {
    try {
        const projects = await prisma.project.findMany({
            where: {
                featured: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return { success: true, data: projects };
    } catch (error) {
        console.error("Failed to fetch featured projects:", error);
        return { success: false, error: 'Failed to fetch featured projects' };
    }
}