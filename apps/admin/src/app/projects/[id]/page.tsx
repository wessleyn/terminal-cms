import { Container, Paper } from '@mantine/core';
import { Prisma, prisma } from '@repo/db';
import { notFound } from 'next/navigation';
import ProjectDetail from './_components/ProjectDetail';

interface ProjectParams {
    params: Promise<{
        id: string;
    }>;
}

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

export default async function ProjectPage({ params }: ProjectParams) {
    // Properly await the params object before accessing its properties
    const { id } = await params;

    // Fetch project data
    const project = await prisma.project.findUnique({
        where: { id }
    });

    if (!project) {
        notFound();
    }

    // Transform engagement data
    const transformedProject = {
        ...project,
        engagement: safeParseEngagement(project.engagement)
    };

    return (
        <Container size="xl" py="lg">
            <Paper p="md" radius="md" withBorder shadow="xs">
                {/* <Title order={2} mb="md" fw={500}>Project Details</Title> */}
                <ProjectDetail project={transformedProject} />
            </Paper>
        </Container>
    );
}