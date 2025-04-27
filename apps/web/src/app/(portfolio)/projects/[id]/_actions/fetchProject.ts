import { prisma, Project, PublishStatus } from "@repo/db";

// Define return type for fetchProjectById
type ProjectResult = {
    success: boolean;
    data?: Project;
    error?: string;
};

export async function fetchProjectById(projectId: string): Promise<ProjectResult> {
    try {
        const project = await prisma.project.findUnique({
            where: {
                id: projectId,
                AND: {
                    publishStatus: PublishStatus.PUBLISHED
                }
            }
        });

        if (!project) {
            return { success: false, error: 'Project not found' };
        }

        return { success: true, data: project };
    } catch (error) {
        console.error("Failed to fetch project:", error);
        return { success: false, error: 'Failed to fetch project' };
    }
}

// Legacy function for backward compatibility
export default async function fetchProject(id: string): Promise<Project | null> {
    const { success, data } = await fetchProjectById(id);

    if (success && data) {
        return data;
    }

    // Return null if project is not found
    return null;
}