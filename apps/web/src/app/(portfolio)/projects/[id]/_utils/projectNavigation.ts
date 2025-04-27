import { prisma } from "@repo/db";

// Helper function to get navigation links for projects
export async function getProjectNavigation(currentId: string) {
    try {
        // Get all projects ordered by creation date
        const allProjects = await prisma.project.findMany({
            select: {
                id: true,
                title: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Find the index of the current project
        const currentIndex = allProjects.findIndex((project: { id: string; }) => project.id === currentId);

        // If project not found in the array
        if (currentIndex === -1) {
            return { prevProject: null, nextProject: null };
        }

        // Determine previous and next projects
        const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
        const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

        return { prevProject, nextProject };
    } catch (error) {
        console.error('Error getting project navigation:', error);
        return { prevProject: null, nextProject: null };
    }
}