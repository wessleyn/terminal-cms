import { Container } from '@mantine/core';
import { Prisma, prisma } from '@repo/db';
import ProjectsTable, { TableProject } from './_components/ProjectsTable';

// Define the Project type to match what's expected by the ProjectsTable component

export const dynamic = 'force-dynamic';

// Helper function to safely convert JsonValue to expected engagement structure
function safeParseEngagement(engagement: Prisma.JsonValue | null): { share: number; bookmark: number; like: number; } | null {
    if (!engagement) return null;

    try {
        const parsed = engagement as { share?: number; bookmark?: number; like?: number; };

        // Check if the structure is what we expect
        if (typeof parsed === 'object' &&
            parsed !== null &&
            'share' in parsed &&
            'bookmark' in parsed &&
            'like' in parsed) {
            return {
                share: Number(parsed.share) || 0,
                bookmark: Number(parsed.bookmark) || 0,
                like: Number(parsed.like) || 0
            };
        }
    } catch (error) {
        console.error('Error parsing engagement data:', error);
    }

    return null;
}

export default async function ProjectsPage() {
    let projects: TableProject[] = []

    try {
        const fetchedProjects = await prisma.project.findMany({
            orderBy: {
                updatedAt: 'desc',
            },
        });

        // Transform the prisma data to match the Project interface
        projects = fetchedProjects.map(project => ({
            ...project,
            engagement: safeParseEngagement(project.engagement)
        }));

    } catch (error) {
        console.error('Error fetching projects:', error);
    }

    return (
        <Container fluid px="md" pt="md" style={{ height: 'calc(100vh - 64px)' }}>
            <ProjectsTable initialProjects={projects} />
        </Container>
    );
}
