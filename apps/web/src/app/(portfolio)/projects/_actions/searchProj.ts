'use server'

import { prisma, Project, PublishStatus } from "@repo/db";

type SearchProjectsResult = {
    success: boolean;
    data?: Project[];
    error?: string;
};

export async function searchProjects(searchTerm: string): Promise<SearchProjectsResult> {
    try {
        const projects = await prisma.project.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                    {
                        description: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                    {
                        tags: {
                            has: searchTerm,
                        },
                    },
                ],
                AND: {
                    publishStatus: PublishStatus.PUBLISHED
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return { success: true, data: projects };
    } catch (error) {
        console.error("Failed to search projects:", error);
        return { success: false, error: 'Failed to search projects' };
    }
}