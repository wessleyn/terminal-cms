import { Container, Paper } from '@mantine/core';
import { prisma } from '@repo/db';
import { notFound } from 'next/navigation';
import ProjectDetail from './_components/ProjectDetail';

interface ProjectParams {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProjectPage({ params }: ProjectParams) {
    // Properly await the params object before accessing its properties
    const { id } = await params;

    // Fetch project data with its engagement
    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            projectEngagement: true
        }
    });

    if (!project) {
        notFound();
    }

    // Transform engagement data
    const transformedProject = {
        ...project,
        engagement: project.projectEngagement ? {
            share: project.projectEngagement.shares,
            bookmark: project.projectEngagement.bookmarks,
            like: project.projectEngagement.likes
        } : null
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